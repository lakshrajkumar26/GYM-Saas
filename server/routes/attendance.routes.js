const express = require("express");
const router = express.Router();

const {
  checkIn,
  getMemberAttendance
} = require("../controllers/attendance.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("OWNER", "TRAINER", "STAFF"));

router.post("/check-in", checkIn);
router.get("/member/:memberId", getMemberAttendance);

module.exports = router;
