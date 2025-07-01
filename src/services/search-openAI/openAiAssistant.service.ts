
type PaperMetadata = {
  title: string;
  abstract: string;
  journal: string;
  publicationDate: string;
  citationCount: number;
  isOpenAccess: boolean;
  isPreprint: boolean;
  badges: string[];
};

export async function generateReport(
  userQuery: string,
  paperMetadata: PaperMetadata
): Promise<string> {
  return `static test response for query: ${userQuery}\nPaper title: ${paperMetadata.title}`;
}
