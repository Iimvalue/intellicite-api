import { Paper } from '../models/papers.model';
import { PaperReport } from '../models/PaperReport.model';
import {
  searchSemanticScholar,
  enrichPaper,
} from './search-openAI/externalApis.service';
import { generateBadges } from '../utils/badge.helper';
import { formatToPaperModel } from '../utils/formatToPaperModel';

import { generateReport } from './search-openAI/openAiAssistant.service';
import { addUserSearchHistoryService } from './userHistory.service';

export async function getPapersWithReports(query: string, userId: string) {
  const results = await searchSemanticScholar(query, 5);

  if (results.length === 0) {
    console.warn('No papers found for query:', query);
    return []; 
  }

  // extract DOIs for operations
  const dois = results.map(result => result.externalIds.DOI).filter(Boolean);
  
  // find existing papers
  const existingPapers = await Paper.find({ doi: { $in: dois } });
  const existingPapersByDoi = new Map(existingPapers.map(paper => [paper.doi, paper]));

  // process papers in parallel 
  const paperPromises = results.map(async (result, index) => {
    try {
      const doi = result.externalIds.DOI;
      let paper = existingPapersByDoi.get(doi);

      if (!paper) {
        // if paper not found in the database, enrich it using the doi
        const meta = await enrichPaper(doi);
        if (!meta) {
          console.warn(`no metadata found for this paper: ${doi}`);
          return null;
        }
        // construct the metadata needed to generate badges
        const citationCount = meta.openalex?.cited_by_count ?? 0;

        const publicationDate = (() => {
          const cr = meta.crossref;
          const pubParts =
            cr?.published?.['date-parts']?.[0] ||
            cr?.created?.['date-parts']?.[0];
          return pubParts ? new Date(pubParts.join('-')) : new Date();
        })();

        const isOpenAccess = meta.unpaywall?.is_oa ?? false;

        const isPreprint =
          meta.crossref?.type === 'posted-content' ||
          meta.openalex?.type === 'posted_content';

        const journal =
          meta.crossref?.['container-title']?.[0] ??
          meta.crossref?.containerTitle?.[0] ??
          meta.openalex?.host_venue?.display_name ??
          'Unknown';

        const badgeData = {
          citationCount,
          publicationDate,
          isOpenAccess,
          isPreprint,
          journal,
          authors: meta.crossref?.author?.map((a: { given: string; family: string }) =>
            `${a.given || ''} ${a.family || ''}`.trim()
          ) || [],
          fwci: meta.openalex?.fwci,
          citationPercentile: meta.openalex?.citation_normalized_percentile?.value,
          isHighlyCited: meta.openalex?.citation_normalized_percentile?.is_in_top_1_percent,
          isInTop10Percent: meta.openalex?.citation_normalized_percentile?.is_in_top_10_percent,
          authorCount: meta.crossref?.author?.length || 0,
          countryCount: meta.openalex?.countries_distinct_count,
          isRetracted: meta.openalex?.is_retracted,
          hasFulltext: meta.openalex?.has_fulltext,
          meshTerms: meta.openalex?.mesh?.map((mesh: any) => mesh.descriptor_name).filter(Boolean),
          funders: meta.openalex?.grants?.map((grant: any) => ({
            id: grant.funder || '',
            name: grant.funder_display_name || '',
            awardId: grant.award_id || ''
          })),
          topics: meta.openalex?.topics?.map((topic: any) => ({
            id: topic.id || '',
            name: topic.display_name || '',
            score: topic.score || 0,
            field: topic.field?.display_name || ''
          })),
          language: meta.openalex?.language,
          type: meta.openalex?.type || meta.crossref?.type
        };

        // pass the metadata needed to generate badges
        const badges = generateBadges(badgeData);
        // format the paper data to match the paper model
        const paperData = formatToPaperModel(doi, meta, badges);
        // Create a new paper document
        paper = await Paper.create(paperData);
      }

      return { paper, index };
    } catch (error) {
      console.error(`Error processing paper ${index}:`, error);
      return null;
    }
  });

  // Wait for all papers to be processed
  const paperResults = await Promise.all(paperPromises);
  const validPapers = paperResults.filter(result => result !== null);

  // Generate reports in parallel - always create fresh reports for each query
  const reportPromises = validPapers.map(async ({ paper, index }) => {
    try {
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
      const report = await PaperReport.create({
        userId,
        query,
        paperId: paper._id as string,
        report: reportText,
      });

      return {
        paper,
        reportText: report.report,
        historyEntry: { paper: paper._id as string, report: report._id as string }
      };
    } catch (error) {
      console.error(`Error generating report for paper ${index}:`, error);
      return null;
    }
  });

  const reportResults = await Promise.all(reportPromises);
  const validResults = reportResults.filter(result => result !== null);

    // prepare outputs and history results
  const outputs = validResults.map(result => ({
    paper: result.paper,
    reportText: result.reportText,
  }));

  const historyResults = validResults.map(result => result.historyEntry);

  // store user search history 
  addUserSearchHistoryService(userId, query, historyResults).catch(err => {
    console.error('Failed to save user search history:', err);
  });

  // return the array of papers with their reports
  return outputs;
}
