import { IPaper } from '../models/papers.model';

export function formatToPaperModel(
  doi: string,
  metadata: { crossref: any; unpaywall: any; openalex: any },
  badges: string[]
): Partial<IPaper> {
  const cr = metadata.crossref;
  const uw = metadata.unpaywall;
  const oa = metadata.openalex;

  const pubParts =
    cr?.published?.['date-parts']?.[0] || cr?.created?.['date-parts']?.[0];
  const publicationDate = pubParts
    ? new Date(pubParts.join('-'))
    : new Date();

  return {
    doi,
    title: cr?.title?.[0] ?? oa?.display_name ?? 'Untitled',
    authors:
      cr?.author?.map((a: { given: string; family: string }) =>
        `${a.given || ''} ${a.family || ''}`.trim()
      ) ?? [],
    publicationDate,
    journal:
      cr?.['container-title']?.[0] ??
      cr?.containerTitle?.[0] ??
      oa?.host_venue?.display_name ??
      'Unknown',
    citationCount: oa?.cited_by_count ?? 0,
    badges,
    pdfLink: uw?.best_oa_location?.url_for_pdf ?? '',
    sourceLink: cr?.URL ?? oa?.id ?? '',
    isOpenAccess: uw?.is_oa ?? false,
    isPreprint:
      cr?.type === 'posted-content' || oa?.type === 'posted_content',
  };
}
