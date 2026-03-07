const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log("🔄 Adding discountPrice column to MembershipPlan table...\n");

    await prisma.$executeRaw`
      ALTER TABLE "MembershipPlan" ADD COLUMN IF NOT EXISTS "discountPrice" INTEGER;
    `;

    console.log("✅ Migration completed successfully!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
