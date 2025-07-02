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
    //  first we create a thread
    const thread = await openai.beta.threads.create();

    //  than we send user message with JSON
    const content = JSON.stringify(
      {
        topic: userQuery,
        paper: {
          title: paperMetadata.title,
          abstract: paperMetadata.abstract,
          journal: paperMetadata.journal,
          publicationDate: paperMetadata.publicationDate,
          citationCount: paperMetadata.citationCount,
          isOpenAccess: paperMetadata.isOpenAccess,
          isPreprint: paperMetadata.isPreprint,
          badges: paperMetadata.badges,
        },
      },
      null,
      2
    );

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content,
    });

    // run assistant and poll auto
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    if (run.status !== 'completed') {
      console.error(`Assistant run failed. Status: ${run.status}`);
      throw new Error(`Assistant run did not complete successfully.`);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    // grab the last messg from assistant - btw there is no need for reversing here and finding since it is a single run, but just to be safe

    const lastMessage = [...messages.data].reverse().find((msg) => msg.role === 'assistant');
    
    // extract the text content from it, why? because typescript :/.
    // no for real the reason is assistant response can be multiple content types. and typescript is strict about types
    const text = (lastMessage?.content as any[]).find((c) => c.type === 'text')
      ?.text?.value;

    return text?.trim() || 'No response from assistant.';
  }
