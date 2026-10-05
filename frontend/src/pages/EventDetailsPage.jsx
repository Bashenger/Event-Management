import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ArrowLeft,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  ListPlus,
  ArrowUpRight,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { StatusBadge } from '../components/StatusBadge';
import { SeatIndicator } from '../components/SeatIndicator';
import { CountdownTimer } from '../components/CountdownTimer';
import { EventCard } from '../components/EventCard';
import { ConfirmationModal } from '../components/ConfirmationModal';
import confetti from 'canvas-confetti';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, events, registerForEvent, isUserRegistered, deleteEvent, updateEventStatus, evaluateStatus } = useEvents();
  const { isStudent, isElevated } = useAuth();
  const { success } = useToast();

  const [event, setEvent] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusSelect, setStatusSelect] = useState('');

  useEffect(() => {
    const found = getEvent(id);
    if (found) {
      setEvent(found);
      setStatusSelect(found.status);
    }
  }, [id, getEvent, events]);

  const recommendations = useRecommendations(event, events, 3);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in text-center">
        <h2 className="font-display text-2xl font-black text-stone-900 dark:text-white uppercase">Event Session Not Found</h2>
        <p className="text-sm text-stone-600 dark:text-sunset-mutedDark">The session you are looking for does not exist or has been archived.</p>
        <Link
          to="/events"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Campus Directory</span>
        </Link>
      </div>
    );
  }

  const dynamicStatus = evaluateStatus ? evaluateStatus(event) : event.status;
  const isRegistered = isUserRegistered(event._id);
  const isSoldOut = event.availableSeats <= 0;
  const isCompleted = dynamicStatus === 'Completed';
  const isRegistrationOpen = dynamicStatus === 'Registration Open' && !isSoldOut && !isCompleted;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
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

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      await registerForEvent(event._id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E11D48', '#F59E0B', '#FF4D6D', '#FF9E00'],
      });
    } catch (err) {
      // Handled in context
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteEvent(event._id);
    setIsDeleting(false);
    navigate('/events');
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusSelect(newStatus);
    await updateEventStatus(event._id, newStatus);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.eventName,
        text: `Check out ${event.eventName} on CampuSphere!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Session URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-sunset-mutedDark hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Directory</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-xs font-black uppercase tracking-wider text-stone-800 dark:text-white transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Session</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark shadow-lg">
        <div className="h-64 sm:h-96 w-full relative bg-stone-900">
          <img
            src={
              event.bannerImage ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
            }
            alt={event.eventName}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Banner Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between flex-wrap gap-2">
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-md">
              {event.eventType}
            </span>

            <div className="flex items-center gap-2">
              <StatusBadge status={dynamicStatus} size="lg" />
            </div>
          </div>

          {/* Banner Bottom Details */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase leading-tight">
              {event.eventName}
            </h1>
            <p className="text-sm text-white/90 font-bold uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
              Lead Faculty / Mentor: <span className="text-sunset-coral dark:text-sunset-goldenTangerine font-black">{event.resourcePerson}</span>
            </p>
          </div>
        </div>

        {/* Live Countdown Ribbon */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-sunset-obsidian border-t border-stone-200 dark:border-sunset-borderDark flex flex-col sm:flex-row items-center justify-between gap-4">
          <CountdownTimer targetDate={event.eventDate} endDate={event.endDate} />

          {/* FSM Status Switcher (for Organizer / Admin) */}
          {isElevated && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-stone-500 dark:text-sunset-mutedDark">Workflow:</span>
              <select
                value={statusSelect}
                onChange={handleStatusChange}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-xs font-black uppercase tracking-wider text-sunset-crimson dark:text-sunset-coral focus:outline-none focus:ring-2 focus:ring-sunset-crimson"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Registration Open">Admissions Open</option>
                <option value="Registration Closed">Max Capacity Reached</option>
                <option value="Completed">Concluded</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark space-y-4 shadow-sm">
            <h2 className="font-display text-xl font-black text-stone-900 dark:text-white uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sunset-crimson dark:text-sunset-coral" />
              Session Curriculum & Overview
            </h2>

            <div className="text-stone-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {event.eventDescription}
            </div>

            {Array.isArray(event.tags) && event.tags.length > 0 && (
              <div className="pt-4 border-t border-stone-200 dark:border-sunset-borderDark flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-white dark:bg-white/5 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Agenda Timeline */}
          {Array.isArray(event.agenda) && event.agenda.length > 0 && (
            <div className="p-8 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark space-y-6 shadow-sm">
              <h2 className="font-display text-xl font-black text-stone-900 dark:text-white uppercase flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
                Schedule & Workshop Timeline
              </h2>

              <div className="relative border-l-2 border-stone-200 dark:border-sunset-borderDark pl-6 ml-2 space-y-6">
                {event.agenda.map((slot, index) => (
                  <div key={index} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-sunset-crimson dark:bg-sunset-coral ring-4 ring-white dark:ring-sunset-slateDark" />
                    <span className="text-xs font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase">
                      {slot.time}
                    </span>
                    <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase">{slot.topic}</h4>
                    {slot.speaker && (
                      <p className="text-xs text-stone-500 dark:text-sunset-mutedDark font-medium">Instructor: {slot.speaker}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaker Profile Box */}
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark space-y-4 shadow-sm">
            <h2 className="font-display text-xl font-black text-stone-900 dark:text-white uppercase flex items-center gap-2">
              <User className="w-5 h-5 text-sunset-crimson dark:text-sunset-coral" />
              Lead Faculty & Keynote Mentor
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-sunset-obsidian border border-sunset-crimson/30 dark:border-sunset-coral/30 flex items-center justify-center text-sunset-crimson dark:text-sunset-coral shrink-0 font-display font-black text-2xl shadow-sm">
                {event.resourcePerson ? event.resourcePerson.charAt(0) : 'M'}
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-black text-stone-900 dark:text-white uppercase">{event.resourcePerson}</h3>
                <p className="text-xs text-stone-600 dark:text-sunset-mutedDark leading-relaxed">
                  {event.speakerBio ||
                    'Renowned domain specialist and industry contributor bringing real-world hands-on knowledge to campus.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Admission Box */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border-2 border-sunset-crimson/30 dark:border-sunset-coral/30 shadow-xl space-y-6 sticky top-24">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-sunset-crimson dark:text-sunset-coral">
                CAMPUS ADMISSION
              </span>
              <h3 className="font-display text-xl font-black text-stone-900 dark:text-white uppercase">RESERVE YOUR SPOT</h3>
              <p className="text-xs text-stone-500 dark:text-sunset-mutedDark">Free verified admission for registered students.</p>
            </div>

            {/* Logistics Meta List */}
            <div className="space-y-3 pt-2 text-xs font-medium">
              <div className="flex items-start gap-3 text-stone-800 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block uppercase text-[10px]">Session Date</span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-800 dark:text-slate-300">
                <Clock className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block uppercase text-[10px]">Time Window</span>
                  <span>{formattedTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-stone-800 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-sunset-tangerine dark:text-sunset-goldenTangerine shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block uppercase text-[10px]">Campus Location</span>
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>

            {/* Seat Tracker */}
            <div className="pt-4 border-t border-stone-200 dark:border-sunset-borderDark">
              <SeatIndicator
                availableSeats={event.availableSeats}
                maxParticipants={event.maxParticipants}
              />
            </div>

            {/* Registration Action */}
            <div className="pt-2">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-sunset-coral/15 border border-rose-200 dark:border-sunset-coral/30 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-sunset-crimson dark:text-sunset-coral mx-auto" />
                    <p className="text-xs font-black uppercase text-sunset-crimson dark:text-sunset-coral tracking-wider">
                      You're Enrolled!
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-sunset-mutedDark">
                      Your digital QR pass is ready in My Passes.
                    </p>
                  </div>

                  <Link
                    to="/my-registrations"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral transition-all"
                  >
                    <span>View Digital Entry Pass</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!isRegistrationOpen || isRegistering}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                    isRegistrationOpen && !isRegistering
                      ? 'bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral hover:scale-[1.02] active:scale-95'
                      : 'bg-stone-200 text-stone-400 dark:bg-sunset-obsidian dark:text-slate-600 cursor-not-allowed border border-transparent'
                  }`}
                >
                  {isRegistering ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming Enrollment...</span>
                    </>
                  ) : isSoldOut ? (
                    'MAX CAPACITY REACHED'
                  ) : isCompleted ? (
                    'SESSION CONCLUDED'
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>SECURE ENTRY PASS</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Organizer Controls */}
            {isElevated && (
              <div className="pt-4 border-t border-stone-200 dark:border-sunset-borderDark space-y-2">
                <p className="text-[10px] font-mono font-black text-stone-500 dark:text-sunset-mutedDark uppercase tracking-widest">
                  Organizer Admin Controls
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/edit-event/${event._id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase bg-white hover:bg-stone-100 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark text-stone-900 dark:text-white border border-stone-200 dark:border-sunset-borderDark transition-colors shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sunset-crimson dark:text-sunset-coral" />
                    <span>Edit Session</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="pt-8 border-t border-stone-200 dark:border-sunset-borderDark space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
              RECOMMENDED FOR YOUR TRACK
            </h2>
            <p className="text-xs text-stone-500 dark:text-sunset-mutedDark">
              Related workshops & events based on category, topics, and speaker tags
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((recEvent) => (
              <EventCard key={recEvent._id} event={recEvent} />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Campus Event"
        message={`Are you sure you want to permanently delete "${event.eventName}"? All registered attendee passes will be invalidated.`}
        confirmText="Delete Event"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
