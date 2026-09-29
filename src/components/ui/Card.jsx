/**
 * Card.jsx / Badge / Separator / Skeleton / Spinner / Avatar
 * ------------------------------------------------------------------
 * Small, composable presentational primitives. Borders over shadows
 * throughout, per the design system (see README).
 * ------------------------------------------------------------------
 */

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-lg border border-line bg-surface', className)} {...props} />;
}

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-ink/5 text-ink',
      brand: 'bg-brand-soft text-brand-dark',
      warm: 'bg-warm-soft text-warm',
      danger: 'bg-danger-soft text-danger',
      outline: 'border border-line text-ink-soft',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function Separator({ className, orientation = 'horizontal' }) {
  return (
    <div
      className={cn(
        'bg-line',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-ink/8', className)} />;
}

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-brand', className)} />;
}

export function Avatar({ src, name, className }) {
  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return <img src={src} alt={name} className={cn('h-9 w-9 rounded-full object-cover border border-line', className)} />;
  }

  return (
    <div
      className={cn(
        'h-9 w-9 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center text-xs font-semibold',
        className
      )}
    >
      {initials}
    </div>
  );
}
