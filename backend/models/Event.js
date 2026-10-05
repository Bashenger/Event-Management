import mongoose from 'mongoose';

const agendaItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    topic: { type: String, required: true },
    speaker: { type: String, default: '' },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true,
      minlength: [5, 'Event name must be at least 5 characters'],
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    eventType: {
      type: String,
      required: [true, 'Please specify an event type'],
      enum: {
        values: ['Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Guest Lecture', 'Cultural'],
        message: '{VALUE} is not a supported event type',
      },
    },
    resourcePerson: {
      type: String,
      required: [true, 'Please provide the resource person / speaker name'],
      trim: true,
      minlength: [3, 'Resource person name must be at least 3 characters'],
    },
    speakerBio: {
      type: String,
      default: '',
    },
    eventDate: {
      type: Date,
      required: [true, 'Please specify the event date & time'],
    },
    endDate: {
      type: Date,
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue or online link'],
      trim: true,
      minlength: [3, 'Venue must be at least 3 characters'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please provide maximum participant capacity'],
      min: [5, 'Capacity must be at least 5 participants'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    eventDescription: {
      type: String,
      required: [true, 'Please provide a detailed event description'],
      minlength: [20, 'Event description must be at least 20 characters'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Completed'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    agenda: {
      type: [agendaItemSchema],
      default: [],
    },
    bannerImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating registered attendees count
eventSchema.virtual('registeredCount').get(function () {
  return (this.maxParticipants || 0) - (this.availableSeats || 0);
});

// Indexing for search performance
eventSchema.index({ eventName: 'text', resourcePerson: 'text', venue: 'text', eventDescription: 'text' });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
