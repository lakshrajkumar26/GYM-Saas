const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers
} = require("../controllers/user.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("OWNER"));

router.post("/", createUser);
router.get("/", getUsers);

module.exports = router;
