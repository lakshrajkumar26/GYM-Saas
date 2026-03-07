const express = require("express");
const router = express.Router();

const {
  getDashboardSummary,
  getAttendanceChart,
  getMemberGrowth,
  getRevenueChart,
  getMemberDashboard
} = require("../controllers/dashboard.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Member dashboard (any authenticated user)
router.get("/member", authMiddleware, getMemberDashboard);

// Admin dashboard
router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

router.get("/summary", getDashboardSummary);
router.get("/attendance", getAttendanceChart);
router.get("/members-growth", getMemberGrowth);
router.get("/revenue", getRevenueChart);

module.exports = router;
