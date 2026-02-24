import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import ExcelJS from "exceljs";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().optional(),
  q: z.string().optional(),
  format: z.enum(["csv", "xlsx"]).default("csv"),
});

const buildCSV = (rows: any[]) => {
  if (!rows.length) return "Tanggal,Deskripsi,Kategori,Tipe,Jumlah\n";
  const headers = ["Tanggal", "Deskripsi", "Kategori", "Tipe", "Jumlah"];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = rows
    .map((r) =>
      [
        r.date.toISOString().slice(0, 10),
        r.description,
        r.category?.name || "",
        r.type,
        r.amount,
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
  const { from, to, type, categoryId, q, format } = parsed.data;
  const where: any = {};
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }
  if (q) where.description = { contains: q, mode: "insensitive" };
  const rows = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    include: { category: true },
  });

  if (format === "csv") {
    const csv = buildCSV(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="transactions.csv"',
      },
    });
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Transactions");
  ws.addRow(["Tanggal", "Deskripsi", "Kategori", "Tipe", "Jumlah"]);
  rows.forEach((r) => {
    ws.addRow([
      r.date.toISOString().slice(0, 10),
      r.description,
      r.category?.name || "",
      r.type,
      r.amount,
    ]);
  });
  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="transactions.xlsx"',
    },
  });
}
