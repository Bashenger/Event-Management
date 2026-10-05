import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Shield,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { success, error } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    studentId: '',
    role: 'student',
  });

  const redirectPath = location.state?.from?.pathname || '/events';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
          error('Please complete all required fields');
          setLoading(false);
          return;
        }
        const user = await register(formData);
        success(`Welcome to CampuSphere, ${user.name}! (${user.role.toUpperCase()})`);
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          error('Please enter your email and password');
          setLoading(false);
          return;
        }
        const user = await login(formData.email.trim(), formData.password);
        success(`Signed in as ${user.name} (${user.role.toUpperCase()})`);
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password,
    }));
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-xl space-y-6">
        {/* Return to home */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-sunset-mutedDark hover:text-sunset-crimson dark:hover:text-sunset-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Directory</span>
        </Link>

        {/* Auth Container Card */}
        <div className="rounded-3xl bg-white dark:bg-sunset-slateDark border border-stone-200 dark:border-sunset-borderDark p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
          {/* Header & Brand */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sunset-crimson via-sunset-coral to-sunset-tangerine text-white shadow-md mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN TO CAMPUSPHERE'}
              </h1>
              <p className="text-xs text-stone-600 dark:text-sunset-mutedDark">
                {isSignUp
                  ? 'Register with your student, organizer, or faculty credentials'
                  : 'Access your workshop passes, event dashboards, and schedules'}
              </p>
            </div>
          </div>

          {/* Form / Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                !isSignUp
                  ? 'bg-white dark:bg-sunset-slateDark text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-sunset-mutedDark hover:text-stone-900'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isSignUp
                  ? 'bg-white dark:bg-sunset-slateDark text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-sunset-mutedDark hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-300">
                  Full Name <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-sunset-mutedDark" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-300">
                Campus Email Address <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-sunset-mutedDark" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@campus.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-300">
                Password <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-sunset-mutedDark" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-800 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-300">
                    Account Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
                  >
                    <option value="student">Student Attendee</option>
                    <option value="organizer">Club / Workshop Organizer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-slate-300">
                    Student / Faculty ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="CS-2026-089"
                    className="w-full px-3.5 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-stone-200 dark:border-sunset-borderDark text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black font-black text-xs uppercase tracking-wider shadow-sunset-crimson dark:shadow-sunset-coral transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'REGISTER ACCOUNT' : 'SIGN IN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Credential Hints for Testing */}
          <div className="pt-4 border-t border-stone-200 dark:border-sunset-borderDark space-y-2">
            <span className="text-[10px] font-mono font-black text-stone-500 dark:text-sunset-mutedDark uppercase tracking-wider block">
              Sample Seeded Accounts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillCredentials('student@campus.edu', 'password123')}
                className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark border border-stone-200 dark:border-sunset-borderDark text-left transition-colors"
              >
                <span className="font-bold text-sunset-crimson dark:text-sunset-coral block">Student</span>
                <span className="text-stone-500 dark:text-sunset-mutedDark font-mono text-[10px] truncate block">student@campus.edu</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('organizer@campus.edu', 'password123')}
                className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark border border-stone-200 dark:border-sunset-borderDark text-left transition-colors"
              >
                <span className="font-bold text-sunset-tangerine dark:text-sunset-goldenTangerine block">Organizer</span>
                <span className="text-stone-500 dark:text-sunset-mutedDark font-mono text-[10px] truncate block">organizer@campus.edu</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin@campus.edu', 'password123')}
                className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark border border-stone-200 dark:border-sunset-borderDark text-left transition-colors"
              >
                <span className="font-bold text-purple-600 dark:text-purple-400 block">Faculty Admin</span>
                <span className="text-stone-500 dark:text-sunset-mutedDark font-mono text-[10px] truncate block">admin@campus.edu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
