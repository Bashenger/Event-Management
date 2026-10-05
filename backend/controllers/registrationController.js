import crypto from 'crypto';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { evaluateEventStatus } from '../utils/statusScheduler.js';

// @desc    Register logged in student for an event
// @route   POST /api/registrations/:eventId
// @access  Protected (Student, Admin)
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // 1. Fetch Event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // 2. Evaluate Dynamic Status
    const evaluatedStatus = evaluateEventStatus(event);
    if (evaluatedStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This event has already concluded and is no longer accepting registrations.',
      });
    }

    if (evaluatedStatus !== 'Registration Open') {
      return res.status(400).json({
        success: false,
        message: `Registration is not open for this event (Current status: ${evaluatedStatus}).`,
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event is completely booked! No seats available.',
      });
    }

    // 3. Prevent duplicate active registration
    const existingRegistration = await Registration.findOne({
      eventId: event._id,
      userId,
      status: 'Confirmed',
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
        ticketId: existingRegistration.ticketId,
      });
    }

    // 4. Generate unique Ticket ID
    const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
    const ticketId = `TKT-${randomSuffix}`;

    // 5. Create Registration
    const registration = await Registration.create({
      eventId: event._id,
      userId,
      ticketId,
      status: 'Confirmed',
      registeredAt: new Date(),
      qrCodeData: JSON.stringify({
        ticketId,
        eventId: event._id,
        eventName: event.eventName,
        userName: req.user.name,
        userEmail: req.user.email,
        timestamp: new Date().toISOString(),
      }),
    });

    // 6. Atomically decrement available seats
    event.availableSeats = Math.max(0, event.availableSeats - 1);
    if (event.availableSeats === 0) {
      event.status = 'Registration Closed';
    }
    await event.save();

    // Populate event data for rich response
    const populatedRegistration = await Registration.findById(registration._id).populate(
      'eventId',
      'eventName eventType resourcePerson eventDate venue availableSeats maxParticipants bannerImage'
    );

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully!',
      data: populatedRegistration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations for current logged-in user
// @route   GET /api/registrations/my
// @access  Protected (Student, Admin)
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      userId: req.user._id,
      status: { $ne: 'Cancelled' },
    })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id/cancel
// @access  Protected (Student, Admin)
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    // Ensure only the owner or an admin can cancel
    if (
      registration.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration',
      });
    }

    if (registration.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been cancelled',
      });
    }

    // Mark as cancelled
    registration.status = 'Cancelled';
    await registration.save();

    // Increment available seat back
    const event = await Event.findById(registration.eventId);
    if (event) {
      event.availableSeats = Math.min(event.maxParticipants, event.availableSeats + 1);
      // If status was Registration Closed and event is in the future, reopen
      if (event.status === 'Registration Closed' && new Date(event.eventDate) > new Date()) {
        event.status = 'Registration Open';
      }
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully and seat restored',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendee roster for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Protected (Organizer, Admin)
export const getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const attendees = await Registration.find({
      eventId,
      status: 'Confirmed',
    })
      .populate('userId', 'name email department studentId avatar')
      .sort({ registeredAt: 1 });

    res.status(200).json({
      success: true,
      count: attendees.length,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};
