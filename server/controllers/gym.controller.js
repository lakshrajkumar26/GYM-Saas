const prisma = require("../config/prisma");

/**
 * GET GYM SETTINGS (ADMIN ONLY)
 */
exports.getGymSettings = async (req, res) => {
  // Return basic gym info - can be stored in env or config
  res.json({
    name: process.env.GYM_NAME || "My Gym",
    address: process.env.GYM_ADDRESS || "",
    phone: process.env.GYM_PHONE || "",
    email: process.env.GYM_EMAIL || ""
  });
};
