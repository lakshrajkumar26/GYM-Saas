const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

/**
 * REGISTER MEMBER
 */
exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role: "MEMBER"
    }
  });

  // Create Member profile
  await prisma.member.create({
    data: {
      userId: user.id,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      phone,
      address
    }
  });

  res.status(201).json({
    message: "Member registered successfully"
  });
};

/**
 * LOGIN (ALL ROLES)
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { member: true }
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    userId: user.id,
    role: user.role
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      member: user.member
    }
  });
};
