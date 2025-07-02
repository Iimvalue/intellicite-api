import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Paper } from '../models/papers.model';
import { PaperReport } from '../models/PaperReport.model';
import { checkCitation } from '../services/search-openAI/externalApis.service';
import { generateBadges } from '../utils/badge.helper';
import { generateReport } from '../services/search-openAI/openAiAssistant.service';
import { formatToPaperModel } from '../utils/formatToPaperModel';

export const generateCiteCheck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { query, doi } = req.body;

    if (!userId || !query || !doi) {
      res.status(400).json({ 
        success: false, 
        message: 'missing user id, query, or doi' 
      });
      return;
    }

    let paper = await Paper.findOne({ doi });

    if (!paper) {
      const meta = await checkCitation(doi);
              if (!meta) {
          res.status(404).json({ 
            success: false, 
            message: 'paper metadata not found' 
          });
          return;
        }

      const citationCount = meta.openalex?.cited_by_count ?? 0;

      const publicationDate = (() => {
        const pubParts =
          meta.crossref?.published?.['date-parts']?.[0] ||
          meta.crossref?.created?.['date-parts']?.[0];
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

      const badges = generateBadges({
        citationCount,
        publicationDate,
        isOpenAccess,
        isPreprint,
        journal,
      });

      const paperData = formatToPaperModel(doi, meta, badges);
      paper = await Paper.create(paperData);
    }

    const existing = await PaperReport.findOne({
      userId,
      paperId: paper._id,
      query,
    }).populate('paperId');

    if (existing) {
      res.status(200).json({
        success: true,
        message: 'citation report retrieved successfully',
        data: existing
      });
      return;
    }

    const report = await generateReport(query, {
      title: paper.title,
      abstract: (paper as any).abstract ?? '',
      journal: paper.journal,
      publicationDate: paper.publicationDate.toISOString().split('T')[0],
      citationCount: paper.citationCount,
      isOpenAccess: paper.isOpenAccess ?? false,
      isPreprint: paper.isPreprint ?? false,
      badges: paper.badges ?? [],
    });

    const saved = await PaperReport.create({
      userId,
      paperId: paper._id,
      query,
      report,
      type: 'citeCheck',
    });

    await saved.populate('paperId');
    res.status(201).json({
      success: true,
      message: 'citation report generated successfully',
      data: saved
    });
  } catch (error) {
    console.error('error creating paper report from DOI:', error);
    res.status(500).json({ 
      success: false, 
      message: 'internal server error' 
    });
  }
};
