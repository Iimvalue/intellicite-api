import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const user_email = process.env.USER_EMAIL || '';
if (!user_email) {
  throw new Error('USER_EMAIL is not set in .env for Unpaywall API');
}

// configure axios instances 
const createAxiosInstance = (baseURL?: string, timeout: number = 10000): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'User-Agent': 'IntelliCite-API/1.0',
      'Accept': 'application/json',
    },
    // connection pooling and keep-alive
    maxRedirects: 3,
    validateStatus: (status) => status < 500, 
  });
};

// axios instances for each API
const semanticScholarAPI = createAxiosInstance('https://api.semanticscholar.org', 15000);
const crossrefAPI = createAxiosInstance('https://api.crossref.org', 10000);
const openAlexAPI = createAxiosInstance('https://api.openalex.org', 10000);
const unpaywallAPI = createAxiosInstance('https://api.unpaywall.org', 8000);

  // backoff utility
const exponentialBackoff = async (attempt: number, maxAttempts: number = 3): Promise<void> => {
  if (attempt >= maxAttempts) return;
  const delay = Math.min(1000 * Math.pow(2, attempt), 10000); 
  await new Promise(resolve => setTimeout(resolve, delay));
};

// retry logic
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  apiName: string = 'API'
): Promise<T | null> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      
      // rate limiting
      if (error.response?.status === 429 && !isLastAttempt) {
        console.warn(`${apiName} rate limit hit (429). Retrying after backoff...`);
        const retryAfter = error.response?.headers?.['retry-after'] || 5;
        const baseDelay = apiName === 'Semantic Scholar' ? 10000 : 2000; 
        const delay = Math.max(parseInt(retryAfter) * 1000, baseDelay * (attempt + 1));
        console.log(`Waiting ${delay/1000}s before retry attempt ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // server errors 
      if (error.response?.status >= 500 && !isLastAttempt) {
        console.warn(`${apiName} server error (${error.response.status}). Retrying...`);
        await exponentialBackoff(attempt);
        continue;
      }
      
      // network errors 
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        if (!isLastAttempt) {
          console.warn(`${apiName} network error (${error.code}). Retrying...`);
          await exponentialBackoff(attempt);
          continue;
        }
      }
      
      // client errors 
      if (isLastAttempt) {
        console.warn(`${apiName} final error: HTTP ${error.response?.status || 'N/A'}: ${error.message}`);
        return null;
      }
    }
  }
  return null;
};

// return search results from semantic  - limited to 3 results
// https://api.semanticscholar.org/graph/v1/paper/search?query=<example> (<<) an example query

export async function searchSemanticScholar(query: string, count: number = 3) {
  const doiPapers: any[] = [];
  let offset = 0;
  const pageSize = 10;
  const maxPages = 5;
  let pagesTried = 0;

  await new Promise(resolve => setTimeout(resolve, 2000));

  while (doiPapers.length < count && pagesTried < maxPages) {
    const result = await retryRequest(async () => {
      const response = await semanticScholarAPI.get('/graph/v1/paper/search', {
        params: {
          query,
          limit: pageSize,
          offset,
          fields: 'title,authors,year,venue,abstract,url,citationCount,externalIds',
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.data;
    }, 3, 'Semantic Scholar');

    if (!result) {
      console.warn('Semantic Scholar search failed after retries.');
      break;
    }

    const papers = Array.isArray(result.data) ? result.data : [];

    if (papers.length === 0) {
      console.warn('no more results from Semantic Scholar.');
      break;
    }

    const valid = papers.filter((p: any) => p.externalIds?.DOI);
    console.log(`page ${pagesTried + 1}: ${papers.length} total, ${valid.length} with DOIs`);

    for (const paper of valid) {
      doiPapers.push(paper);
      if (doiPapers.length >= count) {
        console.log(`Found enough papers with DOIs (${doiPapers.length}/${count}). Stopping search immediately.`);
        return doiPapers.slice(0, count);
      }
    }
    
    offset += pageSize;
    pagesTried++;

    if (pagesTried < maxPages && doiPapers.length < count) {
      await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
  }

  // console.log(`total valid papers with DOI: ${doiPapers.length}`);
  return doiPapers.slice(0, count);
}


// return a single paper from Semantic by doi - used in the check citation feature
// https://api.semanticscholar.org/graph/v1/paper/DOI:<doi> (<<) an example get request

export async function getFromSemanticScholar(doi: string) {
  // add delay before individual requests to help with rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return await retryRequest(async () => {
    const encodedDoi = encodeURIComponent(doi);
    const response = await semanticScholarAPI.get(`/graph/v1/paper/DOI:${encodedDoi}`, {
      params: {
        fields: 'title,authors,year,venue,abstract,url,citationCount',
      },
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data;
  }, 4, 'Semantic Scholar'); // increased retries to 4
}

// these are the APIs used to enrich the paper data
// Unpaywall, Crossref, OpenAlex

// return a single paper from Unpaywall by doi
export async function getFromUnpaywall(doi: string) {
  return await retryRequest(async () => {
    const encodedDoi = encodeURIComponent(doi);
    const response = await unpaywallAPI.get(`/v2/${encodedDoi}`, {
      params: { email: user_email },
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data;
  }, 3, 'Unpaywall');
}

// return a single paper from Crossref by doi
export async function getFromCrossref(doi: string) {
  return await retryRequest(async () => {
    const encodedDoi = encodeURIComponent(doi);
    const response = await crossrefAPI.get(`/works/${encodedDoi}`);
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data.message;
  }, 3, 'Crossref');
}

// return a single paper from OpenAlex by doi
export async function getFromOpenAlex(doi: string) {
  return await retryRequest(async () => {
    const encodedDoi = encodeURIComponent(`https://doi.org/${doi}`);
    const response = await openAlexAPI.get(`/works/${encodedDoi}`);
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data;
  }, 3, 'OpenAlex');
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
