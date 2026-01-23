const prisma = require("../config/prisma");

// Helper: get start of today
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// =====================
// KPI SUMMARY
// =====================
exports.getDashboardSummary = async (req, res) => {
  const gymId = req.user.gymId;
  const today = startOfToday();

  const [
    totalMembers,
    activeMembers,
    expiredMembers,
    todayAttendance,
    totalRevenue,
    monthlyRevenue
  ] = await Promise.all([
    prisma.member.count({ where: { gymId } }),

    prisma.member.count({
      where: { gymId, status: "ACTIVE" }
    }),

    prisma.member.count({
      where: { gymId, status: "EXPIRED" }
    }),

    prisma.attendance.count({
      where: {
        gymId,
        date: today
      }
    }),

    prisma.payment.aggregate({
      where: { gymId, status: "PAID" },
      _sum: { amount: true }
    }),

    prisma.payment.aggregate({
      where: {
        gymId,
        status: "PAID",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
  ]);

  res.json({
    members: {
      total: totalMembers,
      active: activeMembers,
      expired: expiredMembers
    },
    attendance: {
      today: todayAttendance
    },
    revenue: {
      total: totalRevenue._sum.amount || 0,
      thisMonth: monthlyRevenue._sum.amount || 0
    }
  });
};

// =====================
// ATTENDANCE CHART (LAST N DAYS)
// =====================
exports.getAttendanceChart = async (req, res) => {
  const gymId = req.user.gymId;
  const days = Number(req.query.days) || 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  fromDate.setHours(0, 0, 0, 0);

  const data = await prisma.attendance.groupBy({
    by: ["date"],
    where: {
      gymId,
      date: { gte: fromDate }
    },
    _count: { id: true },
    orderBy: { date: "asc" }
  });

  res.json(
    data.map(d => ({
      date: d.date,
      count: d._count.id
    }))
  );
};

// =====================
// MEMBER GROWTH (MONTHLY)
// =====================
exports.getMemberGrowth = async (req, res) => {
  const gymId = req.user.gymId;

  const data = await prisma.member.groupBy({
    by: ["createdAt"],
    where: { gymId },
    _count: { id: true }
  });

  res.json(data);
};

// =====================
// REVENUE CHART (MONTHLY)
// =====================
exports.getRevenueChart = async (req, res) => {
  const gymId = req.user.gymId;

  const payments = await prisma.payment.findMany({
    where: {
      gymId,
      status: "PAID"
    },
    select: {
      amount: true,
      createdAt: true
    }
  });

  // Group by YYYY-MM
  const revenueMap = {};

  payments.forEach(p => {
    const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth() + 1}`;
    revenueMap[key] = (revenueMap[key] || 0) + p.amount;
  });

  res.json(revenueMap);
};
