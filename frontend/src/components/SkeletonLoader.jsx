import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden animate-pulse flex flex-col justify-between h-[420px]">
      <div className="h-48 bg-slate-800/80 w-full" />
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-800 rounded-md w-3/4" />
          <div className="h-3 bg-slate-800/60 rounded-md w-1/2" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-3 bg-slate-800/50 rounded-md" />
            <div className="h-3 bg-slate-800/50 rounded-md" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-2 bg-slate-800 rounded-full w-full" />
          <div className="h-9 bg-slate-800/70 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
