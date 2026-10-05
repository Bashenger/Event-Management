import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateEvent } from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (Organizer, Admin)
router.post(
  '/',
  protect,
  authorizeRoles('organizer', 'admin'),
  validateEvent,
  createEvent
);

router.put(
  '/:id',
  protect,
  authorizeRoles('organizer', 'admin'),
  validateEvent,
  updateEvent
);

router.patch(
  '/:id/status',
  protect,
  authorizeRoles('organizer', 'admin'),
  updateEventStatus
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('organizer', 'admin'),
  deleteEvent
);

export default router;
