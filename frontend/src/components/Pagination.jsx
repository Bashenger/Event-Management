import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNext = false,
  hasPrev = false,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 pt-6 ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white dark:bg-sunset-slateDark hover:bg-stone-100 dark:hover:bg-sunset-borderDark text-sunset-charcoal dark:text-white border border-sunset-borderLight dark:border-sunset-borderDark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-sunset-mutedLight dark:text-sunset-mutedDark text-xs font-mono">
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                isCurrent
                  ? 'bg-sunset-crimson text-white dark:bg-sunset-coral dark:text-black shadow-sunset-crimson dark:shadow-sunset-coral scale-105'
                  : 'bg-white dark:bg-sunset-slateDark hover:bg-stone-100 dark:hover:bg-sunset-borderDark text-sunset-charcoal dark:text-white border border-sunset-borderLight dark:border-sunset-borderDark shadow-sm'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white dark:bg-sunset-slateDark hover:bg-stone-100 dark:hover:bg-sunset-borderDark text-sunset-charcoal dark:text-white border border-sunset-borderLight dark:border-sunset-borderDark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
