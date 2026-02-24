import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

const listQuery = z.object({
  type: z.enum(["income", "expense"]).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const { type } = parsed.data;
  const where: any = {};
  if (type) where.type = type;
  const rows = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = categoryCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data = parsed.data;
  const row = await prisma.category.create({
    data: {
      userId: user.id,
      name: data.name,
      type: data.type,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
