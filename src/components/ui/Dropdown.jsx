/**
 * Dropdown.jsx
 * ------------------------------------------------------------------
 * Minimal compound-component dropdown (trigger + menu), used for the
 * account menu and sort/filter pickers. Closes on outside click and
 * Escape. Not a full listbox/combobox implementation — for the
 * product-filter "Select" use-case we use a native <select> instead
 * (see Select.jsx) since it's more robust and fully accessible for
 * free.
 * ------------------------------------------------------------------
 */

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DropdownContext = createContext(null);

export function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children, asChild }) {
  const { open, setOpen } = useContext(DropdownContext);
  if (asChild) {
    return (
      <span onClick={() => setOpen(!open)} className="cursor-pointer inline-block">
        {children}
      </span>
    );
  }
  return (
    <button type="button" onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}

export function DropdownMenu({ children, align = 'right', className }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-40 mt-2 min-w-[12rem] rounded-md border border-line bg-surface py-1.5 shadow-[0_12px_32px_rgba(20,23,28,0.12)] animate-hero-rise',
        align === 'right' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick, className, danger }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        'w-full text-left px-3.5 py-2 text-sm hover:bg-paper transition-colors flex items-center gap-2',
        danger ? 'text-danger' : 'text-ink',
        className
      )}
    >
      {children}
    </button>
  );
}
