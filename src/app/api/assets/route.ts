import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { assetCreateSchema } from "@/lib/schemas/asset";

const listQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const { from, to, q } = parsed.data;
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
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = assetCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data = parsed.data;
  const row = await prisma.asset.create({
    data: {
      userId: user.id,
      name: data.name,
      acquisitionValue: data.acquisitionValue,
      acquisitionDate: new Date(data.acquisitionDate),
      depreciation: data.depreciation,
      status: data.status,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
