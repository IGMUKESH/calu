import type { MemoryOperation } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MemoryFunctionsPanelProps {
  onMemoryOp: (operation: MemoryOperation) => void;
  memoryValue: number | null;
}

const memoryButtons: { label: string; op: MemoryOperation }[] = [
  { label: 'MC', op: 'MC' },
  { label: 'MR', op: 'MR' },
  { label: 'M+', op: 'M+' },
  { label: 'M-', op: 'M-' },
];

export function MemoryFunctionsPanel({ onMemoryOp, memoryValue }: MemoryFunctionsPanelProps) {
  const hasMemory = memoryValue !== null && memoryValue !== 0;
  return (
    <div className="grid grid-cols-5 gap-1 items-center">
      <div className={cn(
          "col-span-1 text-xs text-center font-mono p-1 rounded bg-muted/50",
          hasMemory ? "text-primary font-bold" : "text-muted-foreground"
        )}>
        M:{hasMemory ? memoryValue?.toPrecision(3) : "_"}
      </div>
      {memoryButtons.map(({ label, op }) => (
        <Button
          key={op}
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => onMemoryOp(op)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
