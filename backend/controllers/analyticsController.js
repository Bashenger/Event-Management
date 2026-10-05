import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get dashboard metrics & aggregation stats
// @route   GET /api/analytics/dashboard
// @access  Protected (Organizer, Admin)
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'Confirmed' });

    // Aggregate capacity and registered counts
    const capacityAggregation = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$maxParticipants' },
          totalAvailableSeats: { $sum: '$availableSeats' },
        },
      },
    ]);

    const totalCapacity = capacityAggregation[0]?.totalCapacity || 0;
    const totalAvailableSeats = capacityAggregation[0]?.totalAvailableSeats || 0;
    const totalRegisteredAttendees = totalCapacity - totalAvailableSeats;
    const overallFillRate =
      totalCapacity > 0
        ? Number(((totalRegisteredAttendees / totalCapacity) * 100).toFixed(1))
        : 0;

    // Breakdown by Event Type
    const typeBreakdown = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$maxParticipants' },
          totalAvailableSeats: { $sum: '$availableSeats' },
        },
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          totalCapacity: 1,
          registered: { $subtract: ['$totalCapacity', '$totalAvailableSeats'] },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Breakdown by Event Status
    const statusBreakdown = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Top 5 Most Popular Events
    const topEvents = await Event.aggregate([
      {
        $project: {
          eventName: 1,
          eventType: 1,
          maxParticipants: 1,
          availableSeats: 1,
          registered: { $subtract: ['$maxParticipants', '$availableSeats'] },
          fillRate: {
            $cond: [
              { $eq: ['$maxParticipants', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$maxParticipants', '$availableSeats'] },
                      '$maxParticipants',
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { fillRate: -1, registered: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalEvents,
          totalRegistrations,
          totalCapacity,
          totalRegisteredAttendees,
          totalAvailableSeats,
          overallFillRate,
        },
        typeBreakdown,
        statusBreakdown,
        topEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};
