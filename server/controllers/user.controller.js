const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/password");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    console.log('[MULTER] Upload directory:', uploadDir);
    if (!fs.existsSync(uploadDir)) {
      console.log('[MULTER] Creating upload directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = "profile-" + uniqueSuffix + path.extname(file.originalname);
    console.log('[MULTER] Generated filename:', filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('[MULTER] File filter - mimetype:', file.mimetype);
    console.log('[MULTER] File filter - originalname:', file.originalname);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('[MULTER] File accepted');
      return cb(null, true);
    } else {
      console.log('[MULTER] File rejected - invalid type');
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
  },
}).single("profileImage");

// Middleware export for routes with error handling
exports.uploadProfileImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('[MULTER] Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size should be less than 5MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.error('[MULTER] Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    console.log('[MULTER] Upload middleware completed successfully');
    next();
  });
};

// CREATE USER (MEMBER / STAFF)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["MEMBER", "TRAINER", "STAFF"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role
    }
  });

  res.status(201).json(user);
};

// LIST USERS
exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.json(users);
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        member: {
          include: {
            plan: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, height, weight, bodyFat } = req.body;

    // Update user basic info
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // If user is a member, update member info
    const member = await prisma.member.findUnique({
      where: { userId }
    });

    if (member) {
      const memberUpdateData = {};
      if (phone !== undefined) memberUpdateData.phone = phone;
      if (address !== undefined) memberUpdateData.address = address;
      if (height !== undefined) memberUpdateData.height = height ? parseFloat(height) : null;
      if (weight !== undefined) memberUpdateData.weight = weight ? parseFloat(weight) : null;
      if (bodyFat !== undefined) memberUpdateData.bodyFat = bodyFat ? parseFloat(bodyFat) : null;

      await prisma.member.update({
        where: { userId },
        data: memberUpdateData
      });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// UPLOAD PROFILE IMAGE
exports.uploadImage = async (req, res) => {
  try {
    console.log('[UPLOAD] Upload request received');
    console.log('[UPLOAD] User ID:', req.user?.id);
    console.log('[UPLOAD] File:', req.file);

    const userId = req.user.id;

    if (!req.file) {
      console.log('[UPLOAD] No file in request');
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log('[UPLOAD] File uploaded:', req.file.filename);

    // Get old profile image to delete
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImage: true }
    });

    console.log('[UPLOAD] Current profile image:', user?.profileImage);

    // Delete old image if exists
    if (user?.profileImage) {
      const oldImagePath = path.join(__dirname, "..", user.profileImage);
      console.log('[UPLOAD] Attempting to delete old image:', oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('[UPLOAD] Old image deleted');
      }
    }

    // Save new image path
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    console.log('[UPLOAD] New image URL:', imageUrl);
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageUrl }
    });

    console.log('[UPLOAD] Database updated successfully');

    res.json({
      message: "Profile image uploaded successfully",
      profileImage: imageUrl
    });
  } catch (error) {
    console.error('[UPLOAD] Error:', error);
    console.error('[UPLOAD] Error stack:', error.stack);
    res.status(500).json({ 
      message: "Error uploading image", 
      error: error.message,
      details: error.toString()
    });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Verify current password
    const bcrypt = require("bcrypt");
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};
