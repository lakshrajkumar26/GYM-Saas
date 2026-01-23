const express = require("express");
const router = express.Router();

const {
  membershipExpiringSoon,
  membershipExpired
} = require("../controllers/notification.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("OWNER"));

router.get("/expiring-soon", membershipExpiringSoon);
router.get("/expired", membershipExpired);

module.exports = router;
