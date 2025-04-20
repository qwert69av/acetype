'use server';
/**
 * @fileOverview AI agent for generating typing test paragraphs.
 *
 * - generateTypingParagraph - A function that generates a typing paragraph.
 * - GenerateTypingParagraphInput - The input type for the generateTypingParagraph function.
 * - GenerateTypingParagraphOutput - The return type for the generateTypingParagraph function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateTypingParagraphInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty of the paragraph to generate.'),
});
export type GenerateTypingParagraphInput = z.infer<
  typeof GenerateTypingParagraphInputSchema
>;

const GenerateTypingParagraphOutputSchema = z.object({
  paragraph: z
    .string()
    .describe('The generated paragraph for the typing test.'),
});
export type GenerateTypingParagraphOutput = z.infer<
  typeof GenerateTypingParagraphOutputSchema
>;

export async function generateTypingParagraph(
  input: GenerateTypingParagraphInput
): Promise<GenerateTypingParagraphOutput> {
  return generateTypingParagraphFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTypingParagraphPrompt',
  input: {
    schema: z.object({
      difficulty: z
        .enum(['easy', 'medium', 'hard'])
        .describe('The difficulty of the paragraph to generate.'),
    }),
  },
  output: {
    schema: z.object({
      paragraph: z
        .string()
        .describe('The generated paragraph for the typing test.'),
    }),
  },
  prompt: `You are a paragraph generator for a typing test website.

  The user will specify the difficulty of the paragraph they want to generate.

  Difficulty: {{{difficulty}}}

  Generate a paragraph that is appropriate for the given difficulty.
  `,
});

const generateTypingParagraphFlow = ai.defineFlow<
  typeof GenerateTypingParagraphInputSchema,
  typeof GenerateTypingParagraphOutputSchema
>(
  {
    name: 'generateTypingParagraphFlow',
    inputSchema: GenerateTypingParagraphInputSchema,
    outputSchema: GenerateTypingParagraphOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
