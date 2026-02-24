import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import ExcelJS from "exceljs";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  format: z.enum(["csv", "xlsx"]).default("csv"),
});

const buildCSV = (rows: any[]) => {
  if (!rows.length) return "Nama,NilaiPerolehan,TanggalPerolehan,Depresiasi,Status\n";
  const headers = ["Nama", "NilaiPerolehan", "TanggalPerolehan", "Depresiasi", "Status"];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[\",\n]/.test(s) ? `\"${s.replace(/\"/g, '\"\"')}\"` : s;
  };
  const body = rows
    .map((r) =>
      [
        r.name,
        r.acquisitionValue,
        r.acquisitionDate.toISOString().slice(0, 10),
        r.depreciation ?? "",
        r.status,
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
  const { from, to, q, format } = parsed.data;
  const where: any = {};
  if (from || to) {
    where.acquisitionDate = {};
    if (from) where.acquisitionDate.gte = new Date(from);
    if (to) where.acquisitionDate.lte = new Date(to);
  }
  if (q) where.name = { contains: q, mode: "insensitive" };
  const rows = await prisma.asset.findMany({
    where,
    orderBy: { acquisitionDate: "desc" },
  });

  if (format === "csv") {
    const csv = buildCSV(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="assets.csv"',
      },
    });
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Assets");
  ws.addRow(["Nama", "NilaiPerolehan", "TanggalPerolehan", "Depresiasi", "Status"]);
  rows.forEach((r) => {
    ws.addRow([
      r.name,
      r.acquisitionValue,
      r.acquisitionDate.toISOString().slice(0, 10),
      r.depreciation ?? "",
      r.status,
    ]);
  });
  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="assets.xlsx"',
    },
  });
}
