const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/password");

// CREATE USER (MEMBER / STAFF)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["MEMBER", "TRAINER", "STAFF"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role,
      gymId: req.user.gymId
    }
  });

  res.status(201).json(user);
};

// LIST USERS
exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { gymId: req.user.gymId },
    orderBy: { createdAt: "desc" }
  });

  res.json(users);
};
