const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  registerForEvent,
  cancelRegistration
} = require("../controllers/event.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Public route - upcoming events
router.get("/upcoming", getUpcomingEvents);

// Protected routes - require authentication
router.use(authMiddleware);

// Member routes - register/cancel
router.post("/register", registerForEvent);
router.post("/cancel", cancelRegistration);

// Admin routes - CRUD
router.post("/", allowRoles("ADMIN"), createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", allowRoles("ADMIN"), updateEvent);
router.delete("/:id", allowRoles("ADMIN"), deleteEvent);

module.exports = router;
