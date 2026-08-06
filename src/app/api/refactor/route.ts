import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await generateText({
      model: google('gemini-3.5-flash'),
      system: `You are an expert senior software architect. 
      Your goal is to provide actionable refactoring advice based on the provided context.
      
      The user will provide a specific code smell or architectural issue (e.g., duplicate logic, complex functions) and the files involved.
      
      Provide a clear, step-by-step refactoring plan.
      Keep your explanation concise, highly technical, and format it in clean Markdown.`,
      prompt,
    });

    return new Response(result.text, { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
