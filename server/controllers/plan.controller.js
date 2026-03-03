const prisma = require("../config/prisma");

// CREATE PLAN
exports.createPlan = async (req, res) => {
  const { name, price, duration } = req.body;

  const plan = await prisma.membershipPlan.create({
    data: {
      name,
      price,
      duration
    }
  });

  res.status(201).json(plan);
};

// LIST PLANS
exports.getPlans = async (req, res) => {
  const plans = await prisma.membershipPlan.findMany({
    where: {
      isActive: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(plans);
};
