import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit3, ArrowLeft } from 'lucide-react';
import { EventForm } from '../components/EventForm';
import { useEvents } from '../context/EventContext';

export const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, updateEvent, events } = useEvents();

  const [eventData, setEventData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const found = getEvent(id);
    if (found) {
      setEventData(found);
    }
  }, [id, getEvent, events]);

  const handleSubmit = async (updatedFormData) => {
    try {
      setIsSubmitting(true);
      await updateEvent(id, updatedFormData);
      setIsSubmitting(false);
      navigate(`/events/${id}`);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (!eventData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <h2 className="text-xl font-bold text-sunset-charcoal dark:text-white">Loading Event Data...</h2>
        <Link to="/events" className="text-xs text-sunset-crimson dark:text-sunset-coral hover:underline">
          Return to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to={`/events/${id}`}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-3xl font-black text-sunset-charcoal dark:text-white tracking-tight uppercase flex items-center gap-3">
          <Edit3 className="w-8 h-8 text-sunset-crimson dark:text-sunset-coral" />
          Edit Campus Event
        </h1>
        <p className="text-sm text-sunset-mutedLight dark:text-sunset-mutedDark">
          Modify event schedule, capacity adjustments, speakers, or description.
        </p>
      </div>

      <EventForm
        initialValues={eventData}
        isEditMode={true}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
