import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: google('gemini-3.5-flash'),
    system: `You are an elite Staff Software Engineer performing a rigorous code review.
    Analyze the provided code or diff. Identify bugs, security vulnerabilities, performance bottlenecks, and architectural improvements.
    
    Format your response in Markdown as a list of findings. For each finding, include:
    - **Severity**: (High, Medium, Low)
    - **Category**: (Security, Bug, Performance, Best Practice)
    - **Description**: What is the issue, and how should it be fixed? Code snippets for the fix are highly encouraged.
    
    Be brutally honest, precise, and focus on production-readiness. Do not compliment the code, just review it.`,
    prompt,
  });

  return result.toTextStreamResponse();
}
