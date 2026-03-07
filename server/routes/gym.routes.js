const express = require("express");
const router = express.Router();

const {
  getGymSettings,
  updateGymSettings
} = require("../controllers/gym.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Public route - get gym settings
router.get("/settings", getGymSettings);

// Protected routes
router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

// Admin only - update gym settings
router.put("/settings", updateGymSettings);

module.exports = router;
