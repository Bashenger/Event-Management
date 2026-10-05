import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { RegistrationCard } from '../components/RegistrationCard';
import { EmptyState } from '../components/EmptyState';

export const MyRegistrationsPage = () => {
  const { registrations } = useEvents();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past' | 'all'

  const userRegistrations = useMemo(() => {
    return registrations.filter(
      (reg) => reg.userId === currentUser._id || reg.userEmail === currentUser.email
    );
  }, [registrations, currentUser]);

  const categorized = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    userRegistrations.forEach((reg) => {
      const event = reg.eventSnapshot || reg.eventId || {};
      const eventDate = event.eventDate ? new Date(event.eventDate) : now;

      if (eventDate >= now && reg.status !== 'Cancelled') {
        upcoming.push(reg);
      } else {
        past.push(reg);
      }
    });

    return { upcoming, past };
  }, [userRegistrations]);

  const displayedRegistrations =
    tab === 'upcoming'
      ? categorized.upcoming
      : tab === 'past'
      ? categorized.past
      : userRegistrations;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-sunset-coral/15 text-sunset-crimson dark:text-sunset-coral border border-rose-200 dark:border-sunset-coral/30 text-xs font-black uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            CAMPUSPHERE VERIFIED PASSES
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
            MY CAMPUS PASSES & SESSIONS
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-sunset-mutedDark">
            Manage your live session admissions, download verified QR entry tokens, or sync with your calendar.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark shrink-0 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black flex items-center justify-center font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-2xl font-black text-stone-900 dark:text-white leading-none block">
              {categorized.upcoming.length}
            </span>
            <span className="text-[10px] font-mono font-black text-stone-500 dark:text-sunset-mutedDark uppercase tracking-wider">
              Active Passes
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark w-fit">
        <button
          type="button"
          onClick={() => setTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tab === 'upcoming'
              ? 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral'
              : 'text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <span>Upcoming Sessions</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/20 text-[10px] font-mono font-black">
            {categorized.upcoming.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('past')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tab === 'past'
              ? 'bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black shadow-sm'
              : 'text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <span>Concluded / Past</span>
          <span className="px-2 py-0.5 rounded-full bg-black/15 text-[10px] font-mono font-black">
            {categorized.past.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tab === 'all'
              ? 'bg-stone-200 dark:bg-sunset-obsidian text-stone-900 dark:text-white border border-stone-300 dark:border-sunset-borderDark'
              : 'text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <span>All ({userRegistrations.length})</span>
        </button>
      </div>

      {/* Ticket List / Empty State */}
      {displayedRegistrations.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'No Upcoming Active Passes' : 'No Passes in this Category'}
          description="You haven't claimed passes for any upcoming sessions yet. Explore our directory to reserve seats!"
          actionText="Discover Campus Events"
          onAction={() => (window.location.href = '/events')}
        />
      ) : (
        <div className="space-y-4">
          {displayedRegistrations.map((reg) => (
            <RegistrationCard key={reg._id} registration={reg} />
          ))}
        </div>
      )}
    </div>
  );
};
