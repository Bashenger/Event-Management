import React from 'react';

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Registration Open':
      case 'Open':
      case 'ADMISSIONS OPEN':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15',
          dot: 'bg-emerald-500 shadow-sm',
          label: 'ADMISSIONS OPEN',
        };

      case 'Filling Fast':
      case 'LAST FEW SEATS':
        return {
          bg: 'bg-sunset-tangerine/15 border-sunset-tangerine/40 text-amber-800 dark:text-sunset-goldenTangerine dark:bg-sunset-goldenTangerine/15',
          dot: 'bg-sunset-tangerine animate-pulse shadow-sm',
          label: 'LAST FEW SEATS',
        };

      case 'Registration Closed':
      case 'Full':
      case 'Closed':
      case 'MAX CAPACITY REACHED':
        return {
          bg: 'bg-sunset-crimson/10 border-sunset-crimson/30 text-sunset-crimson dark:text-sunset-coral dark:bg-sunset-coral/15 dark:border-sunset-coral/30',
          dot: 'bg-sunset-crimson dark:bg-sunset-coral',
          label: 'MAX CAPACITY REACHED',
        };

      case 'Draft':
        return {
          bg: 'bg-stone-500/10 border-stone-500/30 text-stone-600 dark:text-stone-400',
          dot: 'bg-stone-400',
          label: 'DRAFT',
        };

      case 'Published':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
          dot: 'bg-sky-400',
          label: 'PUBLISHED',
        };

      case 'Completed':
      case 'Past':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
          dot: 'bg-purple-500',
          label: 'CONCLUDED',
        };

      case 'Registered':
      case 'Confirmed':
      case 'ENROLLED':
        return {
          bg: 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black border-transparent shadow-sm',
          dot: 'bg-white dark:bg-black',
          label: 'ENROLLED',
        };

      case 'Cancelled':
        return {
          bg: 'bg-stone-400/10 border-stone-400/30 text-stone-500 dark:text-stone-400',
          dot: 'bg-stone-400',
          label: 'CANCELLED',
        };

      default:
        return {
          bg: 'bg-stone-500/10 border-stone-500/20 text-stone-600 dark:text-stone-300',
          dot: 'bg-stone-400',
          label: status || 'UNKNOWN',
        };
    }
  };

  const config = getBadgeStyle();
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs'
      : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-wider border backdrop-blur-sm transition-colors duration-200 ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
