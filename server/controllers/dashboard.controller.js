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
  try {
    const today = startOfToday();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalMembers,
      activeMembers,
      expiredMembers,
      todayAttendance,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      prisma.member.count(),

      prisma.member.count({
        where: { status: "ACTIVE" }
      }),

      prisma.member.count({
        where: { status: "EXPIRED" }
      }),

      prisma.attendance.count({
        where: {
          date: today
        }
      }),

      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true }
      }),

      prisma.payment.aggregate({
        where: {
          status: "PAID",
          createdAt: {
            gte: startOfMonth
          }
        },
        _sum: { amount: true }
      })
    ]);

    res.json({
      totalMembers,
      activeMembers,
      expiredMembers,
      todayCheckIns: todayAttendance,
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      memberGrowth: '+0%', // TODO: Calculate actual growth
      activeGrowth: '+0%', // TODO: Calculate actual growth
      revenueGrowth: '+0%', // TODO: Calculate actual growth
      checkInChange: '0%' // TODO: Calculate actual change
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard summary", error: error.message });
  }
};

// =====================
// ATTENDANCE CHART (LAST N DAYS)
// =====================
exports.getAttendanceChart = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    fromDate.setHours(0, 0, 0, 0);

    const data = await prisma.attendance.groupBy({
      by: ["date"],
      where: {
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance chart", error: error.message });
  }
};

// =====================
// MEMBER GROWTH (MONTHLY)
// =====================
exports.getMemberGrowth = async (req, res) => {
  try {
    const data = await prisma.member.groupBy({
      by: ["createdAt"],
      _count: { id: true }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member growth", error: error.message });
  }
};

// =====================
// REVENUE CHART (MONTHLY)
// =====================
exports.getRevenueChart = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue chart", error: error.message });
  }
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

// =====================
// RECENT ACTIVITIES (ADMIN)
// =====================
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent members
    const recentMembers = await prisma.member.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        member: {
          include: { user: true }
        }
      }
    });

    // Get recent check-ins (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recentCheckIns = await prisma.attendance.findMany({
      where: {
        date: { gte: today }
      },
      take: 3,
      orderBy: { checkIn: 'desc' },
      include: {
        member: {
          include: { user: true }
        }
      }
    });

    // Get expiring memberships (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const expiringMembers = await prisma.member.findMany({
      where: {
        expiryDate: {
          gte: new Date(),
          lte: nextWeek
        },
        status: 'ACTIVE'
      },
      take: 2,
      orderBy: { expiryDate: 'asc' },
      include: { user: true }
    });

    // Combine and format activities
    const activities = [];

    // Add member activities
    recentMembers.forEach(member => {
      activities.push({
        id: `member-${member.id}`,
        type: 'member_joined',
        message: `${member.user.name} joined the gym`,
        time: formatTimeAgo(member.createdAt),
        timestamp: member.createdAt
      });
    });

    // Add payment activities
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment_received',
        message: `Payment of ₹${payment.amount} received from ${payment.member.user.name}`,
        time: formatTimeAgo(payment.createdAt),
        timestamp: payment.createdAt
      });
    });

    // Add check-in activities
    recentCheckIns.forEach(attendance => {
      activities.push({
        id: `checkin-${attendance.id}`,
        type: 'check_in',
        message: `${attendance.member.user.name} checked in`,
        time: formatTimeAgo(attendance.checkIn),
        timestamp: attendance.checkIn
      });
    });

    // Add expiring membership alerts
    expiringMembers.forEach(member => {
      const daysLeft = Math.ceil(
        (new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      activities.push({
        id: `expiring-${member.id}`,
        type: 'plan_expired',
        message: `${member.user.name}'s membership expires in ${daysLeft} days`,
        time: `${daysLeft} days left`,
        timestamp: member.expiryDate
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(activities.slice(0, limit));
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ message: "Error fetching recent activities", error: error.message });
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return new Date(date).toLocaleDateString();
}

// =====================
// MEMBER RECENT ACTIVITIES
// =====================
exports.getMemberActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get member profile
    const member = await prisma.member.findUnique({
      where: { userId }
    });

    if (!member) {
      return res.status(404).json({ message: "Member profile not found" });
    }

    const activities = [];

    // Get recent check-ins
    const recentCheckIns = await prisma.attendance.findMany({
      where: { memberId: member.id },
      take: 5,
      orderBy: { checkIn: 'desc' }
    });

    recentCheckIns.forEach(attendance => {
      activities.push({
        id: `checkin-${attendance.id}`,
        type: 'check_in',
        message: 'Checked in to gym',
        time: formatTimeAgo(attendance.checkIn),
        timestamp: attendance.checkIn
      });
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { memberId: member.id },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment_received',
        message: `Payment of ₹${payment.amount} processed`,
        time: formatTimeAgo(payment.createdAt),
        timestamp: payment.createdAt
      });
    });

    // Check if membership is expiring soon
    const daysUntilExpiry = Math.ceil(
      (new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      activities.push({
        id: `expiring-${member.id}`,
        type: 'plan_expired',
        message: `Your membership expires in ${daysUntilExpiry} days`,
        time: `${daysUntilExpiry} days left`,
        timestamp: member.expiryDate
      });
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(activities.slice(0, limit));
  } catch (error) {
    console.error("Error fetching member activities:", error);
    res.status(500).json({ message: "Error fetching member activities", error: error.message });
  }
};
