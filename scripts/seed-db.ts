// Seed script menggunakan pg langsung
import pg from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env file");
  process.exit(1);
}

const categories = [
  { name: "Gaji", type: "income" },
  { name: "Penjualan", type: "income" },
  { name: "Investasi", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Hadiah", type: "income" },
  { name: "Lain-lain", type: "income" },
  { name: "Kebutuhan", type: "expense" },
  { name: "Tagihan", type: "expense" },
  { name: "Makanan", type: "expense" },
  { name: "Transportasi", type: "expense" },
  { name: "Hiburan", type: "expense" },
  { name: "Kesehatan", type: "expense" },
  { name: "Pendidikan", type: "expense" },
  { name: "Belanja", type: "expense" },
  { name: "Lainnya", type: "expense" },
];

async function main() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🌱 Connected to database\n");

    // Create default user
    const userResult = await client.query(
      `INSERT INTO "User" (id, email, name, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, email`,
      ['default-user-' + Date.now(), 'demo@cashtrack.local', 'Demo User']
    );
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Default user created: ${userResult.rows[0].email} (ID: ${userId})\n`);

    // Create categories
    console.log("📁 Creating categories:");
    for (const cat of categories) {
      try {
        await client.query(
          `INSERT INTO "Category" (id, name, type, "userId")
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (name, type) DO NOTHING`,
          [`cat-${cat.type}-${cat.name}-${Date.now()}`, cat.name, cat.type, userId]
        );
        console.log(`  ✅ ${cat.name} (${cat.type})`);
      } catch (e: any) {
        console.log(`  ⚠️  ${cat.name} (${cat.type}) - ${e.message}`);
      }
    }

    console.log("\n✅ Database seeding completed successfully!\n");
    console.log("📝 You can now use the application:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Open: http://localhost:3000");
    console.log("   3. Login with: demo@cashtrack.local\n");

  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
