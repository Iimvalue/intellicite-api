import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const user_email = process.env.USER_EMAIL || '';
if (!user_email) {
  throw new Error('USER_EMAIL is not set in .env for Unpaywall API');
}

// return search results from semantic  - limited to 3 results
// https://api.semanticscholar.org/graph/v1/paper/search?query=<example> (<<) an example query

export async function searchSemanticScholar(query: string, limit = 3) {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search`;
    const response = await axios.get(url, {
      params: {
        query,
        limit,
        fields: 'title,authors,year,venue,abstract,url,citationCount,externalIds',
      },
    });

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error: any) {
    console.warn('Semantic Scholar Search error:', error.message);
    return [];
  }
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
