/**
 * Button.jsx
 * ------------------------------------------------------------------
 * shadcn-style variant API (variant + size props) built on
 * class-variance-authority, so usage matches the shadcn ecosystem's
 * conventions if you later add more primitives via the shadcn CLI.
 * ------------------------------------------------------------------
 */

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-ink text-white hover:bg-ink/90',
        primary: 'bg-brand text-white hover:bg-brand-dark',
        outline: 'border border-line bg-transparent hover:bg-surface text-ink',
        ghost: 'bg-transparent hover:bg-black/5 text-ink',
        danger: 'bg-danger text-white hover:bg-danger/90',
        link: 'text-brand underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 text-[13px]',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export const Button = forwardRef(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
