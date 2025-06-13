export interface CalculationHistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export type AngleUnit = 'deg' | 'rad';

export type MemoryOperation = 'M+' | 'M-' | 'MR' | 'MC';

export type CalculatorAction = 
  | 'digit' | 'operator' | 'decimal' | 'equals' | 'clear' | 'backspace' 
  | 'parenthesis' | 'toggleSign' | 'function' | 'constant' | 'loadHistory'
  | 'memory';
