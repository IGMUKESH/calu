
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronsUp, DivideSquare, Sigma, Pilcrow, Percent, Pi, Variable } from "lucide-react";

interface AdvancedFunctionButton {
  label: string;
  type: 'function' | 'constant' | 'operator';
  value: string;
  icon?: React.ElementType;
  title?: string;
}

const functionCategories: { title: string; icon?: React.ElementType; buttons: AdvancedFunctionButton[] }[] = [
  {
    title: "Trigonometry",
    icon: Sigma,
    buttons: [
      { label: "sin", type: "function", value: "sin", title: "Sine" }, { label: "cos", type: "function", value: "cos", title: "Cosine" }, { label: "tan", type: "function", value: "tan", title: "Tangent" },
      { label: "asin", type: "function", value: "asin", title: "Arcsine" }, { label: "acos", type: "function", value: "acos", title: "Arccosine" }, { label: "atan", type: "function", value: "atan", title: "Arctangent" },
      { label: "sinh", type: "function", value: "sinh", title: "Hyperbolic Sine" }, { label: "cosh", type: "function", value: "cosh", title: "Hyperbolic Cosine" }, { label: "tanh", type: "function", value: "tanh", title: "Hyperbolic Tangent" },
    ],
  },
  {
    title: "Powers & Roots",
    icon: ChevronUp,
    buttons: [
      { label: "xʸ", type: "operator", value: "^", title: "Power" , icon: ChevronsUp},
      { label: "x²", type: "operator", value: "^2", title: "Square" },
      { label: "x³", type: "operator", value: "^3", title: "Cube" },
      { label: "√x", type: "function", value: "sqrt", title: "Square Root" },
      { label: "³√x", type: "function", value: "cbrt", title: "Cube Root" },
      { label: "¹⁰√x", type: "operator", value: "^(1/10)", title: "Tenth Root"},
    ],
  },
  {
    title: "Logarithms & Exponentials",
    icon: Variable,
    buttons: [
      { label: "log", type: "function", value: "log", title: "Logarithm (base 10)" },
      { label: "ln", type: "function", value: "ln", title: "Natural Logarithm" },
      { label: "eˣ", type: "function", value: "exp", title: "Exponential (e^x)" },
      { label: "10ˣ", type: "operator", value: "10^", title: "10 to the power of x" },
      { label: "2ˣ", type: "operator", value: "2^", title: "2 to the power of x" },
    ],
  },
  {
    title: "Constants & Other",
    icon: Pilcrow,
    buttons: [
      { label: "π", type: "constant", value: "π", title: "Pi" , icon: Pi},
      { label: "e", type: "constant", value: "e", title: "Euler's Number" },
      { label: "1/x", type: "operator", value: "1/", title: "Reciprocal", icon: DivideSquare },
      { label: "%", type: "operator", value: "%", title: "Percentage", icon: Percent },
      { label: "n!", type: "operator", value: "!", title: "Factorial" },
    ],
  },
];

interface AdvancedFunctionsAccordionItemsProps {
  onButtonClick: (type: string, value: string) => void;
}

export function AdvancedFunctionsAccordionItems({ onButtonClick }: AdvancedFunctionsAccordionItemsProps) {
  return (
    <>
      {functionCategories.map((category, catIndex) => (
        <AccordionItem value={`item-advanced-${catIndex}`} key={category.title}>
          <AccordionTrigger className="text-sm hover:no-underline">
            <div className="flex items-center gap-2">
              {category.icon && <category.icon className="h-4 w-4 text-primary" />}
              {category.title}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-1 p-1">
              {category.buttons.map((btn) => (
                <Button
                  key={btn.label}
                  variant="outline"
                  size="sm"
                  className="h-10 text-sm flex-col items-center justify-center"
                  onClick={() => onButtonClick(btn.type, btn.value)}
                  title={btn.title || btn.label}
                >
                  {btn.icon && <btn.icon className="h-4 w-4 mb-0.5" />}
                  <span>{btn.label}</span>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}
