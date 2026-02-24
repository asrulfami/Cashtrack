import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { transactionUpdateSchema } from "@/lib/schemas/transaction";

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
  const parsed = transactionUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const id = parsedParams.data.id;
  const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const payload: any = {};
  if (parsed.data.date) payload.date = new Date(parsed.data.date);
  if (parsed.data.description !== undefined) payload.description = parsed.data.description;
  if (parsed.data.amount !== undefined) payload.amount = parsed.data.amount;
  if (parsed.data.type) payload.type = parsed.data.type;
  if (parsed.data.categoryId !== undefined) payload.categoryId = parsed.data.categoryId || null;
  if (parsed.data.paymentMethod !== undefined) payload.paymentMethod = parsed.data.paymentMethod || null;
  const updated = await prisma.transaction.update({
    where: { id },
    data: payload,
  });
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
  const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
