import { Paper } from '../models/papers.model';
import { PaperReport } from '../models/PaperReport.model';
import {
  searchSemanticScholar,
  enrichPaper,
} from './search-openAI/externalApis.service';
import { generateBadges } from '../utils/badge.helper';
import { formatToPaperModel } from '../utils/formatToPaperModel';
import { generateReport } from './search-openAI/openAiAssistant.service';

export async function getPapersWithReports(query: string, userId: string) {
  
  const results = await searchSemanticScholar(query, 3);

  if (results.length === 0) {
    throw new Error('no papers with doi found.');
  }

  const outputs = [];

  for (const result of results) {
    const doi = result.externalIds.DOI;
    let paper = await Paper.findOne({ doi });

    if (!paper) {
      // If paper not found in the database, enrich it using the doi
      const meta = await enrichPaper(doi);
      if (!meta) {
        console.warn(`no metadata found for this paper: ${doi}`);
        continue;
      }

      // construct the metadata needed to generate badges
      const badgeData = {
        citationCount: meta.openalex?.cited_by_count ?? 0,
        publicationDate: (() => {
          const cr = meta.crossref;
          const pubParts =
            cr?.published?.['date-parts']?.[0] ||
            cr?.created?.['date-parts']?.[0];
          return pubParts ? new Date(pubParts.join('-')) : new Date();
        })(),
        isOpenAccess: meta.unpaywall?.is_oa ?? false,
        isPreprint:
          meta.crossref?.type === 'posted-content' ||
          meta.openalex?.type === 'posted_content',
        journal:
          meta.crossref?.['container-title']?.[0] ??
          meta.crossref?.containerTitle?.[0] ??
          meta.openalex?.host_venue?.display_name ??
          'Unknown',
      };

      // pass the metadata needed to generate badges
      const badges = generateBadges(badgeData);
      // format the paper data to match the paper model
      const paperData = formatToPaperModel(doi, meta, badges);
      // Create a new paper document
      paper = await Paper.create(paperData);
    }
    // Check if a report already exists for this paper and user
    let report = await PaperReport.findOne({ userId, paperId: paper._id });
    // If no report exists, generate a new one
    if (!report) {
      const reportText = await generateReport(query, {
        title: paper.title,
        abstract: (paper as any).abstract ?? '',
        journal: paper.journal,
        publicationDate: paper.publicationDate.toISOString().split('T')[0],
        citationCount: paper.citationCount,
        isOpenAccess: paper.isOpenAccess ?? false,
        isPreprint: paper.isPreprint ?? false,
        badges: paper.badges ?? [],
      });
      // create new report document
      report = await PaperReport.create({
        userId,
        paperId: paper._id,
        report: reportText,
      });
    }
    // add the paper and its report to the outputs array
    outputs.push({
      paper,
      reportText: report.report,
    });
  }
  // return the array of papers with their reports
  return outputs;
}
