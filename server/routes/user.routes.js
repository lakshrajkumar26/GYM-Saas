const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getProfile,
  updateProfile,
  uploadImage,
  uploadProfileImage,
  changePassword
} = require("../controllers/user.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Member routes - any authenticated user
router.use(authMiddleware);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/image", uploadProfileImage, uploadImage);
router.put("/change-password", changePassword);

// Admin routes
router.use(allowRoles("ADMIN"));
router.post("/", createUser);
router.get("/", getUsers);

module.exports = router;
