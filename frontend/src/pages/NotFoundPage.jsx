import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
        <Calendar className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-400">404 Error</span>
        <h1 className="text-4xl font-black text-white">Page Not Found</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The campus event or page you requested could not be located. It might have been moved or removed.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/events"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-900/40 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Events Catalog</span>
        </Link>
      </div>
    </div>
  );
};
