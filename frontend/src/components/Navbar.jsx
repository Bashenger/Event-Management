import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  PlusCircle,
  BarChart3,
  Shield,
  Briefcase,
  GraduationCap,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  Sun,
  Moon,
  Zap,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole, isAuthenticated, isElevated, logout } = useAuth();
  const { registrations, resetToDefaultData } = useEvents();
  const { info } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Light / Dark Theme State
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('campus_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campus_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const activeRegistrationsCount = registrations.filter((r) => r.status === 'Confirmed').length;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    info('You have been signed out.');
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
      isActive
        ? 'bg-sunset-crimson/10 text-sunset-crimson dark:bg-sunset-coral/15 dark:text-sunset-coral border border-sunset-crimson/20 dark:border-sunset-coral/30'
        : 'text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
      isActive
        ? 'bg-sunset-crimson/10 text-sunset-crimson dark:bg-sunset-coral/15 dark:text-sunset-coral border border-sunset-crimson/20 dark:border-sunset-coral/30'
        : 'text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-sunset-obsidian/95 backdrop-blur-xl border-b border-stone-200 dark:border-sunset-borderDark transition-colors duration-300">
      {/* Top Banner Tag: THE CENTRAL NERVOUS SYSTEM OF CAMPUS LIFE */}
      <div className="hidden lg:flex items-center justify-center py-1 bg-stone-100 dark:bg-sunset-slateDark border-b border-stone-200/80 dark:border-sunset-borderDark/60 text-[10px] font-mono font-black uppercase tracking-widest text-stone-600 dark:text-sunset-mutedDark gap-2">
        <Zap className="w-3 h-3 text-sunset-crimson dark:text-sunset-coral fill-sunset-crimson dark:fill-sunset-coral" />
        <span>⚡ THE CENTRAL NERVOUS SYSTEM OF CAMPUS LIFE</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo - CampuSphere */}
          <Link
            to="/events"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark shadow-sm group-hover:border-sunset-crimson dark:group-hover:border-sunset-coral transition-colors">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sunset-crimson via-sunset-coral to-sunset-tangerine flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-stone-900 dark:text-white">
                Campu<span className="text-sunset-crimson dark:text-sunset-coral">Sphere</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/events" className={navLinkClasses}>
              DISCOVER
            </NavLink>

            <a
              href="#catalog-grid"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('catalog-grid');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              WORKSHOPS
            </a>

            <a
              href="#schedule-section"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('schedule-section');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-stone-600 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              SCHEDULE
            </a>

            <NavLink to="/my-registrations" className={navLinkClasses}>
              <span>MY PASSES</span>
              {activeRegistrationsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-black rounded-full bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black">
                  {activeRegistrationsCount}
                </span>
              )}
            </NavLink>

            {/* Organizer & Admin Create Action */}
            {isElevated && (
              <NavLink to="/create-event" className={navLinkClasses}>
                <span className="text-sunset-crimson dark:text-sunset-coral font-black">+ HOST EVENT</span>
              </NavLink>
            )}
          </nav>

          {/* Controls: Theme Toggle & Role-Authenticated Profile Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-stone-900 dark:text-sunset-whiteDark hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-sunset-tangerine" /> : <Moon className="w-4 h-4 text-stone-800" />}
            </button>

            {/* Reset Data Helper */}
            <button
              onClick={resetToDefaultData}
              title="Refresh and sync data with MongoDB"
              className="p-2 rounded-xl text-stone-500 dark:text-sunset-mutedDark hover:text-stone-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Authenticated User Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-sunset-borderDark bg-stone-50 dark:bg-sunset-slateDark text-xs font-black tracking-wide uppercase transition-all shadow-sm hover:border-sunset-crimson dark:hover:border-sunset-coral text-stone-900 dark:text-white"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-500'
                      : currentUser.role === 'organizer'
                      ? 'bg-sunset-tangerine'
                      : 'bg-sunset-crimson dark:bg-sunset-coral'
                  }`} />
                  <span className="truncate max-w-[110px]">{currentUser.name || currentUser.role}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase bg-stone-200 dark:bg-white/10 text-stone-700 dark:text-slate-300">
                    {currentUser.role}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 dark:text-sunset-mutedDark transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark shadow-2xl p-3 z-50 animate-slide-down"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    {/* User Profile Card */}
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark space-y-1">
                      <p className="text-xs font-black text-stone-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-sunset-mutedDark truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-stone-600 dark:text-slate-400">
                        <span>Role:</span>
                        <span className="font-black uppercase text-sunset-crimson dark:text-sunset-coral">
                          {currentUser.role}
                        </span>
                      </div>
                      {currentUser.studentId && (
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-600 dark:text-slate-400">
                          <span>ID:</span>
                          <span className="font-bold">{currentUser.studentId}</span>
                        </div>
                      )}
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-1 pt-2">
                      <Link
                        to="/my-registrations"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
                          My Passes ({activeRegistrationsCount})
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      {isElevated && (
                        <Link
                          to="/create-event"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <PlusCircle className="w-4 h-4 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
                            Create New Event
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors pt-2 border-t border-stone-200 dark:border-sunset-borderDark"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-sunset-slateDark dark:hover:bg-sunset-borderDark border border-stone-200 dark:border-sunset-borderDark text-stone-900 dark:text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-sunset-crimson dark:text-sunset-coral" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Primary Action Button: CLAIM PASS ↗ */}
            <Link
              to="/my-registrations"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black text-xs font-black tracking-wider uppercase transition-all shadow-sunset-crimson dark:shadow-sunset-coral hover:scale-105 active:scale-95"
            >
              <span>CLAIM PASS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Theme Toggle & Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-50 dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark text-stone-900 dark:text-white"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-sunset-tangerine" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-sunset-slateDark border-b border-stone-200 dark:border-sunset-borderDark px-4 pt-2 pb-6 space-y-3 animate-slide-down">
          {/* User Status Card on Mobile */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-stone-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[10px] text-stone-500 dark:text-sunset-mutedDark">{currentUser.email}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black text-xs font-black uppercase tracking-wider"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to CampuSphere</span>
            </Link>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            <NavLink
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              <span>DISCOVER</span>
            </NavLink>

            <a
              href="#catalog-grid"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection('catalog-grid');
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-stone-600 dark:text-sunset-mutedDark"
            >
              <span>WORKSHOPS</span>
            </a>

            <a
              href="#schedule-section"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection('schedule-section');
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-stone-600 dark:text-sunset-mutedDark"
            >
              <span>SCHEDULE</span>
            </a>

            <NavLink
              to="/my-registrations"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              <span>MY PASSES</span>
              {activeRegistrationsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-black rounded-full bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black">
                  {activeRegistrationsCount}
                </span>
              )}
            </NavLink>

            {isElevated && (
              <NavLink
                to="/create-event"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClasses}
              >
                <span className="text-sunset-crimson dark:text-sunset-coral font-black">+ HOST EVENT</span>
              </NavLink>
            )}
          </div>

          {/* Logout on Mobile */}
          {currentUser && (
            <div className="pt-2 border-t border-stone-200 dark:border-sunset-borderDark">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
