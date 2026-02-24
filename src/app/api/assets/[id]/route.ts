import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { assetUpdateSchema } from "@/lib/schemas/asset";

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
  const parsed = assetUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const id = parsedParams.data.id;
  const existing = await prisma.asset.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const payload: any = {};
  if (parsed.data.name !== undefined) payload.name = parsed.data.name;
  if (parsed.data.acquisitionValue !== undefined) payload.acquisitionValue = parsed.data.acquisitionValue;
  if (parsed.data.acquisitionDate) payload.acquisitionDate = new Date(parsed.data.acquisitionDate);
  if (parsed.data.depreciation !== undefined) payload.depreciation = parsed.data.depreciation ?? null;
  if (parsed.data.status) payload.status = parsed.data.status;
  const updated = await prisma.asset.update({ where: { id }, data: payload });
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
  const existing = await prisma.asset.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.asset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
