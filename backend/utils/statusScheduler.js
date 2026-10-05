import Event from '../models/Event.js';

export const evaluateEventStatus = (event) => {
  const now = new Date();
  const eventDate = new Date(event.eventDate);

  // If event date is past, status should be Completed
  if (eventDate < now) {
    return 'Completed';
  }

  // If status was Registration Open but seats are 0, lock to Registration Closed
  if (event.status === 'Registration Open' && Number(event.availableSeats) <= 0) {
    return 'Registration Closed';
  }

  return event.status;
};

// Periodic background check or on-demand check for event status updates
export const syncCompletedEvents = async () => {
  try {
    const now = new Date();
    await Event.updateMany(
      {
        eventDate: { $lt: now },
        status: { $ne: 'Completed' },
      },
      {
        $set: { status: 'Completed' },
      }
    );
  } catch (error) {
    console.error('Error syncing completed events:', error.message);
  }
};
