import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/budgets - List budgets for current month
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const now = new Date();
    const budgetYear = year ? parseInt(year) : now.getFullYear();
    const budgetMonth = month ? parseInt(month) : now.getMonth() + 1;

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        year: budgetYear,
        month: budgetMonth,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(budgets);
  } catch (error: any) {
    console.error("Budget GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/budgets - Create budget
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { categoryId, amount, period = "monthly", year, month } = body;

    const now = new Date();
    const budgetYear = year || now.getFullYear();
    const budgetMonth = month || now.getMonth() + 1;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount harus lebih dari 0" }, { status: 400 });
    }

    // Create or update budget (upsert)
    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_year_month: {
          userId: user.id,
          categoryId: categoryId || null,
          year: budgetYear,
          month: budgetMonth,
        },
      },
      update: {
        amount,
        period,
      },
      create: {
        userId: user.id,
        categoryId,
        amount,
        period,
        year: budgetYear,
        month: budgetMonth,
      },
    });

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error("Budget POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
