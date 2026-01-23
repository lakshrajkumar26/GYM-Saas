const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentsByMember,
  updatePaymentStatus
} = require("../controllers/payment.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("OWNER", "STAFF"));

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/member/:memberId", getPaymentsByMember);
router.put("/:id/status", updatePaymentStatus);

module.exports = router;
