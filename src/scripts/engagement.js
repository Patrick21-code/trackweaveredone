/* ================================================================
   =  TrackWeave — Engagement Platform                            =
   =  Connects to shop.html via shared localStorage keys          =
   =  Integrates Firestore for real-time artist community chats   =
   ================================================================ */

import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for Firebase to be initialized
function waitForFirebase() {
  return new Promise((resolve) => {
    if (window._fbDb) {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (window._fbDb) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    }
  });
}

/* ==========================================
   1. SHOP CATALOG MIRROR
   ========================================== */
const SHOP_CATALOG = [
  { id: 'theme-midnight',      icon: '🌙', title: 'Midnight Mode',      category: 'themes'  },
  { id: 'theme-vinyl',         icon: '💿', title: 'Vinyl Warmth',        category: 'themes'  },
  { id: 'theme-neon',          icon: '🔮', title: 'Neon Pulse',          category: 'themes'  },
  { id: 'theme-aurora',        icon: '🌌', title: 'Aurora Borealis',     category: 'themes'  },
  { id: 'avatar-headphones',   icon: '🎧', title: 'Audiophile',          category: 'avatars' },
  { id: 'avatar-vinyl-spinner',icon: '🎼', title: 'Vinyl Spinner',       category: 'avatars' },
  { id: 'avatar-cosmic',       icon: '🪐', title: 'Cosmic Explorer',     category: 'avatars' },
  { id: 'avatar-golden-ear',   icon: '👑', title: 'Golden Ear',          category: 'avatars' },
  { id: 'boost-double-pts',    icon: '⚡', title: '2× Points Weekend',   category: 'boosts'  },
  { id: 'boost-early-access',  icon: '🚀', title: 'Early Access Pass',   category: 'boosts'  },
  { id: 'boost-graph-pro',     icon: '🕸️', title: 'Graph Pro Unlock',    category: 'boosts'  },
  { id: 'boost-spotlight',     icon: '🌟', title: 'Community Spotlight', category: 'boosts'  },
  { id: 'badge-early-adopter', icon: '🌱', title: 'Early Adopter',       category: 'badges'  },
  { id: 'badge-crate-digger',  icon: '📦', title: 'Crate Digger',        category: 'badges'  },
  { id: 'badge-theorist',      icon: '🧠', title: 'Music Theorist',      category: 'badges'  },
  { id: 'badge-legend',        icon: '🎺', title: 'Living Legend',       category: 'badges'  },
];

const CATALOG_MAP = Object.fromEntries(SHOP_CATALOG.map(i => [i.id, i]));

/* ==========================================
   AVATAR UTILITIES
   ========================================== */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function avatarColor(uid) {
  const hue = Math.abs(hashStr(uid)) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

function getAvatarInitial(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}

function renderAvatar(el, { username, photoURL, uid }) {
  if (!el) return;
  if (photoURL) {
    const img = document.createElement('img');
    img.src = photoURL;
    img.alt = username || '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
    img.onerror = () => {
      el.innerHTML = '';
      el.textContent = getAvatarInitial(username);
      el.style.background = uid ? avatarColor(uid) : 'linear-gradient(135deg, var(--blue), #7c3aed)';
    };
    el.innerHTML = '';
    el.appendChild(img);
  } else {
    el.textContent = getAvatarInitial(username);
    el.style.background = uid ? avatarColor(uid) : 'linear-gradient(135deg, var(--blue), #7c3aed)';
  }
}

window._renderAvatar = renderAvatar;

/* ==========================================
   STORAGE KEYS
   ========================================== */
const KEYS = {
  shopOwned:  'tw_owned',
  shopPoints: 'tw_points',
  stats:      'tw_eng_stats',
};

/* ==========================================
   STATE
   ========================================== */
let activeArtist = null;
let unsubscribeComments = null;
let activityLog = [];

/* ==========================================
   USER PROFILE CACHE
   ========================================== */
const userProfileCache = new Map();

async function resolveAuthor(uid, currentUser) {
  if (!uid) return { username: '', photoURL: '' };
  if (currentUser && uid === currentUser.uid) return currentUser;
  if (userProfileCache.has(uid)) return userProfileCache.get(uid);

  try {
    const db = window._fbDb;
    const getDocFn = window._fbGetDoc;
    const docFn = window._fbDoc;
    if (!db || !getDocFn || !docFn) throw new Error('Firebase not ready');

    const snap = await getDocFn(docFn(db, 'users', uid));
    const profile = snap.exists()
      ? { username: snap.data().username ?? '', photoURL: snap.data().photoURL ?? '' }
      : { username: '', photoURL: '' };
    userProfileCache.set(uid, profile);
    return profile;
  } catch {
    const fallback = { username: '', photoURL: '' };
    userProfileCache.set(uid, fallback);
    return fallback;
  }
}

/* ==========================================
   PERSISTENCE HELPERS
   ========================================== */
function loadShopRewards() {
  const raw = localStorage.getItem(KEYS.shopOwned);
  if (!raw) return [];
  const ids = JSON.parse(raw);
  return ids.map(id => CATALOG_MAP[id]).filter(Boolean);
}

function loadStats() {
  const raw = localStorage.getItem(KEYS.stats);
  if (raw) return JSON.parse(raw);
  return { posts: 0, comments: 0, likesGiven: 0, rewardsSent: 0, rewardsReceived: 0 };
}

function saveStats(stats) {
  localStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

/* ==========================================
   RECENT ARTISTS TRACKING
   ========================================== */
const RECENT_ARTISTS_KEY = 'tw_recent_artists';

function loadRecentArtists() {
  try { return JSON.parse(localStorage.getItem(RECENT_ARTISTS_KEY) || '[]'); } catch { return []; }
}

function saveRecentArtist(artist) {
  const list = loadRecentArtists().filter(a => a.id !== artist.id);
  list.unshift({ id: artist.id, name: artist.name, type: artist.type ?? '' });
  localStorage.setItem(RECENT_ARTISTS_KEY, JSON.stringify(list.slice(0, 8)));
}

/* ==========================================
   RENDER FUNCTIONS
   ========================================== */
function renderStats() {
  const stats = loadStats();
  const shopData = loadShopRewards();
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  const items = [
    { n: stats.comments,        l: 'Comments',        highlight: false },
    { n: stats.likesGiven,      l: 'Likes Given',     highlight: false },
    { n: stats.rewardsSent,     l: 'Rewards Sent',    highlight: true  },
    { n: stats.rewardsReceived, l: 'Received',        highlight: false },
    { n: shopData.length,       l: 'Items Owned',     highlight: false },
  ];

  grid.innerHTML = items.map(s => `
    <div class="stat-item${s.highlight ? ' highlight' : ''}">
      <span class="stat-n">${s.n}</span>
      <div class="stat-l">${s.l}</div>
    </div>`).join('');

  const hint = document.getElementById('sidebar-owned-count');
  if (hint) hint.textContent = shopData.length ? `${shopData.length} reward${shopData.length !== 1 ? 's' : ''} owned` : 'No rewards yet — visit shop';
}

function renderActivity() {
  const el = document.getElementById('activity-feed');
  if (!el) return;

  if (!activityLog.length) {
    el.innerHTML = `<div style="color:var(--ink-faint);font-size:.82rem;padding:.5rem 0;">Interact with artists to see activity here.</div>`;
    return;
  }

  el.innerHTML = activityLog.slice(0, 6).map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${a.color || 'var(--paper-warm)'};">${a.icon}</div>
      <div class="activity-text">${a.text}</div>
      <div class="activity-time">${formatTime(a.time)}</div>
    </div>`).join('');
}

function addActivity(icon, color, text) {
  activityLog.unshift({ icon, color, text, time: Date.now() });
  renderActivity();
}

function renderRecentArtistChips() {
  const recent = loadRecentArtists();
  const wrap = document.getElementById('ap-recent-wrap');
  const chips = document.getElementById('ap-recent-chips');
  if (!wrap || !chips) return;

  if (!recent.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';

  chips.innerHTML = recent.map(a => {
    const hue = Math.abs(hashStr(a.id)) % 360;
    const initial = a.name.charAt(0).toUpperCase();
    return `
      <button class="ap-recent-chip" onclick="window.selectArtist(${JSON.stringify({id:a.id,name:a.name,type:a.type||''}).replace(/"/g,'&quot;')})">
        <span class="ap-chip-dot" style="background:hsl(${hue},60%,44%);">${initial}</span>
        ${escapeHtml(a.name)}
      </button>`;
  }).join('');
}

/* ==========================================
   ARTIST SEARCH (MusicBrainz)
   ========================================== */
async function searchArtistMB() {
  const query = document.getElementById('artist-search-input')?.value.trim();
  if (!query) return;

  const wrap = document.getElementById('ap-results-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="ap-loading">Searching MusicBrainz…</div>';

  try {
    await new Promise(r => setTimeout(r, 300));
    const url = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&limit=6&fmt=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TrackWeave/1.0 (hello@trackweave.app)' } });
    if (!res.ok) throw new Error('MB error');
    const json = await res.json();
    const artists = json.artists ?? [];

    if (!artists.length) {
      wrap.innerHTML = '<div class="ap-empty">No artists found. Try a different name.</div>';
      return;
    }

    const results = document.createElement('div');
    results.className = 'ap-results';
    results.innerHTML = artists.map(a => {
      const hue = Math.abs(hashStr(a.id)) % 360;
      const initial = (a.name || '?').charAt(0).toUpperCase();
      const type = a.type ?? '';
      const country = a.country ? ` · ${a.country}` : '';
      const tags = (a.tags ?? []).slice(0, 2).map(t => t.name).join(', ');
      const meta = [type, country, tags].filter(Boolean).join('');
      const artistJson = JSON.stringify({id:a.id, name:a.name, type}).replace(/"/g,'&quot;');
      return `
        <div class="ap-result-item" onclick="window.selectArtist(${artistJson})">
          <div class="ap-result-avatar" style="background:hsl(${hue},60%,44%);">${initial}</div>
          <div class="ap-result-info">
            <div class="ap-result-name">${escapeHtml(a.name)}</div>
            <div class="ap-result-meta">${escapeHtml(meta)}</div>
          </div>
        </div>`;
    }).join('');

    wrap.innerHTML = '';
    wrap.appendChild(results);
  } catch (e) {
    wrap.innerHTML = '<div class="ap-empty">Search failed. Check your connection and try again.</div>';
  }
}

/* ==========================================
   ARTIST SELECTION & FIRESTORE INTEGRATION
   ========================================== */
async function selectArtist(artist) {
  console.log('Selecting artist:', artist);
  
  // Unsubscribe from previous artist's comments
  if (unsubscribeComments) {
    console.log('Unsubscribing from previous artist comments');
    unsubscribeComments();
    unsubscribeComments = null;
  }

  activeArtist = artist;
  saveRecentArtist(artist);

  // Update UI
  const hue = Math.abs(hashStr(artist.id)) % 360;
  const initial = artist.name.charAt(0).toUpperCase();
  const adpAv = document.getElementById('adp-avatar');
  if (adpAv) { adpAv.textContent = initial; adpAv.style.background = `hsl(${hue},60%,44%)`; }
  const adpName = document.getElementById('adp-artist-name');
  if (adpName) adpName.textContent = artist.name;
  const adpMeta = document.getElementById('adp-meta');
  if (adpMeta) adpMeta.textContent = `${artist.name} Community Chat`;

  // Set compose avatar
  const cu = window._currentUser;
  const adpUserAv = document.getElementById('adp-user-avatar');
  if (adpUserAv && cu) {
    console.log('Rendering user avatar for:', cu.username);
    renderAvatar(adpUserAv, { username: cu.username, photoURL: cu.photoURL, uid: cu.uid });
  }

  // Clear input
  const input = document.getElementById('adp-comment-input');
  if (input) input.value = '';

  // Show artist panel
  document.getElementById('artist-picker-card').style.display = 'none';
  document.getElementById('artist-discussion-panel').style.display = '';

  // Subscribe to Firestore comments for this artist
  console.log('About to subscribe to comments');
  subscribeToArtistComments(artist.id);
}

function subscribeToArtistComments(artistId) {
  const db = window._fbDb;
  if (!db) {
    console.error('Firestore not initialized');
    showToast('Database not ready', 'error');
    return;
  }

  console.log('Subscribing to comments for artist:', artistId);

  try {
    const commentsRef = collection(db, 'artistComments', artistId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    unsubscribeComments = onSnapshot(q, async (snapshot) => {
      console.log('Received snapshot with', snapshot.size, 'comments');
      const comments = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        console.log('Comment data:', docSnap.id, data);
        comments.push({ id: docSnap.id, ...data });
      });
      await renderArtistComments(comments);
    }, (error) => {
      console.error('Error fetching comments:', error);
      console.error('Error details:', error.message, error.code);
      
      // Show empty state instead of error for permission issues
      if (error.code === 'permission-denied') {
        const list = document.getElementById('adp-comments-list');
        if (list && activeArtist) {
          list.innerHTML = `
            <div class="artist-comment-empty">
              <div class="ace-icon">🎵</div>
              <div>No comments yet for <strong>${escapeHtml(activeArtist.name)}</strong>.<br>Be the first to share your thoughts!</div>
            </div>`;
        }
      } else {
        showToast('Failed to load comments', 'error');
      }
    });
  } catch (error) {
    console.error('Error setting up comments listener:', error);
    console.error('Error details:', error.message);
    showToast('Failed to initialize comments', 'error');
  }
}

async function renderArtistComments(comments) {
  if (!activeArtist) {
    console.warn('renderArtistComments called but no active artist');
    return;
  }
  
  const list = document.getElementById('adp-comments-list');
  if (!list) {
    console.error('Comments list element not found');
    return;
  }

  const cu = window._currentUser;
  console.log('Rendering', comments.length, 'comments for', activeArtist.name);

  if (!comments.length) {
    list.innerHTML = `
      <div class="artist-comment-empty">
        <div class="ace-icon">🎵</div>
        <div>No comments yet for <strong>${escapeHtml(activeArtist.name)}</strong>.<br>Be the first to share your thoughts!</div>
      </div>`;
    return;
  }

  list.innerHTML = '';
  for (const comment of comments) {
    try {
      const el = await buildArtistCommentElement(comment, cu);
      list.appendChild(el);
    } catch (error) {
      console.error('Error building comment element:', error, comment);
    }
  }
  
  console.log('Finished rendering comments');
}

async function buildArtistCommentElement(comment, cu) {
  const author = await resolveAuthor(comment.authorId, cu);
  const username = author.username || '';
  const handle = username ? `@${username}` : 'Anonymous';
  const initial = getAvatarInitial(username);
  const color = avatarColor(comment.authorId);
  const isLiked = cu && comment.likes ? comment.likes.includes(cu.uid) : false;
  const likeCount = comment.likes ? comment.likes.length : 0;
  const timeAgo = formatTime(comment.createdAt?.toMillis ? comment.createdAt.toMillis() : Date.now());

  const el = document.createElement('div');
  el.className = 'comment';
  el.id = `acomment-${comment.id}`;
  el.innerHTML = `
    <div class="comment-avatar" style="background:${color};">${initial}</div>
    <div class="comment-body">
      <div class="comment-bubble">
        <div class="comment-author">${escapeHtml(handle)} <span style="font-weight:300;color:var(--ink-faint);font-size:.72rem;">${timeAgo}</span></div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      </div>
      <div class="comment-actions">
        <button class="comment-action-btn${isLiked ? ' liked' : ''}" onclick="window.toggleArtistCommentLike('${comment.id}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${likeCount} Like${likeCount !== 1 ? 's' : ''}
        </button>
      </div>
    </div>`;

  const avatarEl = el.querySelector('.comment-avatar');
  if (avatarEl) renderAvatar(avatarEl, { username, photoURL: author.photoURL, uid: comment.authorId });

  return el;
}

/* ==========================================
   COMMENT SUBMISSION
   ========================================== */
async function submitArtistComment() {
  if (!activeArtist) {
    console.error('No active artist selected');
    showToast('Please select an artist first', 'error');
    return;
  }
  
  const cu = window._currentUser;
  if (!cu) {
    console.error('No current user');
    showToast('You must be logged in to comment', 'error');
    return;
  }
  
  const input = document.getElementById('adp-comment-input');
  const text = input?.value.trim();
  if (!text) { 
    showToast('Write something first!', 'error'); 
    return; 
  }

  const db = window._fbDb;
  if (!db) { 
    console.error('Firestore not initialized');
    showToast('Database not ready', 'error'); 
    return; 
  }

  console.log('Submitting comment for artist:', activeArtist.name, 'by user:', cu.username);

  // Disable input while submitting
  input.disabled = true;
  const submitBtn = input.parentElement.querySelector('.btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
  }

  try {
    const commentsRef = collection(db, 'artistComments', activeArtist.id, 'comments');
    const newComment = {
      artistId: activeArtist.id,
      authorId: cu.uid,
      text,
      createdAt: serverTimestamp(),
      likes: [],
    };
    
    console.log('Adding comment to Firestore:', newComment);
    const docRef = await addDoc(commentsRef, newComment);
    console.log('Comment added successfully with ID:', docRef.id);

    input.value = '';
    const stats = loadStats();
    stats.comments++;
    saveStats(stats);
    renderStats();
    addActivity('🎵', '#bfdbfe', `You commented on <strong>${escapeHtml(activeArtist.name)}</strong>.`);
    showToast('Comment posted! 🎵', 'success');
  } catch (error) {
    console.error('Error posting comment:', error);
    console.error('Error details:', error.message, error.code);
    
    if (error.code === 'permission-denied') {
      showToast('You do not have permission to post comments', 'error');
    } else {
      showToast('Failed to post comment. Please try again.', 'error');
    }
  } finally {
    // Re-enable input
    input.disabled = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post';
    }
  }
}

async function toggleArtistCommentLike(commentId) {
  if (!activeArtist) return;
  const cu = window._currentUser;
  if (!cu) return;

  const db = window._fbDb;
  if (!db) return;

  try {
    const commentRef = doc(db, 'artistComments', activeArtist.id, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) return;

    const likes = commentSnap.data().likes || [];
    const isLiked = likes.includes(cu.uid);

    if (isLiked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(cu.uid)
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(cu.uid)
      });
      addActivity('♥', '#fee2e2', `You liked a comment on <strong>${escapeHtml(activeArtist.name)}</strong>.`);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    showToast('Failed to update like', 'error');
  }
}

function closeArtistPanel() {
  if (unsubscribeComments) {
    unsubscribeComments();
    unsubscribeComments = null;
  }
  activeArtist = null;
  document.getElementById('artist-picker-card').style.display = '';
  document.getElementById('artist-discussion-panel').style.display = 'none';
  renderRecentArtistChips();
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icon = type === 'reward' ? '🎁' : type === 'error' ? '✕' : '✓';
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toast-out .25s ease both';
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, 3200);
}

/* ==========================================
   URL PARAMETER HANDLING
   ========================================== */
function checkArtistUrlParam() {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get('artist');
  const artistName = params.get('artistName');
  const artistType = params.get('artistType') || '';
  if (artistId && artistName) {
    selectArtist({ id: artistId, name: decodeURIComponent(artistName), type: artistType });
  }
}

/* ==========================================
   INITIALIZATION
   ========================================== */
window._engagementInit = async function() {
  // Wait for Firebase to be ready
  await waitForFirebase();
  
  if (!localStorage.getItem(KEYS.shopPoints)) {
    localStorage.setItem(KEYS.shopPoints, '1250');
  }

  const cu = window._currentUser;

  const composeAvatar = document.getElementById('current-user-avatar');
  if (composeAvatar && cu) {
    renderAvatar(composeAvatar, { username: cu.username, photoURL: cu.photoURL, uid: cu.uid });
  }

  const sidebarUsername = document.getElementById('sidebar-username');
  const sidebarHandle = document.getElementById('sidebar-handle');
  if (sidebarUsername && cu) {
    sidebarUsername.textContent = cu.username ? `@${cu.username}` : (cu.email || 'You');
  }
  if (sidebarHandle && cu) {
    sidebarHandle.textContent = cu.username ? `@${cu.username} · TrackWeave member` : 'TrackWeave member';
  }

  renderStats();
  renderActivity();
  renderRecentArtistChips();
  checkArtistUrlParam();
};

// Expose functions globally
window.searchArtistMB = searchArtistMB;
window.selectArtist = selectArtist;
window.closeArtistPanel = closeArtistPanel;
window.submitArtistComment = submitArtistComment;
window.toggleArtistCommentLike = toggleArtistCommentLike;

// Avatar dropdown toggle
(function wireDropdown() {
  const wrap = document.getElementById('nav-avatar-wrap');
  const avBtn = document.getElementById('nav-avatar');
  if (!wrap || !avBtn) return;

  avBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = wrap.classList.toggle('open');
    avBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('open');
      avBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      wrap.classList.remove('open');
      avBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();
