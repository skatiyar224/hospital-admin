/**
 * AvailabilityEditor.jsx
 * ------------------------------------------------------------------
 * Editable list of recurring weekly time windows
 * ({ dayOfWeek, startTime, endTime, slotDurationMinutes }) — this is
 * exactly the shape the backend turns into bookable slots (see
 * hospital-backend/src/utils/slots.js). Not a full calendar grid,
 * just a plain list: admins add one row per clinic session
 * (e.g. "Mon 9:00–13:00" and "Mon 16:00–19:00" as two separate rows).
 *
 * Controlled component: value/onChange, so it plugs into
 * react-hook-form via a simple wrapper in the parent form.
 * ------------------------------------------------------------------
 */
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { DAY_NAMES } from '@/lib/dates';

const DURATIONS = [10, 15, 20, 30, 45, 60];

const emptyRow = () => ({ dayOfWeek: 1, startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30 });

export function AvailabilityEditor({ value = [], onChange }) {
  const updateRow = (index, patch) => onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const removeRow = (index) => onChange(value.filter((_, i) => i !== index));
  const addRow = () => onChange([...value, emptyRow()]);

  return (
    <div>
      {value.length === 0 && (
        <p className="mb-3 rounded-md border border-dashed border-line px-3 py-4 text-center text-sm text-ink-soft">
          No weekly schedule yet — this doctor won't have any bookable slots.
        </p>
      )}

      <div className="space-y-2.5">
        {value.map((row, index) => {
          const invalid = row.startTime && row.endTime && row.startTime >= row.endTime;
          return (
            <div key={index} className="rounded-md border border-line p-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center">
                <Select value={row.dayOfWeek} onChange={(e) => updateRow(index, { dayOfWeek: Number(e.target.value) })} className="w-full">
                  {DAY_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                </Select>
                <input
                  type="time"
                  value={row.startTime}
                  onChange={(e) => updateRow(index, { startTime: e.target.value })}
                  className="h-10 rounded-md border border-line bg-surface px-2.5 text-sm"
                  aria-label="Start time"
                />
                <span className="hidden text-ink-soft sm:block">to</span>
                <input
                  type="time"
                  value={row.endTime}
                  onChange={(e) => updateRow(index, { endTime: e.target.value })}
                  className="h-10 rounded-md border border-line bg-surface px-2.5 text-sm"
                  aria-label="End time"
                />
                <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                  <Select
                    value={row.slotDurationMinutes}
                    onChange={(e) => updateRow(index, { slotDurationMinutes: Number(e.target.value) })}
                    className="w-full"
                    aria-label="Slot length"
                  >
                    {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
                  </Select>
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove window" onClick={() => removeRow(index)}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
              {invalid && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
                  <AlertTriangle className="h-3.5 w-3.5" /> End time must be after start time
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addRow}>
        <Plus className="h-4 w-4" /> Add time window
      </Button>
    </div>
  );
}
