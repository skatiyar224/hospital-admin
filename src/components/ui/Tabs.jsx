/**
 * Tabs.jsx
 * ------------------------------------------------------------------
 */

import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={cn('inline-flex items-center gap-1 border-b border-line', className)}>{children}</div>;
}

export function TabsTrigger({ value: tabValue, children, className }) {
  const { value, setValue } = useContext(TabsContext);
  const active = value === tabValue;
  return (
    <button
      type="button"
      onClick={() => setValue(tabValue)}
      className={cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
        active ? 'border-brand text-ink' : 'border-transparent text-ink-soft hover:text-ink',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: tabValue, children, className }) {
  const { value } = useContext(TabsContext);
  if (value !== tabValue) return null;
  return <div className={className}>{children}</div>;
}
