const express = require("express");
const router = express.Router();

const {
  registerOwner,
  login
} = require("../controllers/auth.controller");

router.post("/register-owner", registerOwner);
router.post("/login", login);

module.exports = router;
