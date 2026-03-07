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
 * ADMIN only
 */
router.get(
  "/me",
  allowRoles("ADMIN"),
  getMyGym
);

/**
 * UPDATE gym details
 * ADMIN only
 */
router.put(
  "/me",
  allowRoles("ADMIN"),
  updateGym
);

module.exports = router;
