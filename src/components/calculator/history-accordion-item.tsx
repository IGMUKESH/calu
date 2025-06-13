import type { CalculationHistoryEntry } from '@/types';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistoryAccordionItemProps {
  history: CalculationHistoryEntry[];
  onHistoryClick: (item: CalculationHistoryEntry) => void;
}

export function HistoryAccordionItem({ history, onHistoryClick }: HistoryAccordionItemProps) {
  return (
    <AccordionItem value="item-history">
      <AccordionTrigger className="text-sm hover:no-underline">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Calculation History
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm p-2 text-center">No history yet.</p>
        ) : (
          <ScrollArea className="h-40">
            <ul className="space-y-2 p-1">
              {history.map((item) => (
                <li key={item.id} className="text-xs p-2 rounded-md hover:bg-muted/50 flex justify-between items-center group">
                  <div>
                    <div className="text-muted-foreground break-all">{item.expression} =</div>
                    <div className="font-semibold break-all">{item.result}</div>
                    <div className="text-muted-foreground/80 text-[0.65rem]">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onHistoryClick(item)}
                    title="Load this calculation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
