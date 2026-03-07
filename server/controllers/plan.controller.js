const prisma = require("../config/prisma");

// CREATE PLAN
exports.createPlan = async (req, res) => {
  try {
    const { name, price, discountPrice, duration, planType, features } = req.body;

    const data = {
      name,
      price: parseInt(price),
      duration: parseInt(duration),
      planType: planType || 'GYM',
      isActive: true
    };

    // Add discountPrice only if provided
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== '') {
      data.discountPrice = parseInt(discountPrice);
    }

    // Add features if provided
    if (features) {
      data.features = features;
    }

    const plan = await prisma.membershipPlan.create({
      data,
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: "Failed to create plan", error: error.message });
  }
};

// LIST PLANS
exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: "Failed to fetch plans", error: error.message });
  }
};

// GET PLAN BY ID
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: "Failed to fetch plan", error: error.message });
  }
};

// UPDATE PLAN
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, discountPrice, duration, planType, features, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseInt(price);
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (planType !== undefined) updateData.planType = planType;
    if (features !== undefined) updateData.features = features;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle discountPrice - allow null to remove discount
    if (discountPrice !== undefined) {
      if (discountPrice === null || discountPrice === '') {
        updateData.discountPrice = null;
      } else {
        updateData.discountPrice = parseInt(discountPrice);
      }
    }

    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(500).json({ message: "Failed to update plan", error: error.message });
  }
};

// DELETE PLAN
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if plan has members
    const plan = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan._count.members > 0) {
      // Soft delete - just mark as inactive
      await prisma.membershipPlan.update({
        where: { id },
        data: { isActive: false }
      });
      return res.json({ message: "Plan deactivated successfully (has active members)" });
    }

    // Hard delete if no members
    await prisma.membershipPlan.delete({
      where: { id }
    });

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error('Delete plan error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(500).json({ message: "Failed to delete plan", error: error.message });
  }
};

