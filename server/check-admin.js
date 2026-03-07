const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log("🔍 Checking Admin User...\n");

    const admin = await prisma.user.findUnique({
      where: { email: "admin@gym.com" },
    });

    if (!admin) {
      console.log("❌ Admin user not found!");
      console.log("Run: node create-admin.js\n");
      return;
    }

    console.log("✅ Admin user found!\n");
    console.log("📋 User Details:");
    console.log(`ID: ${admin.id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Active: ${admin.isActive}\n`);

    if (admin.role !== "ADMIN") {
      console.log("⚠️ WARNING: User role is not ADMIN!");
      console.log("Updating role to ADMIN...\n");
      
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: "ADMIN" }
      });
      
      console.log("✅ Role updated to ADMIN\n");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
