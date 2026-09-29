/**
 * DataTable.jsx - responsive table wrapper. `columns` = [{ header, cell(row) }].
 * Horizontally scrolls on small screens instead of breaking layout.
 */
import { Skeleton } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function DataTable({ columns, rows, isLoading, empty = 'Nothing to show yet.', rowKey = (r) => r._id }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-paper/70">
            <tr>{columns.map((c) => <th key={c.header} className={cn('px-4 py-3 text-xs font-medium text-ink-soft', c.className)}>{c.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{columns.map((c) => <td key={c.header} className="px-4 py-3.5"><Skeleton className="h-4 w-full max-w-[140px]" /></td>)}</tr>
                ))
              : rows?.map((row) => (
                  <tr key={rowKey(row)} className="hover:bg-paper/50">
                    {columns.map((c) => <td key={c.header} className={cn('px-4 py-3', c.className)}>{c.cell(row)}</td>)}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && (!rows || rows.length === 0) && <p className="px-4 py-12 text-center text-sm text-ink-soft">{empty}</p>}
    </div>
  );
}
