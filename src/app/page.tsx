// src/app/page.tsx
"use client";

import { CalculatorDisplay } from '@/components/calculator/calculator-display';
import { AngleUnitSwitcher } from '@/components/calculator/angle-unit-switcher';
import { MemoryFunctionsPanel } from '@/components/calculator/memory-functions-panel';
import { CalculatorButtonsLayout } from '@/components/calculator/calculator-buttons-layout';
import { AdvancedFunctionsAccordionItems } from '@/components/calculator/advanced-functions-accordion-items';
import { HistoryAccordionItem } from '@/components/calculator/history-accordion-item';
import { StepExplainerDialog } from '@/components/calculator/step-explainer-dialog';
import { useCalculator } from '@/hooks/use-calculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

export default function PrimeCalcPage() {
  const {
    currentDisplay,
    result,
    history,
    memoryValue,
    angleUnit,
    isError,
    handleButtonClick,
    handleMemoryOperation,
    setAngleUnit,
    getExplanation,
    aiExplanation,
    isAiLoading,
    showAiModal,
    clearAiExplanation,
    expressionForAI
  } = useCalculator();

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-2 sm:p-4 font-body pt-8 sm:pt-12">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-headline text-center text-primary">PrimeCalc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CalculatorDisplay currentInput={currentDisplay} result={result} isError={isError} />
          
          <div className="flex justify-between items-center space-x-2">
            <AngleUnitSwitcher currentUnit={angleUnit} onUnitChange={setAngleUnit} />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={getExplanation} 
              disabled={isAiLoading || !currentDisplay.trim()} 
              aria-label="Explain calculation steps"
              className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <BrainCircuit className="h-5 w-5" />
            </Button>
          </div>
          
          <MemoryFunctionsPanel onMemoryOp={handleMemoryOperation} memoryValue={memoryValue} />
          
          <CalculatorButtonsLayout onButtonClick={handleButtonClick} />
          
          <Accordion type="multiple" className="w-full">
            <AdvancedFunctionsAccordionItems onButtonClick={handleButtonClick} />
            <HistoryAccordionItem history={history} onHistoryClick={(item) => handleButtonClick('loadHistory', item.expression)} />
          </Accordion>
        </CardContent>
      </Card>
      
      <StepExplainerDialog 
        isOpen={showAiModal} 
        onClose={clearAiExplanation} 
        explanation={aiExplanation} 
        isLoading={isAiLoading} 
        expression={expressionForAI}
      />
    </main>
  );
}
