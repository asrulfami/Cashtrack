import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { transactionCreateSchema } from "@/lib/schemas/transaction";

const listQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const { from, to, type, categoryId, q } = parsed.data;
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
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = transactionCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data = parsed.data;
  const row = await prisma.transaction.create({
    data: {
      userId: user.id,
      date: new Date(data.date),
      description: data.description,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      paymentMethod: data.paymentMethod,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
