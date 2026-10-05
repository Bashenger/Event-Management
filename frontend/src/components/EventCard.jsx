import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowUpRight,
  Edit3,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SeatIndicator } from './SeatIndicator';
import { CountdownTimer } from './CountdownTimer';
import { ConfirmationModal } from './ConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import confetti from 'canvas-confetti';

export const EventCard = ({ event }) => {
  const { isStudent, isElevated } = useAuth();
  const { deleteEvent, registerForEvent, isUserRegistered, evaluateStatus } = useEvents();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const dynamicStatus = evaluateStatus ? evaluateStatus(event) : event.status;
  const isRegistered = isUserRegistered(event._id);
  const isSoldOut = event.availableSeats <= 0;
  const isCompleted = dynamicStatus === 'Completed';
  const isRegistrationOpen = dynamicStatus === 'Registration Open' && !isSoldOut && !isCompleted;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  const formattedTime = event.eventDate
    ? new Date(event.eventDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteEvent(event._id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
  };

  const handleQuickRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsRegistering(true);
      await registerForEvent(event._id);
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.75 },
        colors: ['#E11D48', '#F59E0B', '#FF4D6D', '#FF9E00'],
      });
    } catch (error) {
      // Handled in context
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <div className="group rounded-3xl bg-white dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark hover:border-sunset-crimson/50 dark:hover:border-sunset-coral/50 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sunset-crimson/10 dark:hover:shadow-sunset-coral/10 relative shadow-sm">
        {/* Card Banner Image */}
        <div className="relative h-52 w-full overflow-hidden bg-stone-100 dark:bg-dark-850">
          <img
            src={
              event.bannerImage ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
            }
            alt={event.eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/95 dark:bg-sunset-obsidian/95 text-sunset-crimson dark:text-sunset-coral border border-sunset-crimson/30 dark:border-sunset-coral/30 shadow-md backdrop-blur-md">
              {event.eventType}
            </span>

            {isRegistered ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ENROLLED
              </span>
            ) : (
              <StatusBadge status={dynamicStatus} size="sm" />
            )}
          </div>

          {/* Countdown Preview */}
          <div className="absolute bottom-3 left-3.5 right-3.5">
            <CountdownTimer targetDate={event.eventDate} endDate={event.endDate} compact />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Title */}
            <Link to={`/events/${event._id}`}>
              <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white group-hover:text-sunset-crimson dark:group-hover:text-sunset-coral transition-colors line-clamp-2 leading-snug">
                {event.eventName}
              </h3>
            </Link>

            {/* Keynote Speaker / Faculty Lead */}
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-sunset-mutedDark">
              <User className="w-3.5 h-3.5 text-sunset-crimson dark:text-sunset-coral shrink-0" />
              <span className="truncate font-semibold text-stone-900 dark:text-slate-200">
                Mentor: {event.resourcePerson}
              </span>
            </div>

            {/* Meta (Date, Time, Venue) */}
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 dark:text-sunset-mutedDark pt-1 font-medium">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>

              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{formattedTime}</span>
              </div>

              <div className="col-span-2 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-sunset-tangerine dark:text-sunset-goldenTangerine shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Tags preview */}
            {Array.isArray(event.tags) && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {event.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-sunset-mutedDark border border-stone-200 dark:border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Seat Capacity Tracker */}
          <div className="pt-2 border-t border-stone-200 dark:border-sunset-borderDark">
            <SeatIndicator
              availableSeats={event.availableSeats}
              maxParticipants={event.maxParticipants}
            />
          </div>

          {/* Action Buttons: VIEW SESSIONS ↗ & ENROLL NOW */}
          <div className="pt-3 border-t border-stone-200 dark:border-sunset-borderDark flex items-center gap-2">
            {/* Primary Action: VIEW SESSIONS ↗ */}
            <Link
              to={`/events/${event._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-stone-100 hover:bg-stone-200 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark text-stone-900 dark:text-white border border-stone-200 dark:border-sunset-borderDark transition-all"
            >
              <span>VIEW SESSIONS</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Secondary Action: ENROLL NOW */}
            {isStudent && (
              <button
                type="button"
                onClick={handleQuickRegister}
                disabled={!isRegistrationOpen || isRegistered || isRegistering}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                  isRegistered
                    ? 'bg-sunset-crimson/15 text-sunset-crimson dark:bg-sunset-coral/20 dark:text-sunset-coral border border-sunset-crimson/30 dark:border-sunset-coral/40 cursor-default'
                    : isRegistrationOpen
                    ? 'bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral active:scale-95'
                    : 'bg-stone-200 text-stone-400 dark:bg-sunset-obsidian dark:text-slate-600 border border-transparent cursor-not-allowed'
                }`}
              >
                {isRegistering ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isRegistered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ENROLLED
                  </>
                ) : isSoldOut ? (
                  'MAX CAPACITY'
                ) : isCompleted ? (
                  'CONCLUDED'
                ) : (
                  <>
                    <span>ENROLL NOW</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}

            {/* Organizer Controls */}
            {isElevated && (
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/edit-event/${event._id}`}
                  className="p-2.5 rounded-xl text-stone-900 dark:text-white bg-stone-100 hover:bg-stone-200 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark border border-stone-200 dark:border-sunset-borderDark transition-colors"
                  title="Edit Event"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sunset-crimson dark:text-sunset-coral" />
                </Link>

                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/30 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.eventName}"? This will permanently remove the event and cancel all attendee registrations.`}
        confirmText="Delete Event"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};
