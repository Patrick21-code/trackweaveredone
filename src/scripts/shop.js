/* ═══════════════════════════════════════════════════════════
   TrackWeave — Reward Shop
   Data → Render → Purchase → Persist
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────
   1. CATALOG DATA
   Items: id, category, icon, title, desc, cost, rarity
   ────────────────────────────────────── */
const CATALOG = [
  // ── THEMES ──────────────────────────────────────
  {
    id: 'theme-midnight',
    category: 'themes',
    icon: '🌙',
    title: 'Midnight Mode',
    desc: 'A deep navy dark theme that transforms your entire dashboard into a late-night listening session.',
    cost: 300,
    rarity: 'common',
  },
  {
    id: 'theme-vinyl',
    category: 'themes',
    icon: '💿',
    title: 'Vinyl Warmth',
    desc: 'Warm sepia tones and paper textures inspired by the golden age of record collecting.',
    cost: 450,
    rarity: 'rare',
  },
  {
    id: 'theme-neon',
    category: 'themes',
    icon: '🔮',
    title: 'Neon Pulse',
    desc: 'Electric neon accents on dark backgrounds — built for the after-hours listener.',
    cost: 600,
    rarity: 'epic',
  },
  {
    id: 'theme-aurora',
    category: 'themes',
    icon: '🌌',
    title: 'Aurora Borealis',
    desc: 'Shifting gradient backgrounds inspired by the northern lights. Ultra-rare animated theme.',
    cost: 1200,
    rarity: 'legend',
  },

  // ── AVATARS ──────────────────────────────────────
  {
    id: 'avatar-headphones',
    category: 'avatars',
    icon: '🎧',
    title: 'Audiophile',
    desc: 'Show the world you take your listening seriously with this iconic headphones avatar frame.',
    cost: 150,
    rarity: 'common',
  },
  {
    id: 'avatar-vinyl-spinner',
    category: 'avatars',
    icon: '🎼',
    title: 'Vinyl Spinner',
    desc: 'A spinning record animation rings your profile picture. Smooth, satisfying, iconic.',
    cost: 400,
    rarity: 'rare',
  },
  {
    id: 'avatar-cosmic',
    category: 'avatars',
    icon: '🪐',
    title: 'Cosmic Explorer',
    desc: 'A glowing galactic halo frames your avatar — reserved for those who explore every genre.',
    cost: 750,
    rarity: 'epic',
  },
  {
    id: 'avatar-golden-ear',
    category: 'avatars',
    icon: '👑',
    title: 'Golden Ear',
    desc: 'The legendary golden crown avatar badge. Only the most dedicated collectors can wear this.',
    cost: 2000,
    rarity: 'legend',
  },

  // ── BOOSTS ───────────────────────────────────────
  {
    id: 'boost-double-pts',
    category: 'boosts',
    icon: '⚡',
    title: '2× Points Weekend',
    desc: 'Double all point earnings for 48 hours. Stack your reviews and log albums for maximum gain.',
    cost: 200,
    rarity: 'common',
  },
  {
    id: 'boost-early-access',
    category: 'boosts',
    icon: '🚀',
    title: 'Early Access Pass',
    desc: 'Get first access to new TrackWeave features before they roll out to the public. 30-day pass.',
    cost: 500,
    rarity: 'rare',
  },
  {
    id: 'boost-graph-pro',
    category: 'boosts',
    icon: '🕸️',
    title: 'Graph Pro Unlock',
    desc: 'Unlock advanced graph analytics: sentiment timelines, lyrical heatmaps, and theme clustering.',
    cost: 850,
    rarity: 'epic',
  },
  {
    id: 'boost-spotlight',
    category: 'boosts',
    icon: '🌟',
    title: 'Community Spotlight',
    desc: 'Get your reviews pinned in the community feed for 7 days. Maximum visibility for your insights.',
    cost: 650,
    rarity: 'rare',
  },

  // ── BADGES ───────────────────────────────────────
  {
    id: 'badge-early-adopter',
    category: 'badges',
    icon: '🌱',
    title: 'Early Adopter',
    desc: 'A commemorative badge for users who joined TrackWeave in its founding year.',
    cost: 0,
    rarity: 'rare',
  },
  {
    id: 'badge-crate-digger',
    category: 'badges',
    icon: '📦',
    title: 'Crate Digger',
    desc: 'Awarded to collectors who have logged over 200 albums. Wear it with pride.',
    cost: 350,
    rarity: 'rare',
  },
  {
    id: 'badge-theorist',
    category: 'badges',
    icon: '🧠',
    title: 'Music Theorist',
    desc: 'Badge for writing 10+ in-depth reviews with NLP theme annotations.',
    cost: 550,
    rarity: 'epic',
  },
  {
    id: 'badge-legend',
    category: 'badges',
    icon: '🎺',
    title: 'Living Legend',
    desc: 'The ultimate badge. Unlocking this cements your status in the TrackWeave hall of fame.',
    cost: 5000,
    rarity: 'legend',
  },
];

const RARITY_LABEL = {
  common: 'Common', rare: 'Rare', epic: 'Epic', legend: 'Legendary',
};

/* ──────────────────────────────────────
   GIFT POINT VALUE MAPPING
   Maps catalog costs to scaled gift point values
   Cheapest gift = 50 pts, increases by 50 for each tier
   ────────────────────────────────────── */
const GIFT_POINT_SCALE = {
  0: 0,       // Free items (Early Adopter)
  150: 50,    // Cheapest paid item (Audiophile)
  200: 100,   // Second cheapest (2× Points Weekend)
  300: 150,   // Midnight Mode
  350: 200,   // Crate Digger
  400: 250,   // Vinyl Spinner
  450: 300,   // Vinyl Warmth
  500: 350,   // Early Access Pass
  550: 400,   // Music Theorist
  600: 450,   // Neon Pulse
  650: 500,   // Community Spotlight
  750: 550,   // Cosmic Explorer
  850: 600,   // Graph Pro Unlock
  1200: 650,  // Aurora Borealis
  2000: 700,  // Golden Ear
  5000: 750,  // Living Legend (most expensive)
};

/**
 * getGiftPointValue - Converts catalog cost to scaled gift point value
 * @param {number} catalogCost - The cost of the item in the catalog
 * @returns {number} - The scaled gift point value
 */
function getGiftPointValue(catalogCost) {
  return GIFT_POINT_SCALE[catalogCost] || 50; // Default to 50 if not found
}

/* ──────────────────────────────────────
   2. STATE & PERSISTENCE
   ────────────────────────────────────── */
const STORAGE_KEYS = {
  points:    'tw_points',
  owned:     'tw_owned',      // Legacy: array of item IDs
  inventory: 'tw_inventory',  // New: object with item counts { itemId: count }
  spent:     'tw_spent',
};

/**
 * loadUserData — reads state from localStorage,
 * seeding defaults on first visit.
 * Migrates from old 'owned' array to new 'inventory' count system.
 */
function loadUserData() {
  let inventory = JSON.parse(localStorage.getItem(STORAGE_KEYS.inventory) || '{}');
  
  // Migration: convert old 'owned' array to inventory counts
  const oldOwned = JSON.parse(localStorage.getItem(STORAGE_KEYS.owned) || '[]');
  if (oldOwned.length > 0 && Object.keys(inventory).length === 0) {
    // Migrate: each owned item gets count of 1
    oldOwned.forEach(itemId => {
      inventory[itemId] = 1;
    });
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
  }
  
  return {
    points: parseInt(localStorage.getItem(STORAGE_KEYS.points) ?? '1250', 10),
    inventory: inventory,
    spent:  parseInt(localStorage.getItem(STORAGE_KEYS.spent)  ?? '0',    10),
  };
}

function saveUserData(state) {
  localStorage.setItem(STORAGE_KEYS.points, state.points);
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(state.inventory));
  localStorage.setItem(STORAGE_KEYS.spent,  state.spent);
  
  // Keep 'owned' array in sync for backward compatibility with other systems
  const ownedArray = Object.keys(state.inventory).filter(id => state.inventory[id] > 0);
  localStorage.setItem(STORAGE_KEYS.owned, JSON.stringify(ownedArray));
}

/* ──────────────────────────────────────
   3. UI HELPERS
   ────────────────────────────────────── */
function updateBanner(state) {
  document.getElementById('pts-display').textContent = state.points.toLocaleString();
  
  // Count total items in inventory
  const totalItems = Object.values(state.inventory).reduce((sum, count) => sum + count, 0);
  document.getElementById('owned-count').textContent = totalItems;
  
  document.getElementById('spent-display').textContent = state.spent.toLocaleString();
}

/** Show a toast message at bottom-center */
function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toast-out .25s ease both';
    t.addEventListener('animationend', () => t.remove());
  }, 2800);
}

/** Burst confetti particles from a card */
function burstConfetti(card) {
  const colors = ['#2563eb', '#f59e0b', '#7c3aed', '#059669', '#ef4444'];
  const rect = card.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    dot.style.cssText = `
      background: ${colors[i % colors.length]};
      left: ${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px;
      top:  ${rect.top  + rect.height / 2}px;
      position: fixed;
      animation-delay: ${i * 40}ms;
    `;
    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
  card.classList.add('card-purchased');
  setTimeout(() => card.classList.remove('card-purchased'), 400);
}

/* ──────────────────────────────────────
   4. PURCHASE LOGIC
   ────────────────────────────────────── */
/**
 * handlePurchase — validates points, deducts cost,
 * adds item to inventory (increments count), persists, re-renders.
 */
function handlePurchase(itemId) {
  const state = loadUserData();
  const item  = CATALOG.find(i => i.id === itemId);
  if (!item) return;

  // Insufficient points guard
  if (state.points < item.cost) {
    showToast(`Not enough points — you need ${(item.cost - state.points).toLocaleString()} more.`, 'error');
    // Shake the points display
    const el = document.getElementById('pts-display');
    el.style.transition = 'none';
    el.style.color = '#ef4444';
    setTimeout(() => { el.style.color = ''; }, 700);
    return;
  }

  // Deduct & add to inventory
  state.points -= item.cost;
  state.inventory[itemId] = (state.inventory[itemId] || 0) + 1;
  state.spent  += item.cost;
  saveUserData(state);

  // Update the specific card without full re-render
  const card = document.querySelector(`[data-item-id="${itemId}"]`);
  if (card) {
    burstConfetti(card);
    refreshCard(card, item, state);
  }
  updateBanner(state);
  
  const count = state.inventory[itemId];
  showToast(`"${item.title}" added to inventory! (×${count}) 🎉`, 'success');
}

/** Refresh a single card's interactive elements after purchase */
function refreshCard(card, item, state) {
  const count = state.inventory[item.id] || 0;

  // Update the button to show count
  const btn = card.querySelector('.buy-btn');
  if (btn) {
    btn.textContent = item.cost === 0 ? 'Claim' : 'Buy';
    btn.className = 'buy-btn can-buy';
    btn.disabled = false;
  }
  
  // Update inventory count display
  const footer = card.querySelector('.item-footer');
  let countBadge = card.querySelector('.inventory-count');
  
  if (count > 0) {
    if (!countBadge) {
      countBadge = document.createElement('div');
      countBadge.className = 'inventory-count';
      footer.insertBefore(countBadge, footer.firstChild);
    }
    countBadge.textContent = `Owned: ×${count}`;
  }
}

/* ──────────────────────────────────────
   5. RENDER
   ────────────────────────────────────── */
let activeCategory = 'all';
let searchQuery    = '';

/** Build one item card element */
function buildCard(item, state) {
  const inventoryCount = state.inventory[item.id] || 0;
  const isOwned   = inventoryCount > 0;
  const canAfford = state.points >= item.cost;
  const isFree    = item.cost === 0;

  const card = document.createElement('div');
  card.className = `item-card`;
  card.dataset.itemId   = item.id;
  card.dataset.category = item.category;

  card.innerHTML = `
    <span class="rarity-badge rarity-${item.rarity}">${RARITY_LABEL[item.rarity]}</span>
    <div class="item-icon-wrap">
      <span class="item-icon" role="img" aria-label="${item.title}">${item.icon}</span>
    </div>
    <div class="item-body">
      <div class="item-title">${item.title}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-footer">
        ${isOwned ? `<div class="inventory-count">Owned: ×${inventoryCount}</div>` : ''}
        <div class="item-cost">
          <span class="cost-coin">🪙</span>
          ${isFree ? '<span style="color:var(--green);font-size:.85rem;">Free</span>' : item.cost.toLocaleString()}
        </div>
        <button
          class="buy-btn ${canAfford ? 'can-buy' : 'cant-buy'}"
          onclick="handlePurchase('${item.id}')"
        >
          ${isFree ? 'Claim' : 'Buy'}
        </button>
      </div>
    </div>
  `;
  return card;
}

const CATEGORY_META = {
  all:     { label: 'All Items',  emoji: '' },
  themes:  { label: 'Themes',     emoji: '🎨' },
  avatars: { label: 'Avatars',    emoji: '👤' },
  boosts:  { label: 'Boosts',     emoji: '⚡' },
  badges:  { label: 'Badges',     emoji: '🏅' },
};

/**
 * renderShop — filters the catalog and builds the grid,
 * grouping by category when "all" is active.
 */
function renderShop() {
  const state = loadUserData();
  updateBanner(state);

  const wrap  = document.getElementById('shop-grid-wrap');
  wrap.innerHTML = '';

  // Filter by search
  let items = CATALOG.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
  });

  // Filter by category
  if (activeCategory !== 'all') {
    items = items.filter(i => i.category === activeCategory);
  }

  if (!items.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🔍</div>
        <p>No items match your search. Try a different keyword or category.</p>
      </div>`;
    return;
  }

  // Decide grouping
  const categories = activeCategory === 'all'
    ? ['themes', 'avatars', 'boosts', 'badges']
    : [activeCategory];

  categories.forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    if (!catItems.length) return;

    const meta = CATEGORY_META[cat];

    // Section heading
    const hd = document.createElement('div');
    hd.className = 'cat-heading';
    hd.innerHTML = `
      <h2>${meta.emoji ? meta.emoji + ' ' : ''}${meta.label}</h2>
      <div class="cat-heading-line"></div>
      <span class="cat-count">${catItems.length}</span>
    `;
    wrap.appendChild(hd);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'shop-grid';
    catItems.forEach(item => grid.appendChild(buildCard(item, state)));
    wrap.appendChild(grid);
  });
}

/* ──────────────────────────────────────
   6. GIFTING SYSTEM (for engagement page)
   ────────────────────────────────────── */
/**
 * giftItem — allows users to gift owned items to commenters
 * This is called from the engagement page gift modal
 */
function giftItem(itemId) {
  const state = loadUserData();
  const item = CATALOG.find(i => i.id === itemId);
  
  if (!item) return;
  
  // Check if user has this item in inventory
  const inventoryCount = state.inventory[itemId] || 0;
  if (inventoryCount === 0) {
    showToast('You must own this item to gift it!', 'error');
    return;
  }
  
  // Note: The actual gifting is handled by the engagement page
  // This function is just for validation
  return true;
}

/**
 * getInventoryCount — helper function for other pages to check inventory
 */
function getInventoryCount(itemId) {
  const state = loadUserData();
  return state.inventory[itemId] || 0;
}

// Expose inventory helper globally
window.getInventoryCount = getInventoryCount;

/* ──────────────────────────────────────
   7. DEMO HELPER
   ────────────────────────────────────── */
function addDemoPoints() {
  const state = loadUserData();
  state.points += 500;
  saveUserData(state);
  updateBanner(state);
  renderShop();
  showToast('Added 500 demo points! 🎉', 'success');
}

// Make functions available globally for onclick handlers
window.handlePurchase = handlePurchase;
window.giftItem = giftItem;
window.addDemoPoints = addDemoPoints;

/* ──────────────────────────────────────
   8. EVENT WIRING
   ────────────────────────────────────── */

// Category tabs
document.getElementById('cat-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.cat-tab');
  if (!tab) return;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeCategory = tab.dataset.cat;
  renderShop();
});

// Search
let searchTimer;
document.getElementById('search-input').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value.trim();
    renderShop();
  }, 200);
});

/* ──────────────────────────────────────
   9. INIT
   ────────────────────────────────────── */
// Initialize points banner on page load
document.addEventListener('DOMContentLoaded', () => {
  const state = loadUserData();
  updateBanner(state);
});

renderShop();
