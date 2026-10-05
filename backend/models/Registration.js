import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Attended'],
      default: 'Confirmed',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    qrCodeData: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: prevents multiple active/confirmed registrations for the same user on the same event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
registrationSchema.index({ userId: 1 });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
