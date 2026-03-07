const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublishedPortfolios,
  uploadMiddleware
} = require("../controllers/portfolio.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Public routes
router.get("/published", getPublishedPortfolios);

// Protected routes - require authentication
router.use(authMiddleware);

// Admin routes - CRUD
router.post("/", allowRoles("ADMIN"), uploadMiddleware, createPortfolio);
router.get("/", getPortfolios);
router.get("/:id", getPortfolioById);
router.put("/:id", allowRoles("ADMIN"), uploadMiddleware, updatePortfolio);
router.delete("/:id", allowRoles("ADMIN"), deletePortfolio);

module.exports = router;
