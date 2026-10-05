import React, { useRef } from 'react';
import {
  X,
  QrCode,
  Calendar,
  MapPin,
  User,
  Clock,
  Printer,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const TicketModal = ({ isOpen, registration, onClose }) => {
  const ticketRef = useRef(null);

  if (!isOpen || !registration) return null;

  const event = registration.eventSnapshot || registration.eventId || {};
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-6 sm:p-8 shadow-2xl space-y-6 animate-slide-down relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:text-sunset-mutedDark dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Close ticket modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-sunset-coral/15 text-sunset-crimson dark:text-sunset-coral border border-rose-200 dark:border-sunset-coral/30 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Campus Access Pass
          </div>
          <h2 className="font-display text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
            CAMPUS ENTRY PASS
          </h2>
          <p className="text-xs text-stone-500 dark:text-sunset-mutedDark">Present this QR code or Ticket ID at the venue check-in desk</p>
        </div>

        {/* Digital Ticket Card */}
        <div
          ref={ticketRef}
          className="bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.4)] border-2 border-black/80 ticket-cutout-left ticket-cutout-right relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-black/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                {event.eventType || 'WORKSHOP'}
              </span>
              <span className="font-mono text-xs font-black uppercase tracking-widest">
                CAMPUSPHERE // ACCESS PASS
              </span>
            </div>
            <span className="font-mono text-xs font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded">
              {registration.ticketId || 'TKT-VIP'}
            </span>
          </div>

          {/* Ticket Title & Speaker */}
          <div className="space-y-1">
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight">
              {event.eventName || 'Campus Event'}
            </h3>
            <p className="text-xs font-black text-black/80 uppercase">
              Mentor: {event.resourcePerson || 'Faculty Lead'}
            </p>
          </div>

          {/* Ticket Body Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-bold border-t-2 border-dashed border-black/40 pt-3">
            <div>
              <span className="text-[10px] uppercase text-black/70 font-mono font-bold block">Date</span>
              <span className="font-mono font-black">{formattedDate}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-black/70 font-mono font-bold block">Time</span>
              <span className="font-mono font-black">{formattedTime}</span>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] uppercase text-black/70 font-mono font-bold block">Venue Location</span>
              <span className="font-black">{event.venue || 'Campus Hall'}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-black/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-black/70 font-mono font-bold block">Attendee</span>
                <span className="font-black">{registration.userName || 'Student Attendee'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-black/70 font-mono font-bold block">Status</span>
                <span className="text-xs font-black uppercase text-black bg-black/10 px-2 py-0.5 rounded">
                  ENROLLED
                </span>
              </div>
            </div>
          </div>

          {/* QR Code & Barcode */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-black/40">
            <div>
              <span className="text-[9px] font-mono font-black uppercase tracking-wider block">
                ENTRY PASS TOKEN
              </span>
              <span className="font-mono text-sm font-black tracking-widest">
                {registration.ticketId || 'TKT-2026'}
              </span>
            </div>

            <div className="p-2 bg-black rounded-xl">
              <QrCode className="w-12 h-12 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print / Save Campus Pass
          </button>
        </div>
      </div>
    </div>
  );
};
