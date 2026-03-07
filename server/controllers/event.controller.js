const prisma = require("../config/prisma");

/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      date,
      time,
      duration,
      location,
      maxParticipants,
      instructor
    } = req.body;

    if (!title || !type || !date || !time) {
      return res.status(400).json({ 
        message: "Title, type, date, and time are required" 
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        time,
        duration: duration ? parseInt(duration) : null,
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        instructor,
        isActive: true
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      message: "Error creating event", 
      error: error.message 
    });
  }
};

/**
 * GET ALL EVENTS
 */
exports.getEvents = async (req, res) => {
  try {
    const { upcoming, past } = req.query;
    const now = new Date();

    let whereClause = {};

    if (upcoming === 'true') {
      whereClause.date = { gte: now };
    } else if (past === 'true') {
      whereClause.date = { lt: now };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            member: {
              include: {
                user: true
              }
            }
          }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ 
      message: "Error fetching events", 
      error: error.message 
    });
  }
};

/**
 * GET SINGLE EVENT
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            member: {
              include: {
                user: true
              }
            }
          }
        },
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ 
      message: "Error fetching event", 
      error: error.message 
    });
  }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      date,
      time,
      duration,
      location,
      maxParticipants,
      instructor,
      isActive
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null;
    if (location !== undefined) updateData.location = location;
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants ? parseInt(maxParticipants) : null;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (isActive !== undefined) updateData.isActive = isActive;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ 
      message: "Error updating event", 
      error: error.message 
    });
  }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id }
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ 
      message: "Error deleting event", 
      error: error.message 
    });
  }
};

/**
 * GET UPCOMING EVENTS (for dashboard)
 */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        date: { gte: now },
        isActive: true
      },
      include: {
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { date: 'asc' },
      take: limit
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ 
      message: "Error fetching upcoming events", 
      error: error.message 
    });
  }
};

/**
 * REGISTER MEMBER FOR EVENT
 */
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    if (!eventId || !memberId) {
      return res.status(400).json({ 
        message: "Event ID and Member ID are required" 
      });
    }

    // Check if event exists and has space
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.maxParticipants && event._count.participants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if already registered
    const existing = await prisma.eventParticipant.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Register
    const participant = await prisma.eventParticipant.create({
      data: {
        eventId,
        memberId,
        status: "REGISTERED"
      },
      include: {
        event: true,
        member: {
          include: {
            user: true
          }
        }
      }
    });

    res.status(201).json(participant);
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ 
      message: "Error registering for event", 
      error: error.message 
    });
  }
};

/**
 * CANCEL EVENT REGISTRATION
 */
exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    await prisma.eventParticipant.delete({
      where: {
        eventId_memberId: {
          eventId,
          memberId
        }
      }
    });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ 
      message: "Error cancelling registration", 
      error: error.message 
    });
  }
};
