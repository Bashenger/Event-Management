import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Image as ImageIcon,
  Tag,
  ListPlus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useEventFormValidation } from '../hooks/useEventFormValidation';
import { EventCard } from './EventCard';

const SAMPLE_BANNERS = [
  { label: 'AI & Tech', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Seminar', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cloud & Code', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cultural Fest', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
  { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80' },
];

export const EventForm = ({
  initialValues = {},
  isEditMode = false,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    formData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    ALLOWED_CATEGORIES,
  } = useEventFormValidation(initialValues, isEditMode);

  const [activeTab, setActiveTab] = useState('edit');
  const [tagInput, setTagInput] = useState('');

  const addAgendaItem = () => {
    const current = formData.agenda || [];
    setFieldValue('agenda', [
      ...current,
      { time: '11:00 AM - 12:30 PM', topic: 'Next Topic / Workshop Module', speaker: formData.resourcePerson || '' },
    ]);
  };

  const removeAgendaItem = (index) => {
    const current = formData.agenda || [];
    setFieldValue('agenda', current.filter((_, idx) => idx !== index));
  };

  const updateAgendaItem = (index, field, value) => {
    const current = [...(formData.agenda || [])];
    if (current[index]) {
      current[index][field] = value;
      setFieldValue('agenda', current);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !formData.tags.includes(cleaned)) {
        setFieldValue('tags', [...formData.tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFieldValue('tags', formData.tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (valid) {
      onSubmit(formData);
    }
  };

  const formatForDatetimeInput = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark shadow-sm">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'edit'
                ? 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sm'
                : 'text-sunset-mutedLight dark:text-sunset-mutedDark hover:text-sunset-charcoal dark:hover:text-white'
            }`}
          >
            <span>Event Details Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'preview'
                ? 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sm'
                : 'text-sunset-mutedLight dark:text-sunset-mutedDark hover:text-sunset-charcoal dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Card Preview</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-3 text-xs">
          {isValid ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
              <CheckCircle2 className="w-4 h-4" /> Ready to publish
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 dark:text-sunset-goldenTangerine font-bold uppercase text-[10px]">
              <AlertCircle className="w-4 h-4" /> Required fields pending
            </span>
          )}
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark flex flex-col items-center justify-center space-y-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark">
            Preview of Event Card on CampuSphere:
          </p>
          <div className="w-full max-w-sm">
            <EventCard
              event={{
                _id: 'preview-demo',
                ...formData,
                availableSeats: formData.maxParticipants,
              }}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-5 shadow-sm">
            <h3 className="font-display text-base font-black text-sunset-charcoal dark:text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
              1. Event Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Event Title / Name <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Next-Gen Generative AI & LLM Systems Workshop"
                  className={`w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 transition-all ${
                    touched.eventName && errors.eventName
                      ? 'border-rose-500/80 focus:ring-rose-500/50'
                      : 'border-sunset-borderLight dark:border-sunset-borderDark focus:border-sunset-crimson dark:focus:border-sunset-coral focus:ring-sunset-crimson/20'
                  }`}
                />
                {touched.eventName && errors.eventName && (
                  <p className="text-xs text-rose-500 font-bold">{errors.eventName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Event Category <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                >
                  {ALLOWED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Workflow Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                >
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Published">Published (Preview only)</option>
                  <option value="Registration Open">Registration Open (Accepting bookings)</option>
                  <option value="Registration Closed">Registration Closed / Full</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Speaker & Logistics */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-5 shadow-sm">
            <h3 className="font-display text-base font-black text-sunset-charcoal dark:text-white uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
              2. Keynote Speaker & Logistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Speaker / Resource Person <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <input
                  type="text"
                  name="resourcePerson"
                  value={formData.resourcePerson}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Dr. Elena Rostova"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
                {touched.resourcePerson && errors.resourcePerson && (
                  <p className="text-xs text-rose-500 font-bold">{errors.resourcePerson}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Speaker Organization / Bio
                </label>
                <input
                  type="text"
                  name="speakerBio"
                  value={formData.speakerBio}
                  onChange={handleChange}
                  placeholder="e.g., Senior AI Research Scientist at DeepScale"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Start Date & Time <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formatForDatetimeInput(formData.eventDate)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
                {touched.eventDate && errors.eventDate && (
                  <p className="text-xs text-rose-500 font-bold">{errors.eventDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formatForDatetimeInput(formData.endDate)}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Venue / Room / Stream URL <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Main Auditorium Hall 101 or Zoom Link"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
                {touched.venue && errors.venue && (
                  <p className="text-xs text-rose-500 font-bold">{errors.venue}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                  Total Seat Capacity <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  min="5"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
                {touched.maxParticipants && errors.maxParticipants && (
                  <p className="text-xs text-rose-500 font-bold">{errors.maxParticipants}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Description, Media & Tags */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-5 shadow-sm">
            <h3 className="font-display text-base font-black text-sunset-charcoal dark:text-white uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
              3. Description, Banner & Tags
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                Detailed Event Description <span className="text-sunset-crimson dark:text-sunset-coral">*</span>
              </label>
              <textarea
                name="eventDescription"
                rows="4"
                value={formData.eventDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Comprehensive description of topics covered, hands-on takeaways, prerequisites..."
                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
              />
              {touched.eventDescription && errors.eventDescription && (
                <p className="text-xs text-rose-500 font-bold">{errors.eventDescription}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                Banner Image URL
              </label>
              <input
                type="text"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
              />

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[10px] font-bold uppercase text-sunset-mutedLight dark:text-sunset-mutedDark">Quick Pick:</span>
                {SAMPLE_BANNERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFieldValue('bannerImage', preset.url)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-sunset-obsidian hover:bg-stone-200 dark:hover:bg-sunset-borderDark text-xs font-bold text-sunset-charcoal dark:text-slate-300 border border-sunset-borderLight dark:border-white/10 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Manager */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-sunset-charcoal dark:text-slate-300">
                Tags (Press Enter to add)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="e.g., AI, Python, CTF"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark text-sm text-sunset-charcoal dark:text-white placeholder-sunset-mutedLight focus:outline-none focus:ring-2 focus:border-sunset-crimson dark:focus:border-sunset-coral"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 rounded-xl bg-sunset-crimson dark:bg-sunset-coral text-white dark:text-black text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-sunset-crimson/10 dark:bg-sunset-coral/15 text-sunset-crimson dark:text-sunset-coral border border-sunset-crimson/20 dark:border-sunset-coral/30"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-stone-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Agenda */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-black text-sunset-charcoal dark:text-white uppercase flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
                4. Schedule Timeline
              </h3>
              <button
                type="button"
                onClick={addAgendaItem}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark text-xs font-black uppercase text-sunset-crimson dark:text-sunset-coral border border-sunset-borderLight dark:border-sunset-borderDark transition-colors"
              >
                + Add Slot
              </button>
            </div>

            <div className="space-y-3">
              {(formData.agenda || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)}
                    placeholder="10:00 AM - 11:30 AM"
                    className="w-full sm:w-44 px-3 py-2 rounded-lg bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark text-xs text-sunset-charcoal dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.topic}
                    onChange={(e) => updateAgendaItem(idx, 'topic', e.target.value)}
                    placeholder="Topic description"
                    className="flex-1 w-full px-3 py-2 rounded-lg bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark text-xs text-sunset-charcoal dark:text-white"
                  />
                  <input
                    type="text"
                    value={item.speaker || ''}
                    onChange={(e) => updateAgendaItem(idx, 'speaker', e.target.value)}
                    placeholder="Speaker (Optional)"
                    className="w-full sm:w-36 px-3 py-2 rounded-lg bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark text-xs text-sunset-charcoal dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(idx)}
                    className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
                isValid && !isSubmitting
                  ? 'bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral hover:scale-[1.02] active:scale-95'
                  : 'bg-stone-200 text-stone-400 dark:bg-sunset-obsidian dark:text-slate-600 cursor-not-allowed border border-transparent'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Event...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Event Details' : 'Publish Campus Event'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
