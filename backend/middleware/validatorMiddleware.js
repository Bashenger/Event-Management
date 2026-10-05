export const validateRegister = (req, res, next) => {
  const { name, email, password, department } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (!department || department.trim().length < 2) {
    errors.push('Department is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on user registration',
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on login',
      errors,
    });
  }

  next();
};

export const validateEvent = (req, res, next) => {
  const {
    eventName,
    eventType,
    resourcePerson,
    eventDate,
    venue,
    maxParticipants,
    eventDescription,
  } = req.body;

  const errors = [];

  if (!eventName || eventName.trim().length < 5 || eventName.trim().length > 100) {
    errors.push('Event name is required and must be between 5 and 100 characters');
  }

  const allowedTypes = ['Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Guest Lecture', 'Cultural'];
  if (!eventType || !allowedTypes.includes(eventType)) {
    errors.push(`Event type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (!resourcePerson || resourcePerson.trim().length < 3) {
    errors.push('Resource person / speaker name must be at least 3 characters');
  }

  if (!eventDate) {
    errors.push('Event date is required');
  } else {
    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Event date must be a valid date');
    }
  }

  if (!venue || venue.trim().length < 3) {
    errors.push('Venue must be at least 3 characters');
  }

  if (maxParticipants === undefined || isNaN(maxParticipants) || Number(maxParticipants) < 5) {
    errors.push('Maximum participants must be a number greater than or equal to 5');
  }

  if (!eventDescription || eventDescription.trim().length < 20) {
    errors.push('Event description must be at least 20 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on event creation/update',
      errors,
    });
  }

  next();
};
