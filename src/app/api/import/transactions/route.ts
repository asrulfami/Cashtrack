import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "File kosong atau tidak ada data" }, { status: 400 });
    }

    // Parse CSV header
    const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
    
    // Find column indices
    const dateIndex = header.findIndex((h) => h.includes("tanggal") || h.includes("date"));
    const descIndex = header.findIndex((h) => h.includes("deskripsi") || h.includes("description") || h.includes("keterangan"));
    const amountIndex = header.findIndex((h) => h.includes("jumlah") || h.includes("amount"));
    const typeIndex = header.findIndex((h) => h.includes("tipe") || h.includes("type"));
    const categoryIndex = header.findIndex((h) => h.includes("kategori") || h.includes("category"));

    if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
      return NextResponse.json({ 
        error: "Format CSV tidak valid. Harus ada kolom: Tanggal, Deskripsi, Jumlah" 
      }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      
      try {
        const dateStr = values[dateIndex];
        const description = values[descIndex];
        const amountStr = values[amountIndex]?.replace(/[^0-9-]/g, "");
        const typeVal = typeIndex !== -1 ? values[typeIndex]?.toLowerCase() : "";
        const categoryVal = categoryIndex !== -1 ? values[categoryIndex] : "";

        // Parse date
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          errors.push(`Baris ${i + 1}: Format tanggal tidak valid`);
          errorCount++;
          continue;
        }

        // Parse amount
        const amount = parseInt(amountStr);
        if (isNaN(amount)) {
          errors.push(`Baris ${i + 1}: Jumlah tidak valid`);
          errorCount++;
          continue;
        }

        // Determine type
        let type: "income" | "expense" = amount > 0 ? "income" : "expense";
        if (typeVal.includes("income") || typeVal.includes("pemasukan")) {
          type = "income";
        } else if (typeVal.includes("expense") || typeVal.includes("pengeluaran")) {
          type = "expense";
        }

        // Find or create category
        let categoryId: string | null = null;
        if (categoryVal) {
          let category = categories.find((c) => c.name.toLowerCase() === categoryVal.toLowerCase() && c.type === type);
          if (!category) {
            category = await prisma.category.create({
              data: {
                name: categoryVal,
                type,
                userId: user.id,
              },
            });
          }
          categoryId = category.id;
        }

        // Create transaction
        await prisma.transaction.create({
          data: {
            userId: user.id,
            date,
            description,
            amount,
            type,
            categoryId,
          },
        });

        successCount++;
      } catch (error: any) {
        errors.push(`Baris ${i + 1}: ${error.message}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: successCount,
      errors: errorCount,
      errorDetails: errors.slice(0, 10), // Limit error messages
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
