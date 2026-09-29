/**
 * Input.jsx / Textarea / Label
 * ------------------------------------------------------------------
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-soft/60',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[90px] w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('block text-sm font-medium text-ink mb-1.5', className)} {...props} />
));
Label.displayName = 'Label';

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1.5 text-[13px] text-danger">{children}</p>;
}
