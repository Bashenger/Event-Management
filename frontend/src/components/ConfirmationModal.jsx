import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30';
      case 'warning':
        return 'bg-sunset-tangerine hover:bg-amber-400 text-black';
      default:
        return 'bg-sunset-crimson hover:bg-sunset-crimsonHover text-white dark:bg-sunset-coral dark:hover:bg-sunset-coralHover dark:text-black';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark p-6 sm:p-8 shadow-2xl space-y-5 animate-slide-down"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-black text-sunset-charcoal dark:text-white uppercase leading-snug">{title}</h3>
              <p className="text-xs text-sunset-mutedLight dark:text-sunset-mutedDark">Please review before continuing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-sunset-mutedLight hover:text-sunset-charcoal dark:text-sunset-mutedDark dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-sunset-mutedLight dark:text-slate-300 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark hover:bg-black/5 dark:hover:bg-white/10 border border-sunset-borderLight dark:border-sunset-borderDark transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 ${getButtonStyles()}`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
