import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, ShieldAlert, Briefcase } from 'lucide-react';
import { EventForm } from '../components/EventForm';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { isStudent, switchRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const newEvent = await createEvent(formData);
      setIsSubmitting(false);
      navigate(`/events/${newEvent._id || ''}`);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Role Warning Banner */}
      {isStudent && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-sunset-goldenTangerine/15 border border-amber-200 dark:border-sunset-goldenTangerine/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-sunset-tangerine dark:text-sunset-goldenTangerine shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-sunset-charcoal dark:text-white">Viewing in Student Mode</h4>
              <p className="text-xs text-sunset-mutedLight dark:text-slate-300">
                Only Organizers and Faculty Admins can create new campus events. Switch to Organizer mode to test event creation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchRole('organizer')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-sunset-tangerine hover:bg-amber-400 text-black shadow-sm transition-all shrink-0"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Switch to Organizer Mode</span>
          </button>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-black text-sunset-charcoal dark:text-white tracking-tight uppercase flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-sunset-crimson dark:text-sunset-coral" />
          Create New Campus Event
        </h1>
        <p className="text-sm text-sunset-mutedLight dark:text-sunset-mutedDark">
          Configure workshop curriculum, keynote speakers, seat capacity, and schedule timelines on CampuSphere.
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
