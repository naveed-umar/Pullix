import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: google('gemini-3.5-flash'),
    system: `You are an expert senior software engineer and technical educator. 
    Your goal is to explain the provided code snippet clearly. 
    Break your explanation into three parts:
    1. **Purpose**: What does this code do overall?
    2. **Data Flow / Logic**: How does it work step-by-step?
    3. **Dependencies / Context**: What key libraries or concepts is it using?
    
    Format your response in clean Markdown. Keep it concise but highly technical and accurate.`,
    prompt,
  });

  return result.toTextStreamResponse();
}
