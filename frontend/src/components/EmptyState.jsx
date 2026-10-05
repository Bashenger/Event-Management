import React from 'react';
import { CalendarX2, RotateCcw, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No Events Found',
  description = 'We could not find any events matching your active search terms or category filters.',
  actionText = 'Reset All Filters',
  onAction,
  showCreateButton = false,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto animate-fade-in shadow-sm">
      <div className="w-16 h-16 rounded-3xl bg-stone-100 dark:bg-sunset-obsidian border border-sunset-borderLight dark:border-sunset-borderDark flex items-center justify-center text-sunset-crimson dark:text-sunset-coral">
        <CalendarX2 className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-xl font-black text-sunset-charcoal dark:text-white uppercase">{title}</h3>
        <p className="text-sm text-sunset-mutedLight dark:text-sunset-mutedDark max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2 flex-wrap justify-center">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}

        {showCreateButton && (
          <Link
            to="/create-event"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-stone-100 hover:bg-stone-200 dark:bg-sunset-obsidian dark:hover:bg-sunset-borderDark text-sunset-charcoal dark:text-white border border-sunset-borderLight dark:border-sunset-borderDark transition-all"
          >
            <PlusCircle className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
            <span>Create New Event</span>
          </Link>
        )}
      </div>
    </div>
  );
};
