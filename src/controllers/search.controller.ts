import { Request, Response } from "express";
import axios from "axios";

export const searchPapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({
        success: false,
        message: "Search query is required (use ?q=...)",
      });
      return;
    }

    const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
      query
    )}&limit=10&fields=title,authors,year,venue,abstract,url,externalIds,isOpenAccess,openAccessPdf,citationCount`;

    const response = await axios.get(apiUrl);
    const results = response.data?.data || [];

    const papers = results.map((paper: any) => {
      return {
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
      };
    });

    res.status(200).json({
      success: true,
      message: "Search results retrieved",
      data: papers,
    });
  } catch (error) {
    console.error("Search papers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve search results",
    });
  }
};