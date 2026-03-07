const prisma = require("../config/prisma");

/**
 * GET GYM SETTINGS
 */
exports.getGymSettings = async (req, res) => {
  try {
    // Try to get settings from database
    let settings = await prisma.gymSettings.findFirst();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.gymSettings.create({
        data: {
          name: process.env.GYM_NAME || "B Gym International",
          address: process.env.GYM_ADDRESS || "Your Gym Address Here",
          phone: process.env.GYM_PHONE || "+91-1234567890",
          email: process.env.GYM_EMAIL || "info@bgym.com",
          description: "Transform your body, transform your life"
        }
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error fetching gym settings:", error);
    // Fallback to env variables if database fails
    res.json({
      name: process.env.GYM_NAME || "B Gym International",
      address: process.env.GYM_ADDRESS || "Your Gym Address Here",
      phone: process.env.GYM_PHONE || "+91-1234567890",
      email: process.env.GYM_EMAIL || "info@bgym.com",
      description: "Transform your body, transform your life"
    });
  }
};

/**
 * UPDATE GYM SETTINGS (ADMIN ONLY)
 */
exports.updateGymSettings = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      description,
      logo,
      website,
      facebook,
      instagram,
      twitter
    } = req.body;

    // Get existing settings or create new
    let settings = await prisma.gymSettings.findFirst();
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (website !== undefined) updateData.website = website;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (twitter !== undefined) updateData.twitter = twitter;

    if (settings) {
      // Update existing
      settings = await prisma.gymSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      // Create new
      settings = await prisma.gymSettings.create({
        data: {
          name: name || "B Gym International",
          address,
          phone,
          email,
          description,
          logo,
          website,
          facebook,
          instagram,
          twitter
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error updating gym settings:", error);
    res.status(500).json({ 
      message: "Error updating gym settings", 
      error: error.message 
    });
  }
};
