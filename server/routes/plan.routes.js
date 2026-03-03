const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
} = require("../controllers/plan.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Public route - no auth needed
router.get("/", getPlans);

// Protected routes - require ADMIN role
router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

router.post("/", createPlan);
router.get("/:id", getPlanById);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

module.exports = router;
