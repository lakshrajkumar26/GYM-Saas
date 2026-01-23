const express = require("express");
const router = express.Router();


router.use("/auth", require("./routes/auth.routes"));
router.use("/plans", require("./routes/plan.routes"));
router.use("/users", require("./routes/user.routes"));
router.use("/gym", require("./routes/gym.routes"));
router.use("/members", require("./routes/member.routes"));
router.use("/attendance", require("./routes/attendance.routes"));

router.use("/notifications", require("./routes/notification.routes"));

router.use("/dashboard", require("./routes/dashboard.routes"));

router.use("/payments", require("./routes/payment.routes"));

module.exports = router;
