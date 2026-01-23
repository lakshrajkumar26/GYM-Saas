const express = require("express");
const router = express.Router();

const {
  getMyGym,
  updateGym
} = require("../controllers/gym.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// All gym routes require login
router.use(authMiddleware);

/**
 * GET gym details
 * OWNER, TRAINER, STAFF
 */
router.get(
  "/me",
  allowRoles("OWNER", "TRAINER", "STAFF"),
  getMyGym
);

/**
 * UPDATE gym details
 * OWNER only
 */
router.put(
  "/me",
  allowRoles("OWNER"),
  updateGym
);

module.exports = router;
