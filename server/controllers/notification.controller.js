const prisma = require("../config/prisma");

/**
 * MEMBERSHIP EXPIRING SOON (NEXT X DAYS)
 */
exports.membershipExpiringSoon = async (req, res) => {
  const gymId = req.user.gymId;
  const days = Number(req.query.days) || 3;

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const members = await prisma.member.findMany({
    where: {
      gymId,
      expiryDate: {
        gte: today,
        lte: futureDate
      },
      status: "ACTIVE"
    },
    include: {
      user: true
    }
  });

  const notifications = members.map(m => ({
    userId: m.userId,
    name: m.user.name,
    message: `Your membership expires on ${m.expiryDate.toDateString()}`
  }));

  res.json({
    count: notifications.length,
    notifications
  });
};

/**
 * MEMBERSHIP EXPIRED
 */
exports.membershipExpired = async (req, res) => {
  const gymId = req.user.gymId;

  const members = await prisma.member.findMany({
    where: {
      gymId,
      status: "EXPIRED"
    },
    include: {
      user: true
    }
  });

  const notifications = members.map(m => ({
    userId: m.userId,
    name: m.user.name,
    message: "Your membership has expired. Please renew."
  }));

  res.json({
    count: notifications.length,
    notifications
  });
};
