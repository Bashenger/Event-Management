import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  CalendarPlus,
  Ticket,
  ArrowUpRight,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { TicketModal } from './TicketModal';
import { ConfirmationModal } from './ConfirmationModal';
import { useEvents } from '../context/EventContext';

export const RegistrationCard = ({ registration }) => {
  const { cancelRegistration } = useEvents();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const event = registration.eventSnapshot || registration.eventId || {};

  const formattedEventDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  const formattedEventTime = event.eventDate
    ? new Date(event.eventDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const registeredAtFormatted = registration.registeredAt
    ? new Date(registration.registeredAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const isPast = event.eventDate ? new Date(event.eventDate) < new Date() : false;

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    await cancelRegistration(registration._id);
    setIsCancelling(false);
    setCancelModalOpen(false);
  };

  const handleAddToCalendar = () => {
    if (!event.eventDate) return;
    const startTime = new Date(event.eventDate).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(new Date(event.eventDate).getTime() + 3 * 3600000)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.eventName || 'Campus Event'
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      event.eventDescription || ''
    )}&location=${encodeURIComponent(event.venue || '')}`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-sunset-crimson/50 dark:hover:border-sunset-coral/50 transition-all duration-300 shadow-sm">
        {/* Left Side: Ticket Metadata & Event Details */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black flex items-center justify-center shrink-0 shadow-sm font-bold">
            <Ticket className="w-6 h-6" />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-stone-100 dark:bg-white/10 text-sunset-charcoal dark:text-slate-300 border border-sunset-borderLight dark:border-white/10">
                {event.eventType || 'EVENT'}
              </span>
              <span className="font-mono text-xs font-black text-sunset-crimson dark:text-sunset-coral">
                {registration.ticketId}
              </span>
              <StatusBadge status={isPast ? 'Completed' : registration.status} size="sm" />
            </div>

            <Link to={`/events/${event._id}`}>
              <h3 className="font-display text-base sm:text-lg font-bold text-sunset-charcoal dark:text-white hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors truncate">
                {event.eventName || 'Campus Workshop Event'}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sunset-mutedLight dark:text-sunset-mutedDark font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedEventDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formattedEventTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
                {event.venue || 'Campus Hall'}
              </span>
            </div>

            <p className="text-[11px] text-sunset-mutedLight dark:text-sunset-mutedDark">
              Booked on <span className="text-sunset-charcoal dark:text-slate-300 font-medium">{registeredAtFormatted}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-sunset-borderLight dark:border-sunset-borderDark shrink-0">
          <button
            type="button"
            onClick={handleAddToCalendar}
            title="Add to Google Calendar"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark text-sunset-charcoal dark:text-white border border-sunset-borderLight dark:border-sunset-borderDark transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setTicketModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Pass</span>
          </button>

          {!isPast && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket QR Modal */}
      <TicketModal
        isOpen={ticketModalOpen}
        registration={registration}
        onClose={() => setTicketModalOpen(false)}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${event.eventName}"? Your seat will be freed for other students.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelModalOpen(false)}
      />
    </>
  );
};
