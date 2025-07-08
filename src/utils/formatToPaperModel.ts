import { IPaper } from '../models/papers.model';

// extract abstract from OpenAlex inverted index
function extractAbstract(abstractInvertedIndex: any): string {
  if (!abstractInvertedIndex || typeof abstractInvertedIndex !== 'object') {
    return '';
  }
  
  const words: Array<{word: string, positions: number[]}> = [];
  
  for (const [word, positions] of Object.entries(abstractInvertedIndex)) {
    if (Array.isArray(positions)) {
      words.push({ word, positions });
    }
  }
  
  
  words.sort((a, b) => Math.min(...a.positions) - Math.min(...b.positions));
  
  // first 350 words to avoid long abstracts
  return words.slice(0, 350).map(w => w.word).join(' ');
}

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

  //  authors with institution info
  const authors = cr?.author?.map((a: { given: string; family: string }) =>
    `${a.given || ''} ${a.family || ''}`.trim()
  ) || [];

  //  author institutions from OpenAlex
  const authorInstitutions = oa?.authorships?.map((auth: any) => ({
    authorName: auth.author?.display_name || '',
    institutions: auth.institutions?.map((inst: any) => inst.display_name) || [],
    countries: auth.institutions?.map((inst: any) => inst.country_code).filter(Boolean) || []
  })) || [];

  //  topics from OpenAlex
  const topics = oa?.topics?.map((topic: any) => ({
    id: topic.id || '',
    name: topic.display_name || '',
    score: topic.score || 0,
    field: topic.field?.display_name || '',
    subfield: topic.subfield?.display_name || ''
  })) || [];

  // funding info
  const funders = oa?.grants?.map((grant: any) => ({
    id: grant.funder || '',
    name: grant.funder_display_name || '',
    awardId: grant.award_id || ''
  })) || [];

  

  //  keywords from OpenAlex
  const keywords = oa?.keywords?.map((kw: any) => kw.display_name).filter(Boolean) || [];

  //  citation trends
  const citationsByYear = oa?.counts_by_year?.map((count: any) => ({
    year: count.year,
    count: count.cited_by_count || 0
  })) || [];

  //  venue information
  const venueType = oa?.primary_location?.source?.type || 'unknown';
  const publisher = oa?.primary_location?.source?.host_organization_name || 
                   cr?.publisher || 'Unknown';

  const volume = cr?.volume || oa?.biblio?.volume || '';
  const issue = cr?.issue || oa?.biblio?.issue || '';
  const pages = cr?.page || oa?.biblio?.first_page ? 
    (oa?.biblio?.last_page ? `${oa.biblio.first_page}-${oa.biblio.last_page}` : oa.biblio.first_page) : 
    '';

  return {
    doi,
    title: cr?.title?.[0] ?? oa?.display_name ?? 'Untitled',
    authors,
    publicationDate,
    journal:
      cr?.['container-title']?.[0] ??
      cr?.containerTitle?.[0] ??
      oa?.host_venue?.display_name ??
      'Unknown',
    volume,
    issue,
    pages,
    citationCount: oa?.cited_by_count ?? 0,
    badges,
    pdfLink: uw?.best_oa_location?.url_for_pdf ?? '',
    sourceLink: cr?.URL ?? oa?.id ?? '',
    isOpenAccess: uw?.is_oa ?? false,
    isPreprint:
      cr?.type === 'posted-content' || oa?.type === 'posted_content',    
    abstract: extractAbstract(oa?.abstract_inverted_index) || cr?.abstract?.[0] || '',
    keywords,
    language: oa?.language || 'en',
    type: oa?.type || cr?.type || 'article',
    license: oa?.open_access?.oa_url ? (oa?.license || 'unknown') : null,
    publisher,
    issn: oa?.primary_location?.source?.issn || [],    
    fwci: oa?.fwci || null,
    citationPercentile: oa?.citation_normalized_percentile?.value || null,
    isHighlyCited: oa?.citation_normalized_percentile?.is_in_top_1_percent || false,
    isInTop10Percent: oa?.citation_normalized_percentile?.is_in_top_10_percent || false,    
    authorCount: authors.length,
    institutionCount: oa?.institutions_distinct_count || 0,
    countryCount: oa?.countries_distinct_count || 0,    
    isRetracted: oa?.is_retracted || false,
    hasFulltext: oa?.has_fulltext || false,
      
    topics,    
    funders,    
    venueType,
    venueRank: badges.includes('High Impact Journal') ? 'high-impact' : 
               badges.includes('Medium Impact Journal') ? 'medium-impact' : 'standard',
    authorInstitutions,    
    citationsByYear,    
    relatedWorks: oa?.related_works?.slice(0, 10) || [],
    referencedWorks: oa?.referenced_works?.slice(0, 10) || []
  };
}
