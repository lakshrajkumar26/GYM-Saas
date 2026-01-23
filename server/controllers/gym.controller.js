const prisma = require("../config/prisma");

/**
 * GET MY GYM (OWNER / STAFF / TRAINER)
 */
exports.getMyGym = async (req, res) => {
  const gym = await prisma.gym.findUnique({
    where: { id: req.user.gymId },
    include: {
      subscription: true
    }
  });

  if (!gym) {
    return res.status(404).json({ message: "Gym not found" });
  }

  res.json(gym);
};

/**
 * UPDATE GYM PROFILE (OWNER ONLY)
 */
exports.updateGym = async (req, res) => {
  const { name, logo, address, phone, email } = req.body;

  const gym = await prisma.gym.update({
    where: { id: req.user.gymId },
    data: {
      name,
      logo,
      address,
      phone,
      email
    }
  });

  res.json(gym);
};
