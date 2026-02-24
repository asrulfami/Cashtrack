import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { investmentUpdateSchema } from "@/lib/schemas/investment";

const paramsSchema = z.object({ id: z.string().min(1) });

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = await context.params;
  const parsedParams = paramsSchema.safeParse(p);
  if (!parsedParams.success) return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  const body = await request.json();
  const parsed = investmentUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const id = parsedParams.data.id;
  const existing = await prisma.investment.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const payload: any = {};
  if (parsed.data.name !== undefined) payload.name = parsed.data.name;
  if (parsed.data.kind) payload.kind = parsed.data.kind;
  if (parsed.data.buyDate) payload.buyDate = new Date(parsed.data.buyDate);
  if (parsed.data.units !== undefined) payload.units = parsed.data.units;
  if (parsed.data.buyPrice !== undefined) payload.buyPrice = parsed.data.buyPrice;
  if (parsed.data.currentPrice !== undefined) payload.currentPrice = parsed.data.currentPrice;
  const updated = await prisma.investment.update({ where: { id }, data: payload });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = await context.params;
  const parsedParams = paramsSchema.safeParse(p);
  if (!parsedParams.success) return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  const id = parsedParams.data.id;
  const existing = await prisma.investment.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.investment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
