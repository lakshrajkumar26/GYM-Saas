const prisma = require("../config/prisma");

const normalizeDate = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.checkIn = async (req, res) => {
  const { memberId } = req.body;

  const today = normalizeDate();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        date: today,
        checkIn: new Date()
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Member already checked in today"
      });
    }
    throw error;
  }
};

exports.getMemberAttendance = async (req, res) => {
  const { memberId } = req.params;

  const records = await prisma.attendance.findMany({
    where: { memberId },
    orderBy: { date: "desc" }
  });

  res.json(records);
};
