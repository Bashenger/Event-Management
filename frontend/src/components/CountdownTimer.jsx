import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Flame } from 'lucide-react';

export const CountdownTimer = ({
  targetDate,
  endDate,
  compact = false,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate, endDate));

  function calculateTimeLeft(start, end) {
    if (!start) return { status: 'invalid' };

    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : startTime + 3 * 60 * 60 * 1000;

    if (isNaN(startTime)) return { status: 'invalid' };

    if (now > endTime) {
      return { status: 'ended' };
    }

    if (now >= startTime && now <= endTime) {
      return { status: 'live' };
    }

    const difference = startTime - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      status: 'upcoming',
      days,
      hours,
      minutes,
      seconds,
      totalMs: difference,
    };
  }

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate, endDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate, endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, endDate]);

  if (timeLeft.status === 'invalid') return null;

  if (timeLeft.status === 'ended') {
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark text-sunset-mutedLight dark:text-sunset-mutedDark text-xs font-bold uppercase tracking-wider ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-sunset-mutedLight dark:text-sunset-mutedDark" />
        Event Concluded
      </div>
    );
  }

  if (timeLeft.status === 'live') {
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-sunset-crimson dark:text-sunset-coral text-xs font-black uppercase tracking-wider animate-pulse ${className}`}>
        <Flame className="w-4 h-4 fill-sunset-crimson dark:fill-sunset-coral" />
        Happening Right Now!
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-sunset-obsidian/90 border border-sunset-borderLight dark:border-sunset-borderDark text-xs font-mono font-bold text-sunset-crimson dark:text-sunset-coral shadow-sm ${className}`}>
        <Clock className="w-3 h-3 text-sunset-tangerine dark:text-sunset-goldenTangerine" />
        <span>
          {days > 0 && `${days}d `}
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* Hours */}
      <div className="flex flex-col items-center">
        <span className="font-display text-2xl sm:text-3xl font-black text-sunset-charcoal dark:text-white leading-none">
          {String(days > 0 ? days * 24 + hours : hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold text-sunset-mutedLight dark:text-sunset-mutedDark uppercase tracking-widest mt-1">
          HOURS
        </span>
      </div>

      <span className="text-sunset-mutedLight/40 dark:text-sunset-mutedDark/40 font-bold text-xl -mt-4">:</span>

      {/* Minute */}
      <div className="flex flex-col items-center">
        <span className="font-display text-2xl sm:text-3xl font-black text-sunset-charcoal dark:text-white leading-none">
          {String(minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold text-sunset-mutedLight dark:text-sunset-mutedDark uppercase tracking-widest mt-1">
          MINUTE
        </span>
      </div>

      <span className="text-sunset-mutedLight/40 dark:text-sunset-mutedDark/40 font-bold text-xl -mt-4">:</span>

      {/* Second */}
      <div className="flex flex-col items-center">
        <span className="font-display text-2xl sm:text-3xl font-black text-sunset-crimson dark:text-sunset-coral leading-none">
          {String(seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold text-sunset-crimson dark:text-sunset-coral uppercase tracking-widest mt-1">
          SECOND
        </span>
      </div>
    </div>
  );
};
