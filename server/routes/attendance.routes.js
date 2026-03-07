const express = require("express");
const router = express.Router();

const {
  checkIn,
  getMemberAttendance,
  getMyAttendance,
  checkInSelf
} = require("../controllers/attendance.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Member routes - any authenticated user
router.use(authMiddleware);
router.get("/my", getMyAttendance);
router.post("/checkin", checkInSelf);

// Admin routes
router.use(allowRoles("ADMIN"));
router.post("/check-in", checkIn);
router.get("/member/:memberId", getMemberAttendance);

module.exports = router;
