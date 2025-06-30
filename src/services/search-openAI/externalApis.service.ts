import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const user_email = process.env.USER_EMAIL || '';
if (!user_email) {
  throw new Error('USER_EMAIL is not set in .env for Unpaywall API');
}

// return search results from semantic  - limited to 3 results
// https://api.semanticscholar.org/graph/v1/paper/search?query=<example> (<<) an example query

export async function searchSemanticScholar(query: string, count: number = 3) {
  const doiPapers: any[] = [];
  let offset = 0;
  const pageSize = 10;
  const maxPages = 5;
  let pagesTried = 0;

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  while (doiPapers.length < count && pagesTried < maxPages) {
    try {
      // console.log(`fetching papers...found=${doiPapers.length}`);

      const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search`, {
        params: {
          query,
          limit: pageSize,
          offset,
          fields:
            'title,authors,year,venue,abstract,url,citationCount,externalIds',
        },
      });

      const papers = Array.isArray(response.data.data) ? response.data.data : [];

      if (papers.length === 0) {
        console.warn('no more results from Semantic Scholar.');
        break;
      }

      const valid = papers.filter((p: any) => p.externalIds?.DOI);
      console.log(`page ${pagesTried + 1}: ${papers.length} total, ${valid.length} with DOIs`);

      doiPapers.push(...valid);
      offset += pageSize;
      pagesTried++;

      await delay(2000); 
    } catch (error: any) {
      if (error.response?.status === 429) {
        // console.warn('rate limit hit (429). Retrying after 2 seconds...');
        await delay(2000);
        continue; 
      }

      console.warn('Semantic Scholar Search error:', error.message);
      break;
    }
  }

  // console.log(`total valid papers with DOI: ${doiPapers.length}`);
  return doiPapers.slice(0, count);
}


// return a single paper from Semantic by doi - used in the check citation feature
// https://api.semanticscholar.org/graph/v1/paper/DOI:<doi> (<<) an example get request

export async function getFromSemanticScholar(doi: string) {
  try {
    const encodedDoi = encodeURIComponent(doi);
    const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodedDoi}`;
    const response = await axios.get(url, {
      params: {
        fields: 'title,authors,year,venue,abstract,url,citationCount',
      },
    });
    return response.data;
  } catch (error: any) {
    console.warn('Semantic Scholar error:', error.message);
    return null;
  }
}

// these are the APIs used to enrich the paper data
// Unpaywall, Crossref, OpenAlex

// return a single paper from Unpaywall by doi
export async function getFromUnpaywall(doi: string) {
  try {
    const encodedDoi = encodeURIComponent(doi);
    const url = `https://api.unpaywall.org/v2/${encodedDoi}`;
    const response = await axios.get(url, {
      params: { email: user_email },
    });
    return response.data;
  } catch (error: any) {
    console.warn('Unpaywall error:', error.message);
    return null;
  }
}

// return a single paper from Crossref by doi
export async function getFromCrossref(doi: string) {
  try {
    const encodedDoi = encodeURIComponent(doi);
    const url = `https://api.crossref.org/works/${encodedDoi}`;
    const response = await axios.get(url);
    return response.data.message;
  } catch (error: any) {
    console.warn('Crossref error:', error.message);
    return null;
  }
}

// return a single paper from OpenAlex by doi
export async function getFromOpenAlex(doi: string) {
  try {
    const encodedDoi = encodeURIComponent(`https://doi.org/${doi}`);
    const url = `https://api.openalex.org/works/${encodedDoi}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.warn('OpenAlex error:', error.message);
    return null;
  }
}

// a func that is used to enrich a paper with data from Unpaywall, Crossref, and OpenAlex using its doi
export async function enrichPaper(doi: string) {
  const [uw, cr, oa] = await Promise.all([
    getFromUnpaywall(doi),
    getFromCrossref(doi),
    getFromOpenAlex(doi),
  ]);

  return { unpaywall: uw, crossref: cr, openalex: oa };
}

// a func to check a citation by doi, it returns details for the paper from four APIs
export async function checkCitation(doi: string) {
  const [uw, cr, oa, ss] = await Promise.all([
    getFromUnpaywall(doi),
    getFromCrossref(doi),
    getFromOpenAlex(doi),
    getFromSemanticScholar(doi),
  ]);

  return {
    unpaywall: uw,
    crossref: cr,
    openalex: oa,
    semanticScholar: ss,
  };
}
