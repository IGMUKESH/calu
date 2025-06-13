'use server';

/**
 * @fileOverview Explains the steps to solve a complex calculation.
 *
 * - explainCalculationSteps - A function that takes a mathematical expression and returns a step-by-step explanation of how to solve it.
 * - ExplainCalculationStepsInput - The input type for the explainCalculationSteps function.
 * - ExplainCalculationStepsOutput - The return type for the explainCalculationSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCalculationStepsInputSchema = z.object({
  expression: z
    .string()
    .describe('The complex mathematical expression to be explained.'),
});
export type ExplainCalculationStepsInput = z.infer<
  typeof ExplainCalculationStepsInputSchema
>;

const ExplainCalculationStepsOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A step-by-step explanation of how to solve the mathematical expression.'
    ),
});
export type ExplainCalculationStepsOutput = z.infer<
  typeof ExplainCalculationStepsOutputSchema
>;

export async function explainCalculationSteps(
  input: ExplainCalculationStepsInput
): Promise<ExplainCalculationStepsOutput> {
  return explainCalculationStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCalculationStepsPrompt',
  input: {schema: ExplainCalculationStepsInputSchema},
  output: {schema: ExplainCalculationStepsOutputSchema},
  prompt: `You are an expert mathematician skilled at explaining complex mathematical expressions in a step-by-step manner.

Please provide a detailed, step-by-step explanation of how to solve the following mathematical expression:

Expression: {{{expression}}}

Ensure that each step is clearly articulated and easy to understand, even for someone with limited mathematical knowledge.`,
});

const explainCalculationStepsFlow = ai.defineFlow(
  {
    name: 'explainCalculationStepsFlow',
    inputSchema: ExplainCalculationStepsInputSchema,
    outputSchema: ExplainCalculationStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
