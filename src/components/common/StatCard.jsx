import { Card } from '@/components/ui/Card';

export function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-ink-soft" />}
      </div>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </Card>
  );
}
