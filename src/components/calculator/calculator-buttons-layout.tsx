import { Button } from '@/components/ui/button';
import { Delete, CornerDownLeft } from 'lucide-react';

interface CalculatorButtonsLayoutProps {
  onButtonClick: (type: string, value: string) => void;
}

const mainButtonConfig = [
  // Row 1
  { label: 'C', type: 'clear', value: 'C', className: "bg-destructive/80 hover:bg-destructive text-destructive-foreground" },
  { label: '(', type: 'parenthesis', value: '(' },
  { label: ')', type: 'parenthesis', value: ')' },
  { icon: Delete, type: 'backspace', value: 'Del', ariaLabel: 'Backspace' },
  // Row 2
  { label: '7', type: 'digit', value: '7' },
  { label: '8', type: 'digit', value: '8' },
  { label: '9', type: 'digit', value: '9' },
  { label: '÷', type: 'operator', value: '/' },
  // Row 3
  { label: '4', type: 'digit', value: '4' },
  { label: '5', type: 'digit', value: '5' },
  { label: '6', type: 'digit', value: '6' },
  { label: '×', type: 'operator', value: '*' },
  // Row 4
  { label: '1', type: 'digit', value: '1' },
  { label: '2', type: 'digit', value: '2' },
  { label: '3', type: 'digit', value: '3' },
  { label: '−', type: 'operator', value: '-' },
  // Row 5
  { label: '0', type: 'digit', value: '0', className: "col-span-1" }, // Default: col-span-2 if no +/-
  { label: '.', type: 'decimal', value: '.' },
  { label: '±', type: 'toggleSign', value: '+/-' },
  { label: '+', type: 'operator', value: '+' },
];

export function CalculatorButtonsLayout({ onButtonClick }: CalculatorButtonsLayoutProps) {
  return (
    <div className="space-y-1">
        <div className="grid grid-cols-4 gap-1">
            {mainButtonConfig.map((btn) => (
            <Button
                key={btn.label || btn.ariaLabel}
                variant={['clear', 'operator', 'parenthesis', 'backspace', 'toggleSign', 'decimal'].includes(btn.type) ? "secondary" : "default"}
                className={`h-12 text-xl ${btn.className || ''} ${btn.type === 'digit' ? 'bg-card hover:bg-muted/80 border-primary/20 border text-foreground' : ''} ${btn.type === 'operator' ? 'bg-primary/20 hover:bg-primary/30 text-primary' : ''}`}
                onClick={() => onButtonClick(btn.type, btn.value)}
                aria-label={btn.ariaLabel || btn.label}
            >
                {btn.icon ? <btn.icon className="h-5 w-5" /> : btn.label}
            </Button>
            ))}
        </div>
        <Button
            variant="default"
            className="w-full h-14 text-2xl bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => onButtonClick('equals', '=')}
        >
            =
        </Button>
    </div>
  );
}
