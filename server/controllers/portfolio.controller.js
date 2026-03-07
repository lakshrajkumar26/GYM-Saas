const prisma = require("../config/prisma");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/portfolio");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: fileFilter,
});

/**
 * CREATE PORTFOLIO ITEM
 */
exports.createPortfolio = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      type,
      section,
      isPublished,
      order
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ 
        message: "Title and type are required" 
      });
    }

    const mediaUrl = req.files?.media ? `/uploads/portfolio/${req.files.media[0].filename}` : null;
    const thumbnailUrl = req.files?.thumbnail ? `/uploads/portfolio/${req.files.thumbnail[0].filename}` : null;

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        content,
        type,
        section,
        mediaUrl,
        thumbnailUrl,
        isPublished: isPublished === 'true' || isPublished === true,
        order: order ? parseInt(order) : 0
      }
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({ 
      message: "Error creating portfolio", 
      error: error.message 
    });
  }
};

/**
 * GET ALL PORTFOLIO ITEMS
 */
exports.getPortfolios = async (req, res) => {
  try {
    const { type, section, published } = req.query;

    const whereClause = {};
    if (type) whereClause.type = type;
    if (section) whereClause.section = section;
    if (published === 'true') whereClause.isPublished = true;

    const portfolios = await prisma.portfolio.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    res.status(500).json({ 
      message: "Error fetching portfolios", 
      error: error.message 
    });
  }
};

/**
 * GET SINGLE PORTFOLIO ITEM
 */
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ 
      message: "Error fetching portfolio", 
      error: error.message 
    });
  }
};

/**
 * UPDATE PORTFOLIO ITEM
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      type,
      section,
      isPublished,
      order
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (type) updateData.type = type;
    if (section !== undefined) updateData.section = section;
    if (isPublished !== undefined) updateData.isPublished = isPublished === 'true' || isPublished === true;
    if (order !== undefined) updateData.order = parseInt(order);

    // Handle file uploads
    if (req.files?.media) {
      updateData.mediaUrl = `/uploads/portfolio/${req.files.media[0].filename}`;
    }
    if (req.files?.thumbnail) {
      updateData.thumbnailUrl = `/uploads/portfolio/${req.files.thumbnail[0].filename}`;
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData
    });

    res.json(portfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ 
      message: "Error updating portfolio", 
      error: error.message 
    });
  }
};

/**
 * DELETE PORTFOLIO ITEM
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    // Get portfolio to delete associated files
    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (portfolio) {
      // Delete files if they exist
      if (portfolio.mediaUrl) {
        const mediaPath = path.join(__dirname, "..", portfolio.mediaUrl);
        if (fs.existsSync(mediaPath)) {
          fs.unlinkSync(mediaPath);
        }
      }
      if (portfolio.thumbnailUrl) {
        const thumbnailPath = path.join(__dirname, "..", portfolio.thumbnailUrl);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    }

    await prisma.portfolio.delete({
      where: { id }
    });

    res.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({ 
      message: "Error deleting portfolio", 
      error: error.message 
    });
  }
};

/**
 * GET PUBLISHED PORTFOLIO ITEMS (for public page)
 */
exports.getPublishedPortfolios = async (req, res) => {
  try {
    const { type, section } = req.query;

    const whereClause = { isPublished: true };
    if (type) whereClause.type = type;
    if (section) whereClause.section = section;

    const portfolios = await prisma.portfolio.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(portfolios);
  } catch (error) {
    console.error("Error fetching published portfolios:", error);
    res.status(500).json({ 
      message: "Error fetching published portfolios", 
      error: error.message 
    });
  }
};

// Export multer upload middleware
exports.uploadMiddleware = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);
