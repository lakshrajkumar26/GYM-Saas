const prisma = require("../config/prisma");

const normalizeDate = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Admin check-in (for any member)
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
    res.status(500).json({ message: "Error checking in", error: error.message });
  }
};

// Member self check-in
exports.checkInSelf = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get member profile
    const member = await prisma.member.findUnique({
      where: { userId }
    });

    if (!member) {
      return res.status(404).json({ message: "Member profile not found" });
    }

    const today = normalizeDate();

    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        date: today,
        checkIn: new Date()
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "You have already checked in today"
      });
    }
    res.status(500).json({ message: "Error checking in", error: error.message });
  }
};

// Get member attendance (admin)
exports.getMemberAttendance = async (req, res) => {
  const { memberId } = req.params;

  const records = await prisma.attendance.findMany({
    where: { memberId },
    orderBy: { date: "desc" }
  });

  res.json(records);
};

// Get my attendance (member)
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Get member profile
    const member = await prisma.member.findUnique({
      where: { userId }
    });

    if (!member) {
      return res.status(404).json({ message: "Member profile not found" });
    }

    // Build where clause
    const where = { memberId: member.id };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" }
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};
