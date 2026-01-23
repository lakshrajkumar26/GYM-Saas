const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans
} = require("../controllers/plan.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("OWNER"));

router.post("/", createPlan);
router.get("/", getPlans);

module.exports = router;
