// functions to give each paper a badge that describes its status, used to enrich the paper metadata.

// badge configuration
const BADGE_CONFIG = {
  citation: {
    highlyCited: 1000,
    wellCited: 100,
    lowCitation: 10,
    minYearsForLowCitation: 2,
    minYearsForNoCitation: 1
  },
  recency: {
    recentYears: 2,
    outdatedYears: 10
  },
  impact: {
    highFwci: 2.0,
    mediumFwci: 1.5,
    lowFwci: 0.5
  },
  collaboration: {
    largeCollaboration: 10,
    multiAuthor: 5
  },
  prestige: {
    highImpactJournals: [
      'nature', 'science', 'cell', 'the lancet', 'new england journal of medicine',
      'proceedings of the national academy of sciences', 'nature genetics',
      'nature medicine', 'nature neuroscience', 'nature immunology'
    ],
    mediumImpactJournals: [
      'plos one', 'scientific reports', 'biorxiv', 'arxiv',
      'ieee transactions', 'acm transactions'
    ]
  }
};

function getCitationBadge(citationCount: number, pubYear: number, nowYear: number): string | null {
  // edge cases
  if (citationCount < 0 || pubYear < 1900 || pubYear > nowYear + 1) return null;
  
  const yearsOld = nowYear - pubYear;
  
  // highly cited 
  if (citationCount >= BADGE_CONFIG.citation.highlyCited) return 'Highly Cited';
  
  // well cited 
  if (citationCount >= BADGE_CONFIG.citation.wellCited) return 'Well Cited';
  
  if (yearsOld >= BADGE_CONFIG.citation.minYearsForLowCitation) {
    if (citationCount > 0 && citationCount <= BADGE_CONFIG.citation.lowCitation) {
      return 'Low Citation';
    }
    if (citationCount === 0 && yearsOld >= BADGE_CONFIG.citation.minYearsForNoCitation) {
      return 'No Citations';
    }
  }
  
  return null;
}

function getRecencyBadge(pubYear: number, nowYear: number): string | null {
  // edge cases
  if (pubYear < 1900 || pubYear > nowYear + 1) return null;
  
  const yearsOld = nowYear - pubYear;
  
  if (yearsOld <= BADGE_CONFIG.recency.recentYears) return 'Recent';
  if (yearsOld >= BADGE_CONFIG.recency.outdatedYears) return 'Outdated';
  
  return null;
}

function getOpenAccessBadge(isOpenAccess: boolean): string | null {
  return isOpenAccess ? 'Open Access' : null;
}

function getPreprintBadge(isPreprint: boolean, journal?: string): string | null {
  if (isPreprint) return 'Preprint';
  
  // check if journal indicates preprint
  if (journal) {
    const lowerJournal = journal.toLowerCase();
    if (lowerJournal.includes('arxiv') || 
        lowerJournal.includes('biorxiv') || 
        lowerJournal.includes('preprint')) {
      return 'Preprint';
    }
  }
  
  return null;
}

function getJournalPrestigeBadge(journal?: string): string | null {
  if (!journal) return null;
  
  const lowerJournal = journal.toLowerCase();
  
  // high-impact journals
  for (const prestigeJournal of BADGE_CONFIG.prestige.highImpactJournals) {
    if (lowerJournal.includes(prestigeJournal)) {
      return 'High Impact Journal';
    }
  }
  
  // medium-impact journals
  for (const mediumJournal of BADGE_CONFIG.prestige.mediumImpactJournals) {
    if (lowerJournal.includes(mediumJournal)) {
      return 'Medium Impact Journal';
    }
  }
  
  return null;
}

function getCollaborationBadge(authors: string[] = [], authorCount?: number, countryCount?: number): string | null {
  const count = authorCount || authors.length;
  
  if (count >= BADGE_CONFIG.collaboration.largeCollaboration) return 'Large Collaboration';
  if (count >= BADGE_CONFIG.collaboration.multiAuthor) return 'Multi-Author';
  if (count === 1) return 'Single Author';
  
  return null;
}

function getImpactBadge(fwci?: number, citationPercentile?: number, isHighlyCited?: boolean, isInTop10Percent?: boolean): string | null {
  if (isHighlyCited) return 'Top 1% Most Cited';
  if (isInTop10Percent) return 'Top 10% Most Cited';
  
  if (fwci !== undefined && fwci !== null) {
    if (fwci >= BADGE_CONFIG.impact.highFwci) return 'High Impact';
    if (fwci >= BADGE_CONFIG.impact.mediumFwci) return 'Above Average Impact';
    if (fwci <= BADGE_CONFIG.impact.lowFwci) return 'Low Impact';
  }
  
  return null;
}

function getQualityBadge(isRetracted?: boolean, hasFulltext?: boolean): string | null {
  if (isRetracted) return 'Retracted';
  if (hasFulltext) return 'Full Text Available';
  
  return null;
}

function getFundingBadge(funders?: Array<{id: string; name: string; awardId?: string}>): string | null {
  if (!funders || funders.length === 0) return null;
  
  const fundingCount = funders.length;
  const hasAwardIds = funders.some(f => f.awardId);
  
  if (fundingCount >= 3) return 'Multi-Funded';
  if (hasAwardIds) return 'Grant Funded';
  if (fundingCount > 0) return 'Funded Research';
  
  return null;
}

function getLanguageBadge(language?: string): string | null {
  if (!language || language === 'en') return null;
  
  const languages: Record<string, string> = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'it': 'Italian',
    'ko': 'Korean',
    'ar': 'Arabic'
  };
  
  return languages[language] ? `${languages[language]} Language` : 'Non-English';
}

function getTypeBadge(type?: string): string | null {
  if (!type || type === 'article') return null;
  
  const typeMap: Record<string, string> = {
    'book': 'Book',
    'book-chapter': 'Book Chapter',
    'dataset': 'Dataset',
    'dissertation': 'Dissertation',
    'editorial': 'Editorial',
    'letter': 'Letter',
    'review': 'Review Article',
    'report': 'Report',
    'conference-paper': 'Conference Paper'
  };
  
  return typeMap[type] || 'Special Publication';
}

export function generateBadges({
  citationCount,
  publicationDate,
  isOpenAccess,
  isPreprint,
  journal,
  authors,
  fwci,
  citationPercentile,
  isHighlyCited,
  isInTop10Percent,
  authorCount,
  countryCount,
  isRetracted,
  hasFulltext,
  funders,
  language,
  type
}: {
  citationCount: number;
  publicationDate: Date;
  isOpenAccess: boolean;
  isPreprint: boolean;
  journal?: string;
  authors?: string[];
  fwci?: number;
  citationPercentile?: number;
  isHighlyCited?: boolean;
  isInTop10Percent?: boolean;
  authorCount?: number;
  countryCount?: number;
  isRetracted?: boolean;
  hasFulltext?: boolean;
  funders?: Array<{id: string; name: string; awardId?: string}>;
  language?: string;
  type?: string;
}): string[] {
  // edge cases
  if (!publicationDate || isNaN(publicationDate.getTime())) {
    return ['Invalid Date'];
  }
  
  const nowYear = new Date().getFullYear();
  const pubYear = publicationDate.getFullYear();
  
  const badges = [
    getCitationBadge(citationCount, pubYear, nowYear),
    getRecencyBadge(pubYear, nowYear),
    getOpenAccessBadge(isOpenAccess),
    getPreprintBadge(isPreprint, journal),
    getJournalPrestigeBadge(journal),
    getCollaborationBadge(authors, authorCount, countryCount),    
    getImpactBadge(fwci, citationPercentile, isHighlyCited, isInTop10Percent),
    getQualityBadge(isRetracted, hasFulltext),
    getFundingBadge(funders),
    getLanguageBadge(language),
    getTypeBadge(type)
  ].filter(Boolean) as string[];
  
  return badges;
}

// export configuration
export const badgeConfig = BADGE_CONFIG;
