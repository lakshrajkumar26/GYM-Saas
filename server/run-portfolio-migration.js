const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log("🔄 Creating Portfolio table...\n");

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Portfolio" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "content" TEXT,
        "type" TEXT NOT NULL,
        "section" TEXT,
        "mediaUrl" TEXT,
        "thumbnailUrl" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;

    console.log("✅ Creating indexes...\n");

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Portfolio_type_idx" ON "Portfolio"("type");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Portfolio_section_idx" ON "Portfolio"("section");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Portfolio_isPublished_idx" ON "Portfolio"("isPublished");
    `;

    console.log("✅ Portfolio table created successfully!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
