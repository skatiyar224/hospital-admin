/**
 * Pagination.jsx
 * ------------------------------------------------------------------
 * Renders a compact page-number list with ellipses for large ranges.
 * Consumed with the `meta` object returned by list endpoints
 * ({ page, limit, totalPages, totalResults }).
 * ------------------------------------------------------------------
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function getPageList(current, total) {
  const pages = [];
  const windowSize = 1;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - windowSize && i <= current + windowSize)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const pages = getPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 flex items-center justify-center rounded-md border border-line disabled:opacity-40 hover:bg-paper"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1.5 text-ink-soft text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 px-2 rounded-md text-sm font-medium transition-colors',
              p === page ? 'bg-ink text-white' : 'hover:bg-paper text-ink'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-md border border-line disabled:opacity-40 hover:bg-paper"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
