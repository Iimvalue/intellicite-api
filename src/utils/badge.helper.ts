



function getCitationBadge(citationCount: number, pubYear: number, nowYear: number): string | null {
  if (citationCount >= 100) return 'Highly Cited';
  if (citationCount >= 30) return 'Well Cited';
  if (citationCount > 0 && citationCount <= 10 && pubYear <= nowYear - 2) return 'Low Citation';
  if (citationCount === 0 && pubYear <= nowYear - 1) return 'No Citations';
  return null;
}

function getRecencyBadge(pubYear: number, nowYear: number): string | null {
  if (pubYear >= nowYear - 2) return 'Recent';
  if (pubYear <= nowYear - 10) return 'Outdated';
  return null;
}

function getOpenAccessBadge(isOpenAccess: boolean): string | null {
  return isOpenAccess ? 'Open Access' : null;
}

function getPreprintBadge(isPreprint: boolean, journal?: string): string | null {
  if (isPreprint || journal?.toLowerCase().includes('arxiv')) return 'Preprint';
  return null;
}

export function generateBadges({
  citationCount,
  publicationDate,
  isOpenAccess,
  isPreprint,
  journal
}: {
  citationCount: number;
  publicationDate: Date;
  isOpenAccess: boolean;
  isPreprint: boolean;
  journal?: string;
}): string[] {
  const nowYear = new Date().getFullYear();
  const pubYear = publicationDate.getFullYear();
  const badges = [
    getCitationBadge(citationCount, pubYear, nowYear),
    getRecencyBadge(pubYear, nowYear),
    getOpenAccessBadge(isOpenAccess),
    getPreprintBadge(isPreprint, journal)
  ].filter(Boolean) as string[];
  return badges;
}
