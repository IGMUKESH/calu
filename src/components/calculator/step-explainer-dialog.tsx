import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface StepExplainerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expression: string;
  explanation: string | null;
  isLoading: boolean;
}

export function StepExplainerDialog({
  isOpen,
  onClose,
  expression,
  explanation,
  isLoading,
}: StepExplainerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Calculation Steps</DialogTitle>
          <DialogDescription>
            AI-powered explanation for: <span className="font-mono font-semibold">{expression}</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Generating explanation...</p>
            </div>
          )}
          {explanation && !isLoading && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap py-2" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
