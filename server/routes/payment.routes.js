const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentsByMember,
  updatePaymentStatus,
  getMyPayments
} = require("../controllers/payment.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);

// Member can view their own payments
router.get("/my", getMyPayments);

// Admin routes
router.use(allowRoles("ADMIN"));
router.post("/", createPayment);
router.get("/", getPayments);
router.get("/member/:memberId", getPaymentsByMember);
router.put("/:id/status", updatePaymentStatus);

module.exports = router;
