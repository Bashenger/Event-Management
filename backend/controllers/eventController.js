import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { evaluateEventStatus } from '../utils/statusScheduler.js';

// @desc    Get all events with search, filter, sort & pagination
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      eventType,
      status,
      availability,
      startDate,
      endDate,
      sortBy = 'eventDate:asc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Multi-field search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { eventName: searchRegex },
        { resourcePerson: searchRegex },
        { venue: searchRegex },
        { eventDescription: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Event Type filter (supports single or comma-separated list)
    if (eventType) {
      const types = eventType.split(',').map((t) => t.trim()).filter(Boolean);
      if (types.length > 0) {
        query.eventType = { $in: types };
      }
    }

    // Status filter (supports single or comma-separated list)
    if (status) {
      const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length > 0) {
        query.status = { $in: statuses };
      }
    }

    // Date range filter
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) {
        query.eventDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // End of the selected day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.eventDate.$lte = end;
      }
    }

    // Seat Availability Filter
    if (availability === 'available') {
      query.availableSeats = { $gt: 0 };
    } else if (availability === 'sold-out') {
      query.availableSeats = 0;
    }

    // Build Sorting
    let sortOptions = {};
    if (sortBy === 'eventDate:asc' || sortBy === 'soonest') {
      sortOptions = { eventDate: 1 };
    } else if (sortBy === 'eventDate:desc' || sortBy === 'latest') {
      sortOptions = { eventDate: -1 };
    } else if (sortBy === 'seats:desc' || sortBy === 'seats-high') {
      sortOptions = { availableSeats: -1 };
    } else if (sortBy === 'seats:asc' || sortBy === 'seats-low') {
      sortOptions = { availableSeats: 1 };
    } else if (sortBy === 'name:asc' || sortBy === 'name-asc') {
      sortOptions = { eventName: 1 };
    } else if (sortBy === 'name:desc' || sortBy === 'name-desc') {
      sortOptions = { eventName: -1 };
    } else {
      sortOptions = { eventDate: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name email department avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Dynamically evaluate statuses (e.g. check for past events or filled seats)
    const evaluatedEvents = events.map((event) => {
      const dynamicStatus = evaluateEventStatus(event);
      return {
        ...event,
        status: dynamicStatus,
        registeredCount: (event.maxParticipants || 0) - (event.availableSeats || 0),
      };
    });

    res.status(200).json({
      success: true,
      count: evaluatedEvents.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      data: evaluatedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      'name email department role avatar'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${req.params.id}' not found`,
      });
    }

    const dynamicStatus = evaluateEventStatus(event);
    const eventObj = event.toObject();
    eventObj.status = dynamicStatus;
    eventObj.registeredCount = (event.maxParticipants || 0) - (event.availableSeats || 0);

    res.status(200).json({
      success: true,
      data: eventObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Protected (Organizer, Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      eventName,
      eventType,
      resourcePerson,
      speakerBio,
      eventDate,
      endDate,
      venue,
      maxParticipants,
      eventDescription,
      status = 'Registration Open',
      tags = [],
      agenda = [],
      bannerImage,
    } = req.body;

    const max = Number(maxParticipants);

    const event = await Event.create({
      eventName: eventName.trim(),
      eventType,
      resourcePerson: resourcePerson.trim(),
      speakerBio: speakerBio ? speakerBio.trim() : '',
      eventDate: new Date(eventDate),
      endDate: endDate ? new Date(endDate) : undefined,
      venue: venue.trim(),
      maxParticipants: max,
      availableSeats: max,
      eventDescription: eventDescription.trim(),
      status,
      createdBy: req.user._id,
      tags: Array.isArray(tags) ? tags : [],
      agenda: Array.isArray(agenda) ? agenda : [],
      bannerImage: bannerImage || '',
    });

    const populatedEvent = await Event.findById(event._id).populate(
      'createdBy',
      'name email department avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Protected (Organizer, Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${req.params.id}' not found`,
      });
    }

    const {
      eventName,
      eventType,
      resourcePerson,
      speakerBio,
      eventDate,
      endDate,
      venue,
      maxParticipants,
      eventDescription,
      status,
      tags,
      agenda,
      bannerImage,
    } = req.body;

    if (eventName) event.eventName = eventName.trim();
    if (eventType) event.eventType = eventType;
    if (resourcePerson) event.resourcePerson = resourcePerson.trim();
    if (speakerBio !== undefined) event.speakerBio = speakerBio;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (endDate !== undefined) event.endDate = endDate ? new Date(endDate) : undefined;
    if (venue) event.venue = venue.trim();
    if (eventDescription) event.eventDescription = eventDescription.trim();
    if (status) event.status = status;
    if (tags !== undefined) event.tags = tags;
    if (agenda !== undefined) event.agenda = agenda;
    if (bannerImage !== undefined) event.bannerImage = bannerImage;

    // Handle capacity adjustments safely
    if (maxParticipants !== undefined) {
      const newMax = Number(maxParticipants);
      const registeredCount = event.maxParticipants - event.availableSeats;
      if (newMax < registeredCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease max capacity to ${newMax} because ${registeredCount} students are already registered.`,
        });
      }
      event.maxParticipants = newMax;
      event.availableSeats = newMax - registeredCount;
    }

    await event.save();

    const updatedEvent = await Event.findById(event._id).populate(
      'createdBy',
      'name email department avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transition event status (FSM)
// @route   PATCH /api/events/:id/status
// @access  Protected (Organizer, Admin)
export const updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedTransitions = [
      'Draft',
      'Published',
      'Registration Open',
      'Registration Closed',
      'Completed',
    ];

    if (!status || !allowedTransitions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values are: ${allowedTransitions.join(', ')}`,
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status updated to '${status}' successfully`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event & cascade registrations
// @route   DELETE /api/events/:id
// @access  Protected (Organizer, Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${req.params.id}' not found`,
      });
    }

    // Cascade delete associated registrations
    await Registration.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
