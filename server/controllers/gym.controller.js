const prisma = require("../config/prisma");

/**
 * GET GYM SETTINGS
 */
exports.getGymSettings = async (req, res) => {
  try {
    let settings = null;
    
    // Try to get settings from database
    try {
      settings = await prisma.gymSettings.findFirst();
    } catch (dbError) {
      console.log("GymSettings table not found, using fallback values");
    }
    
    // If no settings exist, try to create default ones
    if (!settings) {
      const defaultSettings = {
        name: process.env.GYM_NAME || "B Gym International",
        address: process.env.GYM_ADDRESS || "Your Gym Address Here",
        phone: process.env.GYM_PHONE || "+91-7903906436",
        email: process.env.GYM_EMAIL || "info@bgym.com",
        description: "Transform your body, transform your life"
      };
      
      try {
        settings = await prisma.gymSettings.create({
          data: defaultSettings
        });
      } catch (createError) {
        // If creation fails (table doesn't exist), return defaults
        return res.json(defaultSettings);
      }
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error fetching gym settings:", error);
    // Always return fallback values if anything fails
    res.json({
      name: process.env.GYM_NAME || "B Gym International",
      address: process.env.GYM_ADDRESS || "Your Gym Address Here",
      phone: process.env.GYM_PHONE || "+91-7903906436",
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
      twitter,
      admissionCharge,
      monthlyCharge,
      morningTiming,
      eveningTiming
    } = req.body;

    let settings = null;
    
    // Try to get existing settings
    try {
      settings = await prisma.gymSettings.findFirst();
    } catch (dbError) {
      return res.status(500).json({ 
        message: "GymSettings table not found. Please run database migrations first.",
        error: "Table does not exist"
      });
    }
    
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
    if (admissionCharge !== undefined) updateData.admissionCharge = parseInt(admissionCharge);
    if (monthlyCharge !== undefined) updateData.monthlyCharge = parseInt(monthlyCharge);
    if (morningTiming !== undefined) updateData.morningTiming = morningTiming;
    if (eveningTiming !== undefined) updateData.eveningTiming = eveningTiming;

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
          twitter,
          admissionCharge: admissionCharge ? parseInt(admissionCharge) : 600,
          monthlyCharge: monthlyCharge ? parseInt(monthlyCharge) : 800,
          morningTiming: morningTiming || "6:00 AM - 11:00 AM",
          eveningTiming: eveningTiming || "4:00 PM - 10:00 PM"
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
