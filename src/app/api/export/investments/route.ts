import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import ExcelJS from "exceljs";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  kind: z.enum(["stock", "bond", "deposit", "mutual_fund", "other"]).optional(),
  format: z.enum(["csv", "xlsx"]).default("csv"),
});

const buildCSV = (rows: any[]) => {
  if (!rows.length) return "Nama,Jenis,TanggalBeli,Unit,HargaBeli,HargaSaatIni,NilaiSaatIni\n";
  const headers = ["Nama", "Jenis", "TanggalBeli", "Unit", "HargaBeli", "HargaSaatIni", "NilaiSaatIni"];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[\",\n]/.test(s) ? `\"${s.replace(/\"/g, '\"\"')}\"` : s;
  };
  const body = rows
    .map((r) =>
      [
        r.name,
        r.kind,
        r.buyDate.toISOString().slice(0, 10),
        r.units,
        r.buyPrice,
        r.currentPrice,
        r.units * r.currentPrice,
      ]
        .map(escape)
        .join(",")
    )
    .join("\n");
  return headers.join(",") + "\n" + body + "\n";
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const { from, to, q, kind, format } = parsed.data;
  const where: any = {};
  if (kind) where.kind = kind;
  if (from || to) {
    where.buyDate = {};
    if (from) where.buyDate.gte = new Date(from);
    if (to) where.buyDate.lte = new Date(to);
  }
  if (q) where.name = { contains: q, mode: "insensitive" };
  const rows = await prisma.investment.findMany({
    where,
    orderBy: { buyDate: "desc" },
  });

  if (format === "csv") {
    const csv = buildCSV(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="investments.csv"',
      },
    });
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Investments");
  ws.addRow(["Nama", "Jenis", "TanggalBeli", "Unit", "HargaBeli", "HargaSaatIni", "NilaiSaatIni"]);
  rows.forEach((r) => {
    ws.addRow([
      r.name,
      r.kind,
      r.buyDate.toISOString().slice(0, 10),
      r.units,
      r.buyPrice,
      r.currentPrice,
      r.units * r.currentPrice,
    ]);
  });
  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="investments.xlsx"',
    },
  });
}
