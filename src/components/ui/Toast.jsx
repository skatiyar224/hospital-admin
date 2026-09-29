/**
 * Toast.jsx
 * ------------------------------------------------------------------
 * A minimal, dependency-free toast system:
 *   - `toast.success(msg)` / `toast.error(msg)` / `toast.info(msg)`
 *     can be called from ANYWHERE (hooks, api layer, components) —
 *     not just inside React components — via a tiny module-level
 *     event emitter.
 *   - <Toaster /> is mounted once near the root (see App.jsx) and
 *     renders whatever toasts are currently active via a portal.
 * ------------------------------------------------------------------
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const listeners = new Set();
let idCounter = 0;

function emit(toastData) {
  const id = ++idCounter;
  listeners.forEach((listener) => listener({ id, ...toastData }));
  return id;
}

export const toast = {
  success: (message) => emit({ type: 'success', message }),
  error: (message) => emit({ type: 'error', message }),
  info: (message) => emit({ type: 'info', message }),
};

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />,
  error: <XCircle className="h-5 w-5 text-danger shrink-0" />,
  info: <Info className="h-5 w-5 text-ink-soft shrink-0" />,
};

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (toastData) => {
      setToasts((prev) => [...prev, toastData]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastData.id));
      }, 4000);
    };
    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'flex items-start gap-2.5 rounded-lg border border-line bg-surface px-4 py-3 shadow-[0_8px_24px_rgba(20,23,28,0.08)]',
            'animate-hero-rise'
          )}
        >
          {ICONS[t.type]}
          <p className="text-sm text-ink flex-1">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="text-ink-soft hover:text-ink" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

/* Optional context form, kept for parity if a future screen needs to
   read active toasts directly rather than just firing them. */
const ToastContext = createContext(null);
export function useToast() {
  return useContext(ToastContext) || toast;
}
