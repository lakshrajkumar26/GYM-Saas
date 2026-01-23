const express = require("express");
const router = express.Router();

const {
  getDashboardSummary,
  getAttendanceChart,
  getMemberGrowth,
  getRevenueChart
} = require("../controllers/dashboard.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Dashboard is OWNER-only
router.use(authMiddleware);
router.use(allowRoles("OWNER"));

router.get("/summary", getDashboardSummary);
router.get("/attendance", getAttendanceChart);
router.get("/members-growth", getMemberGrowth);
router.get("/revenue", getRevenueChart);

module.exports = router;
