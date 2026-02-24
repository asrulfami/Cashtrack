import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { investmentCreateSchema } from "@/lib/schemas/investment";

const listQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  kind: z.enum(["stock", "bond", "deposit", "mutual_fund", "other"]).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const { from, to, q, kind } = parsed.data;
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
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = investmentCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data = parsed.data;
  const row = await prisma.investment.create({
    data: {
      userId: user.id,
      name: data.name,
      kind: data.kind,
      buyDate: new Date(data.buyDate),
      units: data.units,
      buyPrice: data.buyPrice,
      currentPrice: data.currentPrice,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
