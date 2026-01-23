const prisma = require("../config/prisma");

/**
 * CREATE PAYMENT
 * (Cash / UPI / Manual Online)
 */
exports.createPayment = async (req, res) => {
  const { memberId, amount, mode, status, reference } = req.body;

  if (!memberId || !amount || !mode) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const payment = await prisma.payment.create({
    data: {
      memberId,
      gymId: req.user.gymId,
      amount,
      mode,              // CASH | UPI | CARD | ONLINE
      status: status || "PAID",
      reference
    }
  });

  res.status(201).json(payment);
};

/**
 * LIST PAYMENTS (ALL)
 */
exports.getPayments = async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: {
      gymId: req.user.gymId
    },
    include: {
      member: {
        include: {
          user: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(payments);
};

/**
 * PAYMENTS BY MEMBER
 */
exports.getPaymentsByMember = async (req, res) => {
  const { memberId } = req.params;

  const payments = await prisma.payment.findMany({
    where: {
      gymId: req.user.gymId,
      memberId
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(payments);
};

/**
 * UPDATE PAYMENT STATUS
 * (For ONLINE confirmation later)
 */
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  const payment = await prisma.payment.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json(payment);
};
