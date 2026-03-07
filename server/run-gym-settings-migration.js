const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log("🔄 Running GymSettings migration...\n");

    // Check if table already exists
    try {
      const existing = await prisma.gymSettings.findFirst();
      if (existing) {
        console.log("✅ GymSettings table already exists!");
        console.log("Current settings:", existing);
        return;
      }
    } catch (error) {
      console.log("Table doesn't exist yet, creating...\n");
    }

    // Run the migration SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GymSettings" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL DEFAULT 'B Gym International',
          "address" TEXT,
          "phone" TEXT,
          "email" TEXT,
          "description" TEXT,
          "logo" TEXT,
          "website" TEXT,
          "facebook" TEXT,
          "instagram" TEXT,
          "twitter" TEXT,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("✅ GymSettings table created!\n");

    // Insert default settings
    const defaultSettings = await prisma.gymSettings.create({
      data: {
        name: process.env.GYM_NAME || "B Gym International",
        address: process.env.GYM_ADDRESS || "Your Gym Address Here",
        phone: process.env.GYM_PHONE || "+91-7903906436",
        email: process.env.GYM_EMAIL || "info@bgym.com",
        description: "Transform your body, transform your life"
      }
    });

    console.log("✅ Default settings inserted!");
    console.log(JSON.stringify(defaultSettings, null, 2));
    console.log("\n🎉 Migration completed successfully!\n");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.log("\nPlease check your database connection and try again.\n");
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
