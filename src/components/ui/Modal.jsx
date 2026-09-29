/**
 * Modal.jsx / Sheet.jsx
 * ------------------------------------------------------------------
 * Hand-built, dependency-free modal + slide-over primitives (no
 * Radix) — portal-rendered, closes on backdrop click / Escape, traps
 * scroll on the body while open.
 * ------------------------------------------------------------------
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

function useEscapeKey(active, onClose) {
  useEffect(() => {
    if (!active) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onClose]);
}

export function Modal({ open, onClose, title, children, className }) {
  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full max-w-md rounded-lg border border-line bg-surface p-6 shadow-[0_20px_60px_rgba(20,23,28,0.18)] animate-hero-rise',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
          <button onClick={onClose} className="text-ink-soft hover:text-ink ml-auto" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

/** Slide-over panel from the right, used for the mini cart drawer. */
export function Sheet({ open, onClose, title, children, className }) {
  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn('fixed inset-0 z-50 transition-opacity', open ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!open}
    >
      <div
        className={cn('absolute inset-0 bg-ink/40 transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-md bg-surface border-l border-line flex flex-col',
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-line shrink-0">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
