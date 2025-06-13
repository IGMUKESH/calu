// src/hooks/use-calculator.ts
"use client";

import { useState, useCallback, useEffect } from 'react';
import type { AngleUnit, CalculationHistoryEntry, MemoryOperation } from '@/types';
import { safeEvaluate } from '@/lib/safe-evaluate';
import { explainCalculationSteps } from '@/ai/flows/explain-calculation-steps';
import { useToast } from "@/components/ui/use-toast";

const MAX_HISTORY_LENGTH = 20;

export function useCalculator() {
  const [currentDisplay, setCurrentDisplay] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistoryEntry[]>([]);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [isError, setIsError] = useState<boolean>(false);
  const [openParenthesesCount, setOpenParenthesesCount] = useState<number>(0);

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [expressionForAI, setExpressionForAI] = useState<string>('');

  const { toast } = useToast();

  // Load state from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('calc_history');
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    const storedMemory = localStorage.getItem('calc_memory');
    if (storedMemory) setMemoryValue(parseFloat(storedMemory));
    const storedAngleUnit = localStorage.getItem('calc_angle_unit') as AngleUnit;
    if (storedAngleUnit) setAngleUnit(storedAngleUnit);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem('calc_memory', memoryValue.toString());
  }, [memoryValue]);
  useEffect(() => {
    localStorage.setItem('calc_angle_unit', angleUnit);
  }, [angleUnit]);


  const resetError = () => {
    if (isError) {
      setIsError(false);
    }
  };

  const addToDisplay = (value: string) => {
    resetError();
    if (result !== null && !['+', '-', '*', '/', '^', '%'].includes(value) && !currentDisplay.endsWith('(')) {
      // If result is shown and user types a number, start new calculation
      // unless it's an operator or continues an open parenthesis
      setCurrentDisplay(value);
      setResult(null);
    } else {
       if (result !== null && ['+', '-', '*', '/', '^', '%'].includes(value)) {
        setCurrentDisplay(result + value);
        setResult(null);
      } else {
        setCurrentDisplay(prev => prev + value);
      }
    }
  };

  const handleEvaluate = useCallback(() => {
    if (!currentDisplay.trim() || isError) return;
    if (openParenthesesCount > 0) {
      toast({ title: "Error", description: "Unclosed parentheses.", variant: "destructive" });
      setIsError(true);
      return;
    }

    const evaluation = safeEvaluate(currentDisplay, angleUnit);
    if (typeof evaluation === 'string' && evaluation.startsWith('Error')) {
      setResult(evaluation);
      setIsError(true);
      toast({ title: "Calculation Error", description: evaluation, variant: "destructive" });
    } else {
      const resStr = evaluation.toString();
      setResult(resStr);
      const newHistoryEntry: CalculationHistoryEntry = {
        id: Date.now().toString(),
        expression: currentDisplay,
        result: resStr,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryEntry, ...prev.slice(0, MAX_HISTORY_LENGTH - 1)]);
      setIsError(false);
    }
  }, [currentDisplay, angleUnit, openParenthesesCount, toast, isError]);


  const handleButtonClick = (type: string, value: string) => {
    resetError();
    
    switch (type) {
      case 'digit':
        addToDisplay(value);
        break;
      case 'operator':
        if (currentDisplay.length === 0 && value !== '-') { // Allow starting with negative
             // if result is present, use it as the first operand
            if (result !== null && result !== "Error") {
                setCurrentDisplay(result + value);
                setResult(null); // Clear result after using it
                return;
            }
            return; // Don't add operator if display is empty (unless it's minus)
        }
        // Avoid multiple operators, but allow negative numbers e.g. 5*-2
        const lastChar = currentDisplay.slice(-1);
        if (['+', '*', '/', '^', '%'].includes(lastChar) && value !== '-') {
             // Replace last operator
            setCurrentDisplay(currentDisplay.slice(0, -1) + value);
        } else if (lastChar === '-' && currentDisplay.length > 1 && ['+', '*', '/', '^', '%'].includes(currentDisplay.slice(-2, -1)) && value !== '-') {
            //Handles cases like 5*- and user presses + -> 5*+ is invalid, should be 5*
             setCurrentDisplay(currentDisplay.slice(0, -2) + value);
        }
        else {
            addToDisplay(value);
        }
        break;
      case 'decimal':
        // Prevent multiple decimals in one number segment
        const segments = currentDisplay.split(/[\+\-\*\/\(\)\^\%]/);
        if (!segments[segments.length - 1].includes('.')) {
          addToDisplay('.');
        }
        break;
      case 'equals':
        handleEvaluate();
        break;
      case 'clear':
        setCurrentDisplay('');
        setResult(null);
        setIsError(false);
        setOpenParenthesesCount(0);
        break;
      case 'backspace':
        if (currentDisplay.endsWith('(')) setOpenParenthesesCount(p => Math.max(0, p -1));
        if (currentDisplay.endsWith(')')) setOpenParenthesesCount(p => p + 1);
        setCurrentDisplay(prev => prev.slice(0, -1));
        if (result !== null) setResult(null); // Clear result if backspacing
        break;
      case 'parenthesis':
        if (value === '(') {
          addToDisplay('(');
          setOpenParenthesesCount(p => p + 1);
        } else if (value === ')' && openParenthesesCount > 0) {
          addToDisplay(')');
          setOpenParenthesesCount(p => p - 1);
        } else if (value === ')' && openParenthesesCount === 0) {
          toast({ title: "Error", description: "No matching open parenthesis.", variant: "destructive" });
        }
        break;
      case 'toggleSign':
         // This is a complex operation. For simplicity, we'll just add a minus if nothing is there or if result.
        if (currentDisplay === '' && result !== null && result !== "Error") {
            const numRes = parseFloat(result);
            if (!isNaN(numRes)) {
                setCurrentDisplay((-numRes).toString());
                setResult(null);
            }
        } else if (currentDisplay.startsWith('-')) {
            setCurrentDisplay(currentDisplay.substring(1));
        } else {
            setCurrentDisplay('-' + currentDisplay);
        }
        break;
      case 'function': // e.g., "sin(", "log(", "sqrt("
        addToDisplay(value + '(');
        setOpenParenthesesCount(p => p + 1);
        break;
      case 'constant': // e.g., "π", "e"
        addToDisplay(value);
        break;
      case 'loadHistory':
        setCurrentDisplay(value); // value is the expression from history
        setResult(null);
        setIsError(false);
        // Recalculate open parentheses count for loaded expression
        let count = 0;
        for (const char of value) {
            if (char === '(') count++;
            else if (char === ')') count--;
        }
        setOpenParenthesesCount(Math.max(0, count)); // Ensure non-negative
        break;
      default:
        break;
    }
  };

  const handleMemoryOperation = (operation: MemoryOperation) => {
    resetError();
    const currentVal = parseFloat(result || currentDisplay);

    switch (operation) {
      case 'M+':
        if (!isNaN(currentVal)) setMemoryValue(prev => prev + currentVal);
        else toast({ title: "Memory Error", description: "Invalid value for M+", variant: "destructive" });
        break;
      case 'M-':
        if (!isNaN(currentVal)) setMemoryValue(prev => prev - currentVal);
        else toast({ title: "Memory Error", description: "Invalid value for M-", variant: "destructive" });
        break;
      case 'MR':
        addToDisplay(memoryValue.toString());
        break;
      case 'MC':
        setMemoryValue(0);
        break;
    }
  };
  
  const getExplanation = async () => {
    if (!currentDisplay.trim()) {
      toast({ title: "Input Error", description: "Enter an expression to explain.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    setExpressionForAI(currentDisplay); // Store the expression being explained
    setShowAiModal(true);
    try {
      const explanationResult = await explainCalculationSteps({ expression: currentDisplay });
      setAiExplanation(explanationResult.explanation);
    } catch (error) {
      console.error("AI explanation error:", error);
      setAiExplanation("Failed to get explanation.");
      toast({ title: "AI Error", description: "Could not fetch explanation.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAiExplanation = () => {
    setAiExplanation(null);
    setShowAiModal(false);
    setExpressionForAI('');
  };

  return {
    currentDisplay,
    result,
    history,
    memoryValue,
    angleUnit,
    isError,
    handleButtonClick,
    handleMemoryOperation,
    setAngleUnit, // Allow direct setting for switcher
    getExplanation,
    aiExplanation,
    isAiLoading,
    showAiModal,
    clearAiExplanation,
    expressionForAI
  };
}
