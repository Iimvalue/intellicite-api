import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.RESEARCH_ASSISTANT_ID!;

export async function generateReport(
  userQuery: string,
  paperMetadata: {
    title: string;
    abstract: string;
    journal: string;
    publicationDate: string;
    citationCount: number;
    isOpenAccess: boolean;
    isPreprint: boolean;
    badges: string[];
  }
): Promise<string> {
  // static response for testing
  return `static test response for query: ${userQuery}\nPaper title: ${paperMetadata.title}`;
}
