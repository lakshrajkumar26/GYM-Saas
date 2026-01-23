const prisma = require("../config/prisma");

const normalizeDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// CREATE MEMBER
exports.createMember = async (req, res) => {
  const {
    userId,
    planId,
    startDate,
    expiryDate,
    height,
    weight,
    bodyFat
  } = req.body;

  const member = await prisma.member.create({
    data: {
      userId,
      planId,
      gymId: req.user.gymId,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      status: "ACTIVE",
      height,
      weight,
      bodyFat
    }
  });

  res.status(201).json(member);
};

// LIST MEMBERS (AUTO STATUS UPDATE)
exports.getMembers = async (req, res) => {
  const today = normalizeDate();

  // Auto-expire members
  await prisma.member.updateMany({
    where: {
      expiryDate: { lt: today },
      status: "ACTIVE"
    },
    data: { status: "EXPIRED" }
  });

  const members = await prisma.member.findMany({
    where: { gymId: req.user.gymId },
    include: {
      plan: true,
      user: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(members);
};

// GET SINGLE MEMBER
exports.getMemberById = async (req, res) => {
  const member = await prisma.member.findUnique({
    where: { id: req.params.id },
    include: {
      plan: true,
      attendances: true,
      payments: true
    }
  });

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
};

// UPDATE MEMBER
exports.updateMember = async (req, res) => {
  const member = await prisma.member.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.json(member);
};

// DELETE MEMBER
exports.deleteMember = async (req, res) => {
  await prisma.member.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Member deleted" });
};
