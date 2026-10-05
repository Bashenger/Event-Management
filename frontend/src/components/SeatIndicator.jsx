import React from 'react';
import { Users, AlertCircle } from 'lucide-react';

export const SeatIndicator = ({
  availableSeats = 0,
  maxParticipants = 50,
  showLabel = true,
  compact = false,
  className = '',
}) => {
  const max = Math.max(1, Number(maxParticipants) || 1);
  const available = Math.max(0, Number(availableSeats) || 0);
  const filled = Math.max(0, max - available);
  const fillPercentage = Math.min(100, Math.round((filled / max) * 100));
  const remainingPercentage = 100 - fillPercentage;

  let progressColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30';
  let statusText = `${available} seats left`;

  if (available === 0) {
    progressColor = 'bg-sunset-crimson dark:bg-sunset-coral';
    badgeColor = 'text-sunset-crimson bg-rose-50 border-rose-200 dark:text-sunset-coral dark:bg-sunset-coral/15 dark:border-sunset-coral/30';
    statusText = 'Sold Out';
  } else if (remainingPercentage <= 20) {
    progressColor = 'bg-sunset-tangerine dark:bg-sunset-goldenTangerine';
    badgeColor = 'text-amber-800 bg-amber-50 border-amber-200 dark:text-sunset-goldenTangerine dark:bg-sunset-goldenTangerine/15 dark:border-sunset-goldenTangerine/30';
    statusText = `Only ${available} left!`;
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-16 h-1.5 bg-stone-200 dark:bg-sunset-slateDark rounded-full overflow-hidden border border-sunset-borderLight dark:border-sunset-borderDark">
          <div
            className={`h-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {statusText}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-sunset-mutedLight dark:text-sunset-mutedDark flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
            <Users className="w-3.5 h-3.5 text-sunset-mutedLight dark:text-sunset-mutedDark" />
            Capacity: <span className="text-sunset-charcoal dark:text-white font-mono font-bold">{filled}/{max}</span>
          </span>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${badgeColor} flex items-center gap-1`}>
            {remainingPercentage <= 20 && available > 0 && (
              <AlertCircle className="w-3 h-3 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
            )}
            {statusText} ({fillPercentage}%)
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-2 bg-stone-200 dark:bg-sunset-slateDark rounded-full overflow-hidden p-0.5 border border-sunset-borderLight dark:border-sunset-borderDark">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
};
