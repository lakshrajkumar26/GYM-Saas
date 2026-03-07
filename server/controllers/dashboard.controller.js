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

// =====================
// MEMBER DASHBOARD STATS
// =====================
exports.getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get member profile
    const member = await prisma.member.findUnique({
      where: { userId },
      include: {
        plan: true,
        user: true
      }
    });

    if (!member) {
      return res.status(404).json({ message: "Member profile not found" });
    }

    // Calculate days active (from start date to now)
    const daysActive = Math.floor(
      (new Date().getTime() - new Date(member.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get attendance count (total check-ins)
    const totalAttendance = await prisma.attendance.count({
      where: { memberId: member.id }
    });

    // Get this month's attendance
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyAttendance = await prisma.attendance.count({
      where: {
        memberId: member.id,
        date: { gte: startOfMonth }
      }
    });

    // Calculate current streak
    const recentAttendance = await prisma.attendance.findMany({
      where: { memberId: member.id },
      orderBy: { date: 'desc' },
      take: 30
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentAttendance.length; i++) {
      const checkDate = new Date(recentAttendance[i].date);
      checkDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (checkDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate days until expiry
    const daysUntilExpiry = Math.ceil(
      (new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    res.json({
      daysActive,
      totalAttendance,
      monthlyAttendance,
      currentStreak,
      plan: {
        name: member.plan?.name || 'No Plan',
        expiryDate: member.expiryDate,
        daysUntilExpiry,
        status: member.status
      },
      member: {
        name: member.user.name,
        email: member.user.email,
        phone: member.phone,
        startDate: member.startDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching member dashboard", error: error.message });
  }
};
