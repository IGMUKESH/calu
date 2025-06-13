import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  currentInput: string;
  result: string | null;
  isError: boolean;
}

export function CalculatorDisplay({ currentInput, result, isError }: CalculatorDisplayProps) {
  return (
    <div className={cn(
      "bg-muted/50 p-4 rounded-md text-right min-h-[7rem] flex flex-col justify-end shadow-inner",
      isError ? "ring-2 ring-destructive" : ""
    )}>
      <ScrollArea className="h-10">
        <div className="text-muted-foreground text-sm pr-1 break-all">
          {currentInput || (result === null || result.startsWith("Error") ? "" : "\u00A0")} 
        </div>
      </ScrollArea>
      <ScrollArea className="h-12">
        <div className={cn(
          "text-3xl font-bold break-all",
          isError ? "text-destructive" : "text-foreground",
          result === null && !currentInput ? "text-muted-foreground" : ""
        )}>
          {result !== null ? result : (currentInput || "0")}
        </div>
      </ScrollArea>
    </div>
  );
}
