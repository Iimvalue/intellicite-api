import axios from "axios";

export const searchExternalPapers = async (query: string) => {
  const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,authors,year,venue,abstract,url,externalIds,isOpenAccess,openAccessPdf,citationCount`;

  const response = await axios.get(apiUrl);
  const results = response.data?.data || [];

  return results.map((paper: any) => ({
    title: paper.title,
    authors: paper.authors.map((a: any) => a.name),
    publicationDate: paper.year ? `${paper.year}-01-01` : null,
    journal: paper.venue || "Unknown",
    summary: paper.abstract || "Abstract Not Available",
    citationCount: paper.citationCount || 0,
    pdfLink: paper.openAccessPdf?.url || "",
    sourceLink: paper.url || "",
    doi: paper.externalIds?.DOI || "",
    badges: [
      paper.isOpenAccess ? "Open Access" : "Restricted",
      !paper.abstract ? "Abstract Not Available" : "",
    ].filter(Boolean),
  }));
};