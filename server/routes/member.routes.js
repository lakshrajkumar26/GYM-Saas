const express = require("express");
const router = express.Router();

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  toggleMemberStatus
} = require("../controllers/member.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

router.post("/", createMember);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.patch("/:id/toggle-status", toggleMemberStatus);
router.delete("/:id", deleteMember);

module.exports = router;
