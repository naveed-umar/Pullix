import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

async function testModel(modelName) {
  try {
    const { text } = await generateText({
      model: google(modelName),
      prompt: 'Hello, what is your name?',
    });
    console.log(`✅ ${modelName} works!`);
    return true;
  } catch (err) {
    console.log(`❌ ${modelName} failed: ${err.message}`);
    return false;
  }
}

async function run() {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'AIzaSyAoopWtU8-dBos-ZAoUn2ppZ9jQs3fZ_l0';
  const modelsToTest = ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  for (const model of modelsToTest) {
    await testModel(model);
  }
}

run();
