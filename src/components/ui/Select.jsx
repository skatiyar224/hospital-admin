/**
 * Select.jsx
 * ------------------------------------------------------------------
 * A styled wrapper over the native <select> — fully accessible and
 * keyboard-operable for free, which matters more here than a custom
 * listbox given how central sort/filter controls are to Explore/Search.
 * ------------------------------------------------------------------
 */

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }) {
  return (
    <div className="relative inline-block">
      <select
        className={cn(
          'h-10 appearance-none rounded-md border border-line bg-surface pl-3 pr-9 text-sm text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
    </div>
  );
}
