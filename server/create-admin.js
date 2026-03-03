const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("🔐 Creating Admin User...\n");

    const email = "admin@gym.com";
    const password = "admin123";
    const name = "Admin User";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists!");
      console.log(`Email: ${email}`);
      console.log("Password: admin123\n");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📋 Login Credentials:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}\n`);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
