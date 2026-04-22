/* ═══════════════════════════════════════════════════════════
   TrackWeave — MusicBrainz Data Enrichment Module
   Fetches and caches artist data from MusicBrainz API
   ═══════════════════════════════════════════════════════════ */

// Rate limiting for MusicBrainz API (1 request per second)
let _lastMbReq = 0;
async function mbFetch(url) {
  const now = Date.now();
  const wait = Math.max(0, 1050 - (now - _lastMbReq));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  _lastMbReq = Date.now();
  return fetch(url, { 
    headers: { "User-Agent": "TrackWeave/1.0 (hello@trackweave.app)" } 
  });
}

// Cache for artist data (in-memory + localStorage)
const artistCache = new Map();
const CACHE_KEY = 'tw_mb_cache';
const CACHE_VERSION = 'v1';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Load cache from localStorage on init
function loadCacheFromStorage() {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const { version, timestamp, data } = JSON.parse(stored);
      if (version === CACHE_VERSION && Date.now() - timestamp < CACHE_EXPIRY) {
        Object.entries(data).forEach(([mbid, artistData]) => {
          artistCache.set(mbid, artistData);
        });
        console.log(`[MB] Loaded ${artistCache.size} artists from cache`);
      }
    }
  } catch (e) {
    console.warn('[MB] Failed to load cache from storage:', e);
  }
}

// Save cache to localStorage
function saveCacheToStorage() {
  try {
    const data = {};
    artistCache.forEach((value, key) => {
      data[key] = value;
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    }));
  } catch (e) {
    console.warn('[MB] Failed to save cache to storage:', e);
  }
}

// Initialize cache
loadCacheFromStorage();

/**
 * Fetch complete artist data from MusicBrainz
 * @param {string} mbid - MusicBrainz ID
 * @returns {Promise<Object|null>} Artist data or null
 */
export async function fetchArtistData(mbid) {
  // Check cache first
  if (artistCache.has(mbid)) {
    return artistCache.get(mbid);
  }

  try {
    const res = await mbFetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?inc=tags+genres+url-rels&fmt=json`
    );
    
    if (!res.ok) {
      console.warn(`[MB] Failed to fetch artist ${mbid}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    
    // Cache the result
    artistCache.set(mbid, data);
    
    // Save to localStorage periodically
    if (artistCache.size % 5 === 0) {
      saveCacheToStorage();
    }
    
    return data;
  } catch (e) {
    console.error(`[MB] Error fetching artist ${mbid}:`, e);
    return null;
  }
}

/**
 * Enrich artist object with MusicBrainz data
 * @param {Object} artist - Basic artist object with mbid
 * @returns {Promise<Object>} Enriched artist object
 */
export async function enrichArtistData(artist) {
  if (!artist.mbid) return artist;

  const mbData = await fetchArtistData(artist.mbid);
  if (!mbData) return artist;

  // Merge MusicBrainz data with existing artist data
  return {
    ...artist,
    id: artist.mbid, // Use MBID as primary ID
    type: mbData.type,
    country: mbData.country || mbData.area?.name,
    "life-span": mbData["life-span"],
    disambiguation: mbData.disambiguation,
    tags: mbData.tags || [],
    genres: mbData.genres || [],
    _mbData: mbData // Store full MB data for reference
  };
}

/**
 * Batch enrich multiple artists with parallel processing
 * @param {Array} artists - Array of artist objects
 * @param {number} batchSize - Number of concurrent requests (default: 3)
 * @returns {Promise<Array>} Array of enriched artists
 */
export async function enrichArtists(artists, batchSize = 3) {
  const enriched = [];
  
  // Process in batches to respect rate limits while improving speed
  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(artist => enrichArtistData(artist))
    );
    enriched.push(...batchResults);
  }
  
  return enriched;
}

/**
 * Genre mapping from MusicBrainz tags/genres to TrackWeave categories
 */
const GENRE_MAP = {
  // Pop
  'pop': 'Pop',
  'pop music': 'Pop',
  'pop rock': 'Pop',
  'electropop': 'Pop',
  'synth-pop': 'Pop',
  'dance-pop': 'Pop',
  'teen pop': 'Pop',
  'art pop': 'Pop',
  'indie pop': 'Pop',
  'power pop': 'Pop',
  
  // Hip-Hop / Rap
  'hip hop': 'Hip-Hop',
  'hip-hop': 'Hip-Hop',
  'rap': 'Hip-Hop',
  'trap': 'Hip-Hop',
  'gangsta rap': 'Hip-Hop',
  'conscious hip hop': 'Hip-Hop',
  'southern hip hop': 'Hip-Hop',
  'west coast hip hop': 'Hip-Hop',
  'east coast hip hop': 'Hip-Hop',
  'alternative hip hop': 'Hip-Hop',
  
  // R&B / Soul
  'r&b': 'R&B',
  'rnb': 'R&B',
  'rhythm and blues': 'R&B',
  'contemporary r&b': 'R&B',
  'soul': 'R&B',
  'neo soul': 'R&B',
  'neo-soul': 'R&B',
  'funk': 'R&B',
  
  // Rock
  'rock': 'Rock',
  'alternative rock': 'Rock',
  'indie rock': 'Rock',
  'hard rock': 'Rock',
  'soft rock': 'Rock',
  'classic rock': 'Rock',
  'punk rock': 'Rock',
  'folk rock': 'Rock',
  
  // Electronic / Dance
  'electronic': 'Electronic',
  'edm': 'Electronic',
  'house': 'Electronic',
  'techno': 'Electronic',
  'dubstep': 'Electronic',
  'drum and bass': 'Electronic',
  'trance': 'Electronic',
  'electro': 'Electronic',
  
  // K-Pop
  'k-pop': 'K-Pop',
  'kpop': 'K-Pop',
  'korean pop': 'K-Pop',
  'k pop': 'K-Pop',
  
  // Country
  'country': 'Country',
  'country pop': 'Country',
  'contemporary country': 'Country',
  
  // Alternative
  'alternative': 'Alternative',
  'indie': 'Alternative',
  'experimental': 'Alternative',
  'art rock': 'Alternative',
  
  // Jazz
  'jazz': 'Jazz',
  'smooth jazz': 'Jazz',
  'jazz fusion': 'Jazz',
  
  // Latin
  'latin': 'Latin',
  'reggaeton': 'Latin',
  'latin pop': 'Latin',
  'salsa': 'Latin',
  
  // Dance
  'dance': 'Dance',
  'dance pop': 'Pop',
  'eurodance': 'Dance'
};

/**
 * Get primary genre from MusicBrainz tags/genres and map to TrackWeave categories
 * @param {Object} mbData - MusicBrainz artist data
 * @param {string} artistName - Artist name for better genre inference
 * @returns {string} Primary genre category
 */
export function getPrimaryGenre(mbData, artistName = '') {
  if (!mbData) {
    // Fallback genre inference based on artist name if no MB data
    return inferGenreFromName(artistName);
  }
  
  const allTags = [];
  
  // Collect genres (higher priority)
  if (mbData.genres && mbData.genres.length > 0) {
    mbData.genres.forEach(g => {
      allTags.push({ name: g.name, count: (g.count || 0) * 2 }); // Weight genres higher
    });
  }
  
  // Collect tags
  if (mbData.tags && mbData.tags.length > 0) {
    const filtered = mbData.tags.filter(t => {
      const name = t.name.toLowerCase();
      return !name.includes('seen live') && 
             !name.includes('favorite') &&
             !name.includes('albums i own') &&
             !name.includes('female vocalist') &&
             !name.includes('male vocalist');
    });
    allTags.push(...filtered);
  }
  
  // Sort by count
  allTags.sort((a, b) => (b.count || 0) - (a.count || 0));
  
  // Try to map to TrackWeave categories
  for (const tag of allTags) {
    const normalized = tag.name.toLowerCase().trim();
    if (GENRE_MAP[normalized]) {
      return GENRE_MAP[normalized];
    }
  }
  
  // If no mapping found, try to infer from artist name or return most popular tag
  if (allTags.length > 0) {
    const topTag = allTags[0].name;
    // Capitalize first letter of each word
    return topTag.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return inferGenreFromName(artistName);
}

/**
 * Infer genre from artist name as fallback
 * @param {string} artistName - Artist name
 * @returns {string} Inferred genre
 */
function inferGenreFromName(artistName) {
  const name = artistName.toLowerCase();
  
  // Known artist-to-genre mappings
  const artistGenreMap = {
    'bts': 'K-Pop',
    'taylor swift': 'Pop',
    'kendrick lamar': 'Hip-Hop',
    'ariana grande': 'Pop',
    'beyoncé': 'R&B',
    'beyonce': 'R&B',
    'billie eilish': 'Pop',
    'cardi b': 'Hip-Hop',
    'charlie puth': 'Pop',
    'coldplay': 'Rock',
    'drake': 'Hip-Hop',
    'dua lipa': 'Pop',
    'ed sheeran': 'Pop',
    'eminem': 'Hip-Hop',
    'justin bieber': 'Pop',
    'katy perry': 'Pop',
    'khalid': 'R&B',
    'lady gaga': 'Pop',
    'maroon 5': 'Pop',
    'nicki minaj': 'Hip-Hop',
    'post malone': 'Hip-Hop',
    'rihanna': 'R&B',
    'selena gomez': 'Pop'
  };
  
  return artistGenreMap[name] || 'Pop';
}

/**
 * Clear the artist cache
 */
export function clearCache() {
  artistCache.clear();
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('[MB] Failed to clear cache from storage:', e);
  }
}

/**
 * Get cache size
 * @returns {number} Number of cached artists
 */
export function getCacheSize() {
  return artistCache.size;
}

/**
 * Fetch artist image URL from MusicBrainz relations or Cover Art Archive
 * @param {string} mbid - MusicBrainz ID
 * @param {Object} mbData - MusicBrainz artist data (optional, to avoid extra fetch)
 * @returns {Promise<string|null>} Image URL or null
 */
export async function fetchArtistImage(mbid, mbData = null) {
  try {
    // Use provided data or fetch it
    const data = mbData || await fetchArtistData(mbid);
    if (!data) return null;

    // Try to find image in relations
    if (data.relations) {
      // Look for official website, social media, or image links
      const imageRels = data.relations.filter(rel => 
        rel.type === 'image' || 
        rel.type === 'logo' ||
        rel.type === 'official homepage' ||
        rel.type === 'social network'
      );
      
      // For now, we'll use a placeholder approach
      // In production, you'd integrate with services like Fanart.tv or Last.fm
    }

    // Try Cover Art Archive for release group images
    // This requires finding the artist's release groups first
    const releaseRes = await mbFetch(
      `https://musicbrainz.org/ws/2/release-group?artist=${mbid}&limit=1&fmt=json`
    );
    
    if (releaseRes.ok) {
      const releaseData = await releaseRes.json();
      if (releaseData['release-groups']?.length > 0) {
        const rgid = releaseData['release-groups'][0].id;
        const coverUrl = `https://coverartarchive.org/release-group/${rgid}/front-250`;
        
        // Check if cover exists
        const coverRes = await fetch(coverUrl, { method: 'HEAD' });
        if (coverRes.ok) {
          return coverUrl;
        }
      }
    }
  } catch (e) {
    console.warn(`[MB] Could not fetch image for ${mbid}:`, e);
  }
  
  return null;
}

/**
 * Enrich artist with image data
 * @param {Object} artist - Artist object with mbData
 * @returns {Promise<Object>} Artist with image URL
 */
export async function enrichArtistWithImage(artist) {
  if (!artist._mbData) return artist;
  
  const imageUrl = await fetchArtistImage(artist.mbid, artist._mbData);
  return {
    ...artist,
    imageUrl
  };
}
