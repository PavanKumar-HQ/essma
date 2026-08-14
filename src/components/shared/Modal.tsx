import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, width = 'max-w-md' }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`glass-panel w-full ${width} max-h-[90vh] overflow-hidden flex flex-col mx-4 shadow-2xl animate-slide-up border-[var(--color-border-strong)]`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/50">
          <h2 className="text-lg font-heading font-bold text-white tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto font-sans bg-[var(--color-surface-panel)]/80 text-[var(--color-text-main)] scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}
