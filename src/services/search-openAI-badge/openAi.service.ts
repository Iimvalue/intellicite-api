// will have to refactor the code to use the openai assistant instead of the chat completion 

// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export async function generateReport(userQuery: string, title: string, abstract: string): Promise<string> {
// const prompt = `assess this paper's relevance for a user researching: "${userQuery}"

// Paper:
// Title: "${title}"
// Abstract: ${abstract}

// tell the user if this paper is relevant and why. mention if it supports, contradicts, or provides background.
// be direct, honest, and use "you" language. Keep it concise.`;

//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o',
//     messages: [{ role: 'user', content: prompt }],
//     temperature: 0.5,
//     max_tokens: 200
//   });

//   return response.choices[0].message?.content?.trim() || 'No response';
// }
