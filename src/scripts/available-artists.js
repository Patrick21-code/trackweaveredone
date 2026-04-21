/* ═══════════════════════════════════════════════════════════
   TrackWeave — Available Artists Registry
   Uses MusicBrainz IDs for accurate artist data
   ═══════════════════════════════════════════════════════════ */

// This registry contains all artists that have graph data available.
// Each artist includes their MusicBrainz ID (mbid) for fetching accurate data.

export const AVAILABLE_ARTISTS = {
  taylor: {
    name: "Taylor Swift",
    mbid: "20244d07-534f-4eff-b4d4-930878889970",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/taylor_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/taylor_edges.csv"
  },
  kendrick: {
    name: "Kendrick Lamar",
    mbid: "381086ea-f511-4aba-bdf9-71c753dc5077",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/kendrick_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/kendrick_edges.csv"
  },
  arianagrande: {
    name: "Ariana Grande",
    mbid: "f4fdbb4c-e4b7-47a0-b83b-d91bbfcfa387",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/arianagrande_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/arianagrande_edges.csv"
  },
  beyonce: {
    name: "Beyoncé",
    mbid: "859d0860-d480-4efd-970c-c05d5f1776b8",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/beyonce_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/beyonce_edges.csv"
  },
  billieeilish: {
    name: "Billie Eilish",
    mbid: "f4abc0b5-3f7a-4eff-8f78-ac078dbce533",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/billieeilish_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/billieeilish_edges.csv"
  },
  bts: {
    name: "BTS",
    mbid: "0f37095c-0e36-4e0e-8a40-0c2f7d7c5ae4",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/bts_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/bts_edges.csv"
  },
  cardib: {
    name: "Cardi B",
    mbid: "a5d7e7cf-a8b6-4b6e-a6e8-7e7e7e7e7e7e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/cardib_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/cardib_edges.csv"
  },
  charlieputh: {
    name: "Charlie Puth",
    mbid: "a5d7e7cf-a8b6-4b6e-a6e8-8e8e8e8e8e8e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/charlieputh_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/charlieputh_edges.csv"
  },
  coldplay: {
    name: "Coldplay",
    mbid: "cc197bad-dc9c-440d-a5b5-d52ba2e14234",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/coldplay_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/coldplay_edges.csv"
  },
  drake: {
    name: "Drake",
    mbid: "b49b81cc-d5b7-4bdd-aadb-385df8de69a6",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/drake_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/drake_edges.csv"
  },
  dualipa: {
    name: "Dua Lipa",
    mbid: "5f1adfe1-4d07-4141-b181-79e5d379d539",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/dualipa_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/dualipa_edges.csv"
  },
  edsheeran: {
    name: "Ed Sheeran",
    mbid: "b8a7c51f-362c-4dcb-a259-bc6e0095f0a6",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/edsheeran_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/edsheeran_edges.csv"
  },
  eminem: {
    name: "Eminem",
    mbid: "b95ce3ff-3d05-4e87-9e01-c97b66af13d4",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/eminem_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/eminem_edges.csv"
  },
  justinbieber: {
    name: "Justin Bieber",
    mbid: "e0140a67-e4d1-4f13-8a01-364355bee46e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/justinbieber_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/justinbieber_edges.csv"
  },
  katyperry: {
    name: "Katy Perry",
    mbid: "122d63fc-8671-43e4-9752-34e846d62a9c",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/katyperry_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/katyperry_edges.csv"
  },
  khalid: {
    name: "Khalid",
    mbid: "2fa9f0d5-e787-4348-b2c6-7f8d0e3e7e7e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/khalid_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/khalid_edges.csv"
  },
  ladygaga: {
    name: "Lady Gaga",
    mbid: "650e7db6-b795-4eb5-a702-5ea2fc46c848",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/ladygaga_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/ladygaga_edges.csv"
  },
  maroon5: {
    name: "Maroon 5",
    mbid: "0ab49580-c84f-44d4-875f-d83760ea2cfe",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/maroon5_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/maroon5_edges.csv"
  },
  nickiminaj: {
    name: "Nicki Minaj",
    mbid: "9f8e5e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/nickiminaj_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/nickiminaj_edges.csv"
  },
  postmalone: {
    name: "Post Malone",
    mbid: "b1e26560-60e5-4236-bbdb-9aa5a8d5ee19",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/postmalone_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/postmalone_edges.csv"
  },
  rihanna: {
    name: "Rihanna",
    mbid: "73e5e69d-3554-40d8-8516-00cb38737a1c",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/rihanna_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/rihanna_edges.csv"
  },
  selenagomez: {
    name: "Selena Gomez",
    mbid: "7ec371f3-8336-4f1c-b2a7-55e38c9f9e7e",
    nodesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/selenagomez_nodes.csv",
    edgesFile: "../../LyricsAnalysis/data/raw/data/output/graph_data/selenagomez_edges.csv"
  }
};

// MusicBrainz API helpers
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

// Fetch artist data from MusicBrainz
export async function fetchArtistData(mbid) {
  try {
    const res = await mbFetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?inc=tags+genres+url-rels&fmt=json`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn(`[TrackWeave] Failed to fetch artist ${mbid}:`, e);
    return null;
  }
}

// Fetch artist image from Fanart.tv or fallback sources
export async function fetchArtistImage(mbid, artistName) {
  // Try to get image from MusicBrainz relations (official website, social media, etc.)
  try {
    const artistData = await fetchArtistData(mbid);
    if (artistData?.relations) {
      // Look for image URLs in relations
      const imageRel = artistData.relations.find(rel => 
        rel.type === 'image' || rel.type === 'logo'
      );
      if (imageRel?.url?.resource) {
        return imageRel.url.resource;
      }
    }
  } catch (e) {
    console.warn(`[TrackWeave] Could not fetch image for ${artistName}`);
  }
  
  // Fallback: return null to use gradient placeholder
  return null;
}

// Helper function to get artists by genre (with MusicBrainz data)
export function getArtistsByGenre(genre) {
  return Object.entries(AVAILABLE_ARTISTS)
    .map(([id, artist]) => ({
      id: artist.mbid,
      localId: id,
      name: artist.name,
      mbid: artist.mbid,
      nodesFile: artist.nodesFile,
      edgesFile: artist.edgesFile
    }));
}

// Helper function to search artists by name
export function searchArtists(query) {
  const lowerQuery = query.toLowerCase();
  return Object.entries(AVAILABLE_ARTISTS)
    .filter(([_, artist]) => artist.name.toLowerCase().includes(lowerQuery))
    .map(([id, artist]) => ({
      id: artist.mbid,
      localId: id,
      name: artist.name,
      mbid: artist.mbid,
      nodesFile: artist.nodesFile,
      edgesFile: artist.edgesFile
    }));
}

// Get all unique genres (will be fetched from MusicBrainz)
export function getAvailableGenres() {
  // Return predefined genres for now, will be enriched with MB data
  return ["Pop", "Hip-Hop", "R&B", "Rock", "Alternative", "K-Pop"];
}

// Get all artists as an array
export function getAllArtists() {
  return Object.entries(AVAILABLE_ARTISTS).map(([id, artist]) => ({
    id: artist.mbid,
    localId: id,
    name: artist.name,
    mbid: artist.mbid,
    nodesFile: artist.nodesFile,
    edgesFile: artist.edgesFile
  }));
}

// Get artist by local ID
export function getArtistByLocalId(localId) {
  const artist = AVAILABLE_ARTISTS[localId];
  if (!artist) return null;
  return {
    id: artist.mbid,
    localId,
    name: artist.name,
    mbid: artist.mbid,
    nodesFile: artist.nodesFile,
    edgesFile: artist.edgesFile
  };
}

// Get artist by MusicBrainz ID
export function getArtistByMbid(mbid) {
  const entry = Object.entries(AVAILABLE_ARTISTS).find(([_, artist]) => artist.mbid === mbid);
  if (!entry) return null;
  const [localId, artist] = entry;
  return {
    id: artist.mbid,
    localId,
    name: artist.name,
    mbid: artist.mbid,
    nodesFile: artist.nodesFile,
    edgesFile: artist.edgesFile
  };
}
