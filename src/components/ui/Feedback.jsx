/**
 * RatingStars.jsx / EmptyState / ErrorState
 * ------------------------------------------------------------------
 */

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({ rating = 0, count, size = 14, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      <div className="flex" role={interactive ? 'radiogroup' : undefined} aria-label="Rating">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={cn(!interactive && 'cursor-default')}
            aria-label={interactive ? `Rate ${star} stars` : undefined}
          >
            <Star
              size={size}
              className={cn(
                star <= Math.round(rating) ? 'fill-warm text-warm' : 'fill-transparent text-line',
                interactive && 'hover:scale-110 transition-transform'
              )}
            />
          </button>
        ))}
      </div>
      {count != null && <span className="text-xs text-ink-soft">({count})</span>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-brand-soft flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-brand-dark" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-soft mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="h-12 w-12 rounded-full bg-danger-soft flex items-center justify-center mb-4">
        <span className="text-danger font-display text-xl">!</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-soft mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
