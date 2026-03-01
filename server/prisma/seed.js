const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password helper
  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  // 1. Create Super Admin
  console.log("Creating Super Admin...");
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@platform.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@platform.com",
      password: await hashPassword("admin123"),
      role: "SUPER_ADMIN",
      gymId: null,
    },
  });
  console.log("✅ Super Admin created");

  // 2. Create Gym 1 - Iron Gym
  console.log("Creating Iron Gym...");
  const gym1 = await prisma.gym.upsert({
    where: { slug: "iron-gym" },
    update: {},
    create: {
      name: "Iron Gym",
      slug: "iron-gym",
      address: "123 Fitness Street, Mumbai",
      phone: "+91 98765 43210",
      email: "contact@irongym.com",
      isActive: true,
    },
  });

  // 3. Create Gym 2 - Fit Zone
  console.log("Creating Fit Zone...");
  const gym2 = await prisma.gym.upsert({
    where: { slug: "fit-zone" },
    update: {},
    create: {
      name: "Fit Zone",
      slug: "fit-zone",
      address: "456 Health Avenue, Delhi",
      phone: "+91 98765 43211",
      email: "contact@fitzone.com",
      isActive: true,
    },
  });
  console.log("✅ Gyms created");

  // 4. Create Owner for Iron Gym
  console.log("Creating Gym Owners...");
  const owner1 = await prisma.user.upsert({
    where: { email: "owner@irongym.com" },
    update: {},
    create: {
      name: "Rajesh Kumar",
      email: "owner@irongym.com",
      password: await hashPassword("owner123"),
      role: "OWNER",
      gymId: gym1.id,
    },
  });

  // 5. Create Owner for Fit Zone
  const owner2 = await prisma.user.upsert({
    where: { email: "owner@fitzone.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "owner@fitzone.com",
      password: await hashPassword("owner123"),
      role: "OWNER",
      gymId: gym2.id,
    },
  });
  console.log("✅ Owners created");

  // 6. Create Trainers for Iron Gym
  console.log("Creating Trainers...");
  const trainer1 = await prisma.user.upsert({
    where: { email: "trainer1@irongym.com" },
    update: {},
    create: {
      name: "Vikram Singh",
      email: "trainer1@irongym.com",
      password: await hashPassword("trainer123"),
      role: "TRAINER",
      gymId: gym1.id,
    },
  });

  const trainer2 = await prisma.user.upsert({
    where: { email: "trainer2@irongym.com" },
    update: {},
    create: {
      name: "Anjali Patel",
      email: "trainer2@irongym.com",
      password: await hashPassword("trainer123"),
      role: "TRAINER",
      gymId: gym1.id,
    },
  });

  // 7. Create Trainer for Fit Zone
  const trainer3 = await prisma.user.upsert({
    where: { email: "trainer@fitzone.com" },
    update: {},
    create: {
      name: "Amit Verma",
      email: "trainer@fitzone.com",
      password: await hashPassword("trainer123"),
      role: "TRAINER",
      gymId: gym2.id,
    },
  });
  console.log("✅ Trainers created");

  // 8. Create Staff for Iron Gym
  console.log("Creating Staff...");
  const staff1 = await prisma.user.upsert({
    where: { email: "staff@irongym.com" },
    update: {},
    create: {
      name: "Neha Gupta",
      email: "staff@irongym.com",
      password: await hashPassword("staff123"),
      role: "STAFF",
      gymId: gym1.id,
    },
  });

  // 9. Create Staff for Fit Zone
  const staff2 = await prisma.user.upsert({
    where: { email: "staff@fitzone.com" },
    update: {},
    create: {
      name: "Rahul Mehta",
      email: "staff@fitzone.com",
      password: await hashPassword("staff123"),
      role: "STAFF",
      gymId: gym2.id,
    },
  });
  console.log("✅ Staff created");

  // 10. Create Membership Plans for Iron Gym
  console.log("Creating Membership Plans...");
  const plan1 = await prisma.membershipPlan.create({
    data: {
      name: "Monthly",
      price: 2000,
      duration: 30,
      gymId: gym1.id,
      isActive: true,
    },
  });

  const plan2 = await prisma.membershipPlan.create({
    data: {
      name: "Quarterly",
      price: 5500,
      duration: 90,
      gymId: gym1.id,
      isActive: true,
    },
  });

  const plan3 = await prisma.membershipPlan.create({
    data: {
      name: "Yearly",
      price: 18000,
      duration: 365,
      gymId: gym1.id,
      isActive: true,
    },
  });

  // 11. Create Plans for Fit Zone
  const plan4 = await prisma.membershipPlan.create({
    data: {
      name: "Monthly",
      price: 2500,
      duration: 30,
      gymId: gym2.id,
      isActive: true,
    },
  });

  const plan5 = await prisma.membershipPlan.create({
    data: {
      name: "Quarterly",
      price: 6500,
      duration: 90,
      gymId: gym2.id,
      isActive: true,
    },
  });
  console.log("✅ Membership Plans created");

  // 12. Create Members for Iron Gym
  console.log("Creating Members...");
  const member1User = await prisma.user.create({
    data: {
      name: "Arjun Reddy",
      email: "arjun@example.com",
      password: await hashPassword("member123"),
      role: "MEMBER",
      gymId: gym1.id,
    },
  });

  const member1 = await prisma.member.create({
    data: {
      userId: member1User.id,
      gymId: gym1.id,
      planId: plan1.id,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      height: 175,
      weight: 75,
      bodyFat: 18,
    },
  });

  const member2User = await prisma.user.create({
    data: {
      name: "Sneha Iyer",
      email: "sneha@example.com",
      password: await hashPassword("member123"),
      role: "MEMBER",
      gymId: gym1.id,
    },
  });

  const member2 = await prisma.member.create({
    data: {
      userId: member2User.id,
      gymId: gym1.id,
      planId: plan2.id,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      height: 165,
      weight: 60,
      bodyFat: 22,
    },
  });

  const member3User = await prisma.user.create({
    data: {
      name: "Karan Malhotra",
      email: "karan@example.com",
      password: await hashPassword("member123"),
      role: "MEMBER",
      gymId: gym1.id,
    },
  });

  const member3 = await prisma.member.create({
    data: {
      userId: member3User.id,
      gymId: gym1.id,
      planId: plan3.id,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      height: 180,
      weight: 85,
      bodyFat: 20,
    },
  });

  // 13. Create Members for Fit Zone
  const member4User = await prisma.user.create({
    data: {
      name: "Pooja Desai",
      email: "pooja@example.com",
      password: await hashPassword("member123"),
      role: "MEMBER",
      gymId: gym2.id,
    },
  });

  const member4 = await prisma.member.create({
    data: {
      userId: member4User.id,
      gymId: gym2.id,
      planId: plan4.id,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      height: 160,
      weight: 55,
      bodyFat: 24,
    },
  });

  const member5User = await prisma.user.create({
    data: {
      name: "Rohit Kapoor",
      email: "rohit@example.com",
      password: await hashPassword("member123"),
      role: "MEMBER",
      gymId: gym2.id,
    },
  });

  const member5 = await prisma.member.create({
    data: {
      userId: member5User.id,
      gymId: gym2.id,
      planId: plan5.id,
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      height: 178,
      weight: 80,
      bodyFat: 19,
    },
  });
  console.log("✅ Members created");

  // 14. Create Attendance Records
  console.log("Creating Attendance Records...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.attendance.createMany({
    data: [
      {
        gymId: gym1.id,
        memberId: member1.id,
        date: today,
        checkIn: new Date(today.getTime() + 8 * 60 * 60 * 1000),
      },
      {
        gymId: gym1.id,
        memberId: member2.id,
        date: today,
        checkIn: new Date(today.getTime() + 9 * 60 * 60 * 1000),
      },
      {
        gymId: gym1.id,
        memberId: member3.id,
        date: today,
        checkIn: new Date(today.getTime() + 7 * 60 * 60 * 1000),
      },
      {
        gymId: gym2.id,
        memberId: member4.id,
        date: today,
        checkIn: new Date(today.getTime() + 10 * 60 * 60 * 1000),
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Attendance records created");

  // 15. Create Payment Records
  console.log("Creating Payment Records...");
  await prisma.payment.createMany({
    data: [
      {
        gymId: gym1.id,
        memberId: member1.id,
        amount: 2000,
        mode: "UPI",
        status: "PAID",
        reference: "UPI123456",
      },
      {
        gymId: gym1.id,
        memberId: member2.id,
        amount: 5500,
        mode: "CARD",
        status: "PAID",
        reference: "CARD789012",
      },
      {
        gymId: gym1.id,
        memberId: member3.id,
        amount: 18000,
        mode: "CASH",
        status: "PAID",
      },
      {
        gymId: gym2.id,
        memberId: member4.id,
        amount: 2500,
        mode: "UPI",
        status: "PAID",
        reference: "UPI654321",
      },
      {
        gymId: gym2.id,
        memberId: member5.id,
        amount: 6500,
        mode: "ONLINE",
        status: "PAID",
        reference: "RAZORPAY123",
      },
    ],
  });
  console.log("✅ Payment records created");

  // 16. Create Subscriptions for Gyms
  console.log("Creating Gym Subscriptions...");
  await prisma.subscription.upsert({
    where: { gymId: gym1.id },
    update: {},
    create: {
      gymId: gym1.id,
      plan: "PRO",
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.subscription.upsert({
    where: { gymId: gym2.id },
    update: {},
    create: {
      gymId: gym2.id,
      plan: "STARTER",
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });
  console.log("✅ Gym subscriptions created");

  console.log("\n🎉 Seed completed successfully!\n");
  console.log("📋 Test Accounts Created:\n");
  console.log("SUPER ADMIN:");
  console.log("  Email: admin@platform.com");
  console.log("  Password: admin123\n");
  console.log("OWNERS:");
  console.log("  Iron Gym - owner@irongym.com / owner123");
  console.log("  Fit Zone - owner@fitzone.com / owner123\n");
  console.log("TRAINERS:");
  console.log("  Iron Gym - trainer1@irongym.com / trainer123");
  console.log("  Iron Gym - trainer2@irongym.com / trainer123");
  console.log("  Fit Zone - trainer@fitzone.com / trainer123\n");
  console.log("STAFF:");
  console.log("  Iron Gym - staff@irongym.com / staff123");
  console.log("  Fit Zone - staff@fitzone.com / staff123\n");
  console.log("MEMBERS:");
  console.log("  Iron Gym - arjun@example.com / member123");
  console.log("  Iron Gym - sneha@example.com / member123");
  console.log("  Iron Gym - karan@example.com / member123");
  console.log("  Fit Zone - pooja@example.com / member123");
  console.log("  Fit Zone - rohit@example.com / member123\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
