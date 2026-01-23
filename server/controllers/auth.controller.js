const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

/**
 * REGISTER GYM OWNER (ONE TIME)
 */
exports.registerOwner = async (req, res) => {
  const { gymName, slug, name, email, password } = req.body;

  // Check if owner already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create Gym
  const gym = await prisma.gym.create({
    data: {
      name: gymName,
      slug
    }
  });

  // Create Owner User
  const owner = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role: "OWNER",
      gymId: gym.id
    }
  });

  res.status(201).json({
    message: "Owner registered successfully"
  });
};

/**
 * LOGIN (ALL ROLES)
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { gym: true }
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
    role: user.role,
    gymId: user.gymId
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      gymId: user.gymId,
      gymName: user.gym.name
    }
  });
};
