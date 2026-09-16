import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onStay: () => void;
  onExit: () => void;
  language: Language;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onStay,
  onExit,
  language,
}) => {
  const t = translations[language];

  // Close with Escape key (treated as staying)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onStay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="exit-confirm-modal-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onStay}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm rounded-2xl bg-[#14141E] border border-[#2D2D3E] shadow-2xl overflow-hidden p-6 text-center"
          >
            {/* Subtle Gold Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

            {/* Close 'X' button (stays in store) */}
            <button
              id="exit-modal-close-btn"
              onClick={onStay}
              aria-label={t.close}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#1C1C29] border border-[#2A2A3B] text-[#A6A29A] hover:text-[#F4F1EA] hover:bg-[#252538] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Header */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#1E1E2D] border border-[#D4AF37]/30 flex items-center justify-center mb-4 text-[#D4AF37] shadow-inner">
              <LogOut className="w-7 h-7 -translate-x-0.5" />
            </div>

            {/* Title */}
            <h3
              id="exit-modal-title"
              className="font-serif text-xl font-bold text-[#F4F1EA] tracking-wide mb-2"
            >
              {t.exitConfirmTitle}
            </h3>

            {/* Description */}
            <p className="text-sm text-[#A6A29A] leading-relaxed mb-6 px-1">
              {t.exitConfirmMessage}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
              {/* "Да, выйти" (Exit) */}
              <button
                id="exit-modal-btn-exit"
                type="button"
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-xl border border-[#2D2D3E] bg-[#1A1A26] hover:bg-[#262638] text-xs font-semibold text-[#8E8A82] hover:text-[#FC8181] transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.exitConfirmYes}</span>
              </button>

              {/* "Нет, остаться" (Stay - Primary CTA) */}
              <button
                id="exit-modal-btn-stay"
                type="button"
                onClick={onStay}
                autoFocus
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#AA820A] text-[#0B0B0E] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.exitConfirmNo}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
