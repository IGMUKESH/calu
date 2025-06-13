import type { AngleUnit } from '@/types';

// Enhanced list of allowed Math properties and methods
const ALLOWED_MATH_PROPS = new Set([
  'PI', 'E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT1_2', 'SQRT2',
  'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2',
  'cbrt', 'ceil', 'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor',
  'fround', 'hypot', 'imul', 'log', 'log1p', 'log10', 'log2', 'max',
  'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt',
  'tan', 'tanh', 'trunc'
]);

function factorial(num: number): number {
  if (num < 0) return NaN; // Factorial is not defined for negative numbers
  if (num === 0) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}
(globalThis as any).Math.factorial = factorial;
ALLOWED_MATH_PROPS.add('factorial');


export function safeEvaluate(expression: string, angleUnit: AngleUnit = 'rad'): number | string {
  if (!expression) return '';

  let sanitizedExpression = expression;

  // Replace constants
  sanitizedExpression = sanitizedExpression.replace(/π/g, 'Math.PI');
  sanitizedExpression = sanitizedExpression.replace(/e(?!xp)/g, 'Math.E'); // e, but not in 'exp'

  // Replace functions with Math. equivalents and handle angle units
  const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
  trigFunctions.forEach(func => {
    const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
    sanitizedExpression = sanitizedExpression.replace(regex, (match, val) => {
      const isInverse = func.startsWith('a');
      if (angleUnit === 'deg') {
        if (isInverse) {
          // Convert result from radians to degrees
          return `(Math.${func}(${val}) * 180 / Math.PI)`;
        } else {
          // Convert argument from degrees to radians
          return `Math.${func}((${val}) * Math.PI / 180)`;
        }
      }
      return `Math.${func}(${val})`;
    });
  });
  
  // Other functions
  sanitizedExpression = sanitizedExpression.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
  sanitizedExpression = sanitizedExpression.replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)');
  sanitizedExpression = sanitizedExpression.replace(/log\(([^)]+)\)/g, 'Math.log10($1)'); // log is log10
  sanitizedExpression = sanitizedExpression.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');   // ln is natural log
  sanitizedExpression = sanitizedExpression.replace(/(\d+)!/g, 'Math.factorial($1)');


  // Power: x^y -> Math.pow(x,y) or x**y. Modern JS supports **
  sanitizedExpression = sanitizedExpression.replace(/\^/g, '**');
  
  // Percentage: x% -> x/100
  // This needs to be context-aware. A simple replace might be problematic.
  // Example: 10+5% should be 10 + (10 * 0.05) or 10 + 0.05.
  // For simplicity, treat standalone X% as X/100.
  // A more robust solution would involve parsing, but for now:
  // Match a number followed by % that is not part of another word
   sanitizedExpression = sanitizedExpression.replace(/(\d*\.?\d+)%/g, '($1/100)');


  // Validate the expression to prevent malicious code
  // This regex allows numbers, operators, parentheses, Math.property, and commas within functions
  const validationRegex = /^[0-9\s().+\-*/%MathELNPISQRTABCFHLOGacegiknoprstuvwxyz_!]+$/;

  if (!validationRegex.test(sanitizedExpression)) {
    console.error("Invalid characters in expression:", sanitizedExpression);
    return 'Error: Invalid Input';
  }

  // Further check that any textual parts are 'Math.something'
  const textParts = sanitizedExpression.match(/[a-zA-Z_]+/g) || [];
  for (const part of textParts) {
    if (part !== 'Math' && !ALLOWED_MATH_PROPS.has(part)) {
      console.error("Disallowed part:", part);
      return 'Error: Invalid Function';
    }
  }
  

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + sanitizedExpression)();
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return 'Error: Calculation Failed';
    }
    // Limit precision for display
    return parseFloat(result.toPrecision(12));
  } catch (error) {
    console.error("Evaluation error:", error);
    return 'Error';
  }
}
