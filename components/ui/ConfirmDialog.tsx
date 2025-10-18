'use client';

import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  variant = 'warning'
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30',
      iconBg: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: AlertCircle
    },
    warning: {
      button: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg shadow-orange-500/30',
      iconBg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      icon: AlertTriangle
    },
    info: {
      button: 'bg-gradient-to-r from-[#7a9b88] to-[#6a8b78] hover:from-[#6a8b78] hover:to-[#5a7b68] shadow-lg shadow-[#7a9b88]/30',
      iconBg: 'bg-gradient-to-br from-[#7a9b88]/20 to-[#6a8b78]/20',
      iconColor: 'text-[#7a9b88] dark:text-[#8faf9d]',
      icon: Info
    }
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-gray-50 dark:from-[#2a2520] dark:to-[#1f1b17] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-[#e89a7a]/20 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`${style.iconBg} ${style.iconColor} p-4 rounded-2xl backdrop-blur-sm border border-current/20 shadow-xl`}>
            <Icon className="w-12 h-12 animate-in zoom-in duration-500" strokeWidth={2.5} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-3">
            {title}
          </h3>
          <p className="text-[#6b635a] dark:text-[#b8aea5] leading-relaxed text-base">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-xl bg-white dark:bg-[#1a1714] text-[#2a2520] dark:text-[#f5f1ed] hover:bg-gray-50 dark:hover:bg-[#2a2520] transition-all font-semibold border-2 border-gray-200 dark:border-[#3a3530] hover:border-gray-300 dark:hover:border-[#4a4540] active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3.5 rounded-xl text-white transition-all font-semibold active:scale-95 ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
