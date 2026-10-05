import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student & Admin Registration Actions
router.post('/:eventId', protect, authorizeRoles('student', 'admin'), registerForEvent);
router.get('/my', protect, authorizeRoles('student', 'admin'), getMyRegistrations);
router.delete('/:id/cancel', protect, authorizeRoles('student', 'admin'), cancelRegistration);

// Organizer & Admin Roster Export
router.get('/event/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventAttendees);

export default router;
