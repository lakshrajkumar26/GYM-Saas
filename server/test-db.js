require("dotenv").config();
const prisma = require("./config/prisma");

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
