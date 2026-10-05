import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  Sparkles,
  RotateCcw,
  BarChart3,
  CheckCircle2,
  Users,
  Flame,
  ArrowUpRight,
  ArrowRight,
  Plus,
  QrCode,
  Play,
  Ticket,
  MapPin,
  Send,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useEventFilter } from '../hooks/useEventFilter';
import { usePagination } from '../hooks/usePagination';
import { EventCard } from '../components/EventCard';
import { Pagination } from '../components/Pagination';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { CountdownTimer } from '../components/CountdownTimer';
import { RegistrationAnalytics } from '../components/RegistrationAnalytics';

// Collegiate Track Definitions & Mappings
const TRACKS = [
  { label: 'All Tracks', value: 'ALL' },
  { label: 'Technical & Dev', value: 'Workshop' },
  { label: 'Hackathons', value: 'Hackathon' },
  { label: 'Creative Arts', value: 'Cultural' },
  { label: 'Faculty Seminars', value: 'Seminar' },
  { label: 'Guest Keynotes', value: 'Guest Lecture' },
];

const FEATURED_MENTORS = [
  {
    name: 'Dr. Esther Howard',
    tagline: 'KEYNOTE MENTOR',
    role: 'Lead AI & Neural Systems Architect',
    organization: 'DesignCraft Global & Stanford AI Lab',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    topic: 'Next-Gen Generative AI Systems',
  },
  {
    name: 'Prof. Cody Fisher',
    tagline: 'WORKSHOP INSTRUCTOR',
    role: 'Principal Cyber Resilience Lead',
    organization: 'SentinelGrid Security',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    topic: 'Zero-Trust Cyber Defense & 24h CTF',
  },
  {
    name: 'Dr. Dianne Russell',
    tagline: 'KEYNOTE MENTOR',
    role: 'Distinguished Quantum Physicist',
    organization: 'Quantum Institute of Tech',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    topic: 'Practical Qubits & Quantum Computing',
  },
];

const SPONSORS = ['Indeed', 'Skyline AI', 'Optimus', 'Laserlite', 'GitHub Campus', 'Vercel'];

export const EventListPage = () => {
  const { events, loading } = useEvents();
  const { isElevated } = useAuth();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    toggleType,
    availabilityFilter,
    setAvailabilityFilter,
    dateFilter,
    setDateFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    sortBy,
    setSortBy,
    filteredEvents,
    isFiltered,
    resetFilters,
  } = useEventFilter(events);

  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    hasNext,
    hasPrev,
  } = usePagination(filteredEvents, 6);

  const featuredEvent = events.find((e) => e.status === 'Registration Open') || events[0];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen space-y-16 sm:space-y-24 pb-12 animate-fade-in">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Eyebrow Pill & Headline */}
        <div className="text-center space-y-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-sunset-coral/15 border border-rose-200 dark:border-sunset-coral/30 text-sunset-crimson dark:text-sunset-coral text-xs font-black uppercase tracking-widest shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>🎓 EMPOWERING CAMPUS CLUBS, CODE SPRINT & WORKSHOPS</span>
          </div>

          {/* Main Big Display Headline - Centered, Balanced, Responsive */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-[1.1] text-balance mx-auto">
            IGNITE{' '}
            <span className="inline-flex items-center justify-center align-middle mx-1 sm:mx-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-lg shadow-sunset-crimson/30 dark:shadow-sunset-coral/30">
              <Zap className="w-5 h-5 sm:w-8 sm:h-8 fill-current" />
            </span>{' '}
            YOUR POTENTIAL <br className="hidden sm:block" />
            AT EVERY CAMPUS{' '}
            <span className="inline-flex items-center align-middle mx-1 text-sunset-tangerine dark:text-sunset-goldenTangerine">
              ➔
            </span>{' '}
            EVENT
          </h1>
        </div>

        {/* Hero Bento Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Box: Sponsors & Rotating Stamp Badge */}
          <div className="lg:col-span-5 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="space-y-4">
              <span className="text-[11px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
                CAMPUS PARTNERS & INDUSTRY SPONSORS
              </span>

              {/* Sponsor Logos */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {SPONSORS.slice(0, 6).map((sp) => (
                  <div
                    key={sp}
                    className="p-2.5 rounded-xl bg-white dark:bg-sunset-obsidian border border-stone-200 dark:border-white/5 text-center text-xs font-black text-stone-800 dark:text-slate-200 uppercase tracking-wider shadow-sm"
                  >
                    {sp}
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Spinning Stamp: • SECURE YOUR SPOT • JOIN THE HUDDLE • BE THERE • */}
            <div className="pt-8 flex items-center justify-center lg:justify-start">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg
                  className="w-full h-full animate-spin-slow"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="circlePathHero"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text className="text-[8.5px] font-black uppercase tracking-[2px] fill-sunset-crimson dark:fill-sunset-coral">
                    <textPath href="#circlePathHero" startOffset="0%">
                      • SECURE YOUR SPOT • JOIN THE HUDDLE • BE THERE
                    </textPath>
                  </text>
                </svg>

                {/* Center Action Play */}
                <Link
                  to={featuredEvent ? `/events/${featuredEvent._id}` : '/events'}
                  className="absolute w-12 h-12 rounded-full bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Hero Box: Subheading & Main Action CTA */}
          <div className="lg:col-span-7 rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-stone-600 dark:text-sunset-mutedDark font-medium leading-relaxed max-w-xl">
                Your all-in-one portal for university hackathons, technical bootcamps, and cultural summits. Secure verified digital entry passes in seconds.
              </p>

              {/* Countdown Ticker & QR Box */}
              <div className="p-5 rounded-2xl bg-white dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
                    NEXT LIVE STAGE OPENS IN:
                  </span>
                  <CountdownTimer
                    targetDate={featuredEvent ? featuredEvent.eventDate : new Date(Date.now() + 86400000)}
                  />
                </div>

                <div className="flex flex-col items-center bg-stone-50 dark:bg-sunset-slateDark p-3 rounded-2xl border border-stone-200 dark:border-sunset-borderDark shrink-0 shadow-sm">
                  <QrCode className="w-12 h-12 text-stone-900 dark:text-white" />
                  <span className="text-[8.5px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-wider mt-1 text-center">
                    ONE-TAP CAMPUS PASS
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Main Action Button: SECURE YOUR ENTRY PASS ↗ */}
            <Link
              to={featuredEvent ? `/events/${featuredEvent._id}` : '/events'}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black font-display font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-sunset-crimson dark:shadow-sunset-coral hover:scale-[1.01] active:scale-95 group"
            >
              <span>SECURE YOUR ENTRY PASS</span>
              <div className="w-8 h-8 rounded-full bg-white text-sunset-crimson dark:bg-black dark:text-sunset-coral flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FEATURE / "DECIDE TO JOIN" TEASER SECTION                 */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-sm">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
              SEAMLESS CAMPUS ACCESS
            </span>

            <h2 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight">
              NEVER MISS A BEAT <br />
              ACROSS CAMPUS
            </h2>

            <p className="text-sm text-stone-600 dark:text-sunset-mutedDark leading-relaxed max-w-md">
              Discover faculty-led masterclasses, student-driven competitions, and club workshops. Track available seats live and reserve your spot before registration caps out.
            </p>

            <div>
              <a
                href="#catalog-grid"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black font-black text-xs uppercase tracking-wider shadow-sunset-crimson dark:shadow-sunset-coral transition-all hover:scale-105 active:scale-95"
              >
                <span>EXPLORE UPCOMING HAPPENINGS</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3D Ticket Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm sm:max-w-md min-h-[220px] rounded-3xl bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(245,158,11,0.4)] transform rotate-[-4deg] hover:rotate-0 transition-transform duration-500 border-2 border-black/80 ticket-cutout-left ticket-cutout-right">
              <div className="flex items-center justify-between border-b-2 border-dashed border-black/40 pb-2.5">
                <span className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-widest">
                  ★ CAMPUSPHERE PASS ★
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-black">#2026-VIP</span>
              </div>

              <div className="text-center py-2 sm:py-3 space-y-1">
                <span className="font-display text-xl sm:text-2xl font-black tracking-wide uppercase leading-tight block">
                  CAMPUS ENTRY PASS
                </span>
                <span className="font-mono text-[11px] font-black block tracking-widest text-black/80">
                  // VERIFIED ATTENDEE
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-black border-t-2 border-dashed border-black/40 pt-2.5">
                <span>CAMPUS ADMISSION</span>
                <span>DIGITAL QR VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DISCOVER UPCOMING EVENTS (Venue & Logistics Bento)         */}
      {/* ============================================================ */}
      <section id="schedule-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-sunset-borderDark pb-4">
          <div>
            <span className="text-[11px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
              VENUE & SCHEDULE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
              DISCOVER UPCOMING EVENTS
            </h2>
          </div>

          {isElevated && (
            <button
              type="button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white dark:bg-sunset-slateDark text-sunset-crimson dark:text-sunset-coral border border-sunset-crimson/30 dark:border-sunset-coral/30 shadow-sm transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showAnalytics ? 'Hide Analytics' : 'Registration Analytics'}</span>
            </button>
          )}
        </div>

        {/* Analytics Dropdown */}
        {isElevated && showAnalytics && (
          <div className="animate-slide-down">
            <RegistrationAnalytics />
          </div>
        )}

        {/* Bento Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-3xl bg-sunset-crimson dark:bg-sunset-coral text-white dark:text-black p-8 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-3">
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight">
                EXPLORE THE LOCATION
              </h3>
              <p className="text-xs sm:text-sm text-white/90 dark:text-black/80 leading-relaxed max-w-md">
                Our platform is designed to make it easy for you to find and book events that match your
                interests and preferences. You can browse through a range of events and filter results by
                date, location, category, and more.
              </p>
            </div>

            <div>
              <a
                href="#catalog-grid"
                className="inline-flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                <span>EXPLORE THE LOCATION</span>
                <span className="w-6 h-6 rounded-full bg-black text-sunset-tangerine dark:text-sunset-goldenTangerine flex items-center justify-center text-xs font-black">
                  +
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark min-h-[260px] relative group shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
              alt="Main Auditorium"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
              <span>Main Auditorium • Hall 101</span>
              <span className="text-sunset-tangerine dark:text-sunset-goldenTangerine">500 Seats Capacity</span>
            </div>
          </div>
        </div>

        {/* Bento Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark min-h-[260px] relative group shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
              alt="Panel Discussion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
              <span>Campus Innovation Arena • Alpha Stage</span>
              <span className="text-sunset-coral">Live Q&A Sessions</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-sunset-tangerine dark:bg-sunset-goldenTangerine text-black p-8 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                SMART TRACK DISCOVERY
              </span>
              <p className="text-xs sm:text-sm font-black text-black leading-relaxed uppercase">
                SIMPLE SEARCH FUNCTION, YOU CAN BROWSE THROUGH A RANGE OF SESSIONS AND FILTER RESULTS BY
                TRACK, VENUE, CAPACITY, AND MORE.
              </p>
            </div>

            <div>
              <a
                href="#catalog-grid"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sunset-crimson dark:bg-sunset-coral hover:bg-sunset-crimsonHover text-white dark:text-black font-display font-black text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <span>EXPLORE</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHAT’S HAPPENING ON CAMPUS (DISCOVERY & FILTERS)          */}
      {/* ============================================================ */}
      <section id="catalog-grid" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-2 border-b border-stone-200 dark:border-sunset-borderDark pb-4">
          <span className="text-[11px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
            LIVE CAMPUS DIRECTORY
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight text-balance">
            WHAT’S HAPPENING ON CAMPUS
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-sunset-mutedDark max-w-xl mx-auto">
            Filter by departmental tracks, club activities, and certification workshops.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-sunset-mutedDark" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tracks, faculty leads, room numbers, or #tags..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral focus:ring-sunset-crimson/20 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-900"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 px-3.5 py-3 rounded-2xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
              >
                <option value="soonest">Sort: Soonest Date</option>
                <option value="latest">Sort: Latest Date</option>
                <option value="popular">Sort: Most Enrolled</option>
                <option value="seats-desc">Sort: Seats Left (High)</option>
                <option value="seats-asc">Sort: Seats Left (Low)</option>
                <option value="name-asc">Sort: Title (A-Z)</option>
              </select>

              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Reset all filters"
                  className="px-3.5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Departmental Track Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {TRACKS.map((track) => {
              const isAll = track.value === 'ALL';
              const isSelected = isAll ? selectedTypes.length === 0 : selectedTypes.includes(track.value);

              return (
                <button
                  key={track.label}
                  type="button"
                  onClick={() => {
                    if (isAll) {
                      selectedTypes.forEach((t) => toggleType(t));
                    } else {
                      toggleType(track.value);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral scale-105'
                      : 'bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-stone-700 dark:text-sunset-mutedDark hover:border-sunset-crimson hover:text-stone-900'
                  }`}
                >
                  [ {track.label} ]
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No Matching Campus Events"
            description="Try switching departmental tracks, adjusting keywords, or clearing your search filters."
            actionText="Reset All Filters"
            onAction={resetFilters}
            showCreateButton={isElevated}
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 5. SPEAKER / MENTOR SECTION                                  */}
      {/* ============================================================ */}
      <section id="speakers-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 border-b border-stone-200 dark:border-sunset-borderDark pb-4">
          <span className="text-[11px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
            FACULTY & INDUSTRY LEADERS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight text-balance">
            LEARN FROM INDUSTRY LEADERS & FACULTY MENTORS
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-sunset-mutedDark max-w-2xl mx-auto">
            Meet the guest innovators, industry leads, and professors driving our technical sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_MENTORS.map((mentor) => (
            <div
              key={mentor.name}
              className="group rounded-3xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark overflow-hidden flex flex-col justify-between p-6 space-y-4 hover:border-sunset-crimson dark:hover:border-sunset-coral transition-all duration-300 hover:-translate-y-1.5 shadow-sm"
            >
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-sunset-obsidian">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Speaker Card Tagline: KEYNOTE MENTOR / WORKSHOP INSTRUCTOR */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider bg-white/95 text-sunset-crimson dark:bg-black/90 dark:text-sunset-coral border border-sunset-crimson/30 dark:border-sunset-coral/30 shadow-md">
                    {mentor.tagline}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-sunset-crimson dark:text-sunset-coral uppercase tracking-tight">
                    {mentor.name}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-sunset-tangerine/20 text-sunset-tangerine dark:text-sunset-goldenTangerine flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-stone-900 dark:text-white font-bold">{mentor.role}</p>
                <p className="text-[11px] text-stone-500 dark:text-sunset-mutedDark">{mentor.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM CONVERSION STRIP                                   */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden relative bg-sunset-crimson dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-8 sm:p-14 min-h-[320px] flex flex-col justify-between shadow-lg">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-sunset-crimson/95 via-sunset-crimson/80 to-transparent dark:from-sunset-obsidian dark:via-sunset-obsidian/90 dark:to-transparent" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                READY TO ELEVATE YOUR <br />
                CAMPUS JOURNEY?
              </h2>
              <p className="text-xs sm:text-base text-white/95 dark:text-sunset-mutedDark max-w-xl leading-relaxed font-medium">
                Join thousands of students leveling up their skills, networks, and portfolios.
              </p>

              <div>
                <a
                  href="#catalog-grid"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-sunset-tangerine dark:bg-sunset-goldenTangerine hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <span>GET YOUR FIRST WORKSHOP PASS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Circular Stamp Badge: • LEVEL UP • ATTEND • NETWORK • */}
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    id="circlePathConvert"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text className="text-[8.5px] font-black uppercase tracking-[2px] fill-white dark:fill-sunset-goldenTangerine">
                    <textPath href="#circlePathConvert" startOffset="0%">
                      • LEVEL UP • ATTEND • NETWORK
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-12 h-12 rounded-full bg-white dark:bg-sunset-goldenTangerine text-sunset-crimson dark:text-black flex items-center justify-center font-bold shadow-md">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FOOTER SECTION                                            */}
      {/* ============================================================ */}
      <footer className="border-t border-stone-200 dark:border-sunset-borderDark bg-stone-50 dark:bg-sunset-obsidian pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sunset-crimson via-sunset-coral to-sunset-tangerine flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-stone-900 dark:text-white">
                Campu<span className="text-sunset-crimson dark:text-sunset-coral">Sphere</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-sunset-mutedDark leading-relaxed">
              CampuSphere — Bridging Campus Talent with Real-World Experiences.
            </p>
          </div>

          {/* Newsletter Box in Sunset Tangerine */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] font-mono font-black text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest block">
              CAMPUS DISPATCH DIRECT TO YOUR INBOX
            </span>

            {newsletterSubscribed ? (
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> You're on the Campus Dispatch list!
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your student email (@university.edu)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-sunset-slateDark text-stone-900 dark:text-white placeholder-stone-400 text-xs font-medium focus:outline-none border border-stone-200 dark:border-sunset-borderDark focus:border-sunset-crimson shadow-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black font-black text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <span>JOIN DISPATCH</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-3 flex justify-start md:justify-end text-xs font-black uppercase tracking-wider space-y-2 flex-col text-stone-500 dark:text-sunset-mutedDark">
            <Link to="/events" className="hover:text-sunset-crimson dark:hover:text-white">
              Discover
            </Link>
            <a href="#catalog-grid" className="hover:text-sunset-crimson dark:hover:text-white">
              Workshops
            </a>
            <a href="#schedule-section" className="hover:text-sunset-crimson dark:hover:text-white">
              Schedule
            </a>
            <Link to="/my-registrations" className="hover:text-sunset-crimson dark:hover:text-white">
              My Passes
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-sunset-borderDark py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-sunset-mutedDark">
          <p>© 2026 CampuSphere — Bridging Campus Talent with Real-World Experiences.</p>
          <div className="flex items-center gap-4 font-medium">
            <a href="#" className="hover:underline">
              Student Code of Conduct
            </a>
            <a href="#" className="hover:underline">
              Privacy Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
