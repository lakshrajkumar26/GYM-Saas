const prisma = require("../config/prisma");

const normalizeDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// CREATE MEMBER
exports.createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      planId,
      height,
      weight,
      bodyFat
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already registered" 
      });
    }

    // Hash password
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get plan details if planId provided
    let expiryDate = new Date();
    if (planId) {
      const plan = await prisma.membershipPlan.findUnique({ 
        where: { id: planId } 
      });
      if (plan) {
        expiryDate.setDate(expiryDate.getDate() + plan.duration);
      } else {
        // Default 30 days if plan not found
        expiryDate.setDate(expiryDate.getDate() + 30);
      }
    } else {
      // Default 30 days if no plan
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    // Create user and member in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "MEMBER",
          isActive: true
        }
      });

      // Create member profile
      const member = await tx.member.create({
        data: {
          userId: user.id,
          planId: planId || null,
          startDate: new Date(),
          expiryDate,
          status: "ACTIVE",
          phone: phone || null,
          address: address || null,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null
        },
        include: {
          user: true,
          plan: true
        }
      });

      return member;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ 
      message: "Error creating member", 
      error: error.message 
    });
  }
};

// LIST MEMBERS (AUTO STATUS UPDATE)
exports.getMembers = async (req, res) => {
  const today = normalizeDate();

  // Auto-expire members
  await prisma.member.updateMany({
    where: {
      expiryDate: { lt: today },
      status: "ACTIVE"
    },
    data: { status: "EXPIRED" }
  });

  const members = await prisma.member.findMany({
    include: {
      plan: true,
      user: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(members);
};

// GET SINGLE MEMBER
exports.getMemberById = async (req, res) => {
  const member = await prisma.member.findUnique({
    where: { id: req.params.id },
    include: {
      plan: true,
      attendances: true,
      payments: true
    }
  });

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
};

// UPDATE MEMBER
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      planId,
      height,
      weight,
      bodyFat,
      status
    } = req.body;

    // Get existing member
    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: { user: true, plan: true }
    });

    if (!existingMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Calculate new expiry date if plan changed
    let updateData = {
      phone: phone || existingMember.phone,
      address: address || existingMember.address,
      height: height ? parseFloat(height) : existingMember.height,
      weight: weight ? parseFloat(weight) : existingMember.weight,
      bodyFat: bodyFat ? parseFloat(bodyFat) : existingMember.bodyFat,
    };

    // If status is provided, update it
    if (status) {
      updateData.status = status;
    }

    // If plan changed, update expiry date
    if (planId && planId !== existingMember.planId) {
      const newPlan = await prisma.membershipPlan.findUnique({ 
        where: { id: planId } 
      });
      
      if (newPlan) {
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + newPlan.duration);
        updateData.planId = planId;
        updateData.expiryDate = newExpiryDate;
        updateData.status = "ACTIVE"; // Reactivate when plan changes
      }
    }

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user info if provided
      if (name || email) {
        const userUpdateData = {};
        if (name) userUpdateData.name = name;
        if (email) {
          // Check if email is already taken by another user
          const emailExists = await tx.user.findFirst({
            where: { 
              email,
              id: { not: existingMember.userId }
            }
          });
          
          if (emailExists) {
            throw new Error("Email already in use");
          }
          userUpdateData.email = email;
        }
        
        await tx.user.update({
          where: { id: existingMember.userId },
          data: userUpdateData
        });
      }

      // Update member
      const member = await tx.member.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          plan: true
        }
      });

      return member;
    });

    res.json(result);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ 
      message: error.message || "Error updating member"
    });
  }
};

// DELETE MEMBER
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Get member to find userId
    const member = await prisma.member.findUnique({
      where: { id }
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Delete member and user in transaction
    await prisma.$transaction(async (tx) => {
      // Delete member first (due to foreign key)
      await tx.member.delete({
        where: { id }
      });

      // Delete user
      await tx.user.delete({
        where: { id: member.userId }
      });
    });

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ 
      message: "Error deleting member",
      error: error.message 
    });
  }
};

// TOGGLE MEMBER STATUS (ACTIVE/INACTIVE)
exports.toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current member
    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Toggle user isActive status
    const updatedUser = await prisma.user.update({
      where: { id: member.userId },
      data: {
        isActive: !member.user.isActive
      }
    });

    // Also update member status if user is being deactivated
    if (!updatedUser.isActive) {
      await prisma.member.update({
        where: { id },
        data: { status: "INACTIVE" }
      });
    }

    res.json({
      message: `Member ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: updatedUser.isActive
    });
  } catch (error) {
    console.error("Error toggling member status:", error);
    res.status(500).json({ 
      message: "Error toggling member status",
      error: error.message 
    });
  }
};
