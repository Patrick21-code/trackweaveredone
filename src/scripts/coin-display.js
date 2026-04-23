/**
 * Coin Display Module
 * Manages the persistent coin counter in the navbar across all pages
 */

const COIN_STORAGE_KEY = 'tw_points';
const DEFAULT_COINS = 1250;

/**
 * Get current coin balance from localStorage
 */
export function getCoins() {
  return parseInt(localStorage.getItem(COIN_STORAGE_KEY) || DEFAULT_COINS, 10);
}

/**
 * Update coin balance in localStorage
 */
export function setCoins(amount) {
  localStorage.setItem(COIN_STORAGE_KEY, amount);
  updateCoinDisplay();
}

/**
 * Add coins to current balance
 */
export function addCoins(amount) {
  const current = getCoins();
  setCoins(current + amount);
}

/**
 * Subtract coins from current balance
 */
export function subtractCoins(amount) {
  const current = getCoins();
  setCoins(Math.max(0, current - amount));
}

/**
 * Format coin number with commas
 */
function formatCoins(num) {
  return num.toLocaleString('en-US');
}

/**
 * Update all coin displays on the page
 */
export function updateCoinDisplay() {
  const coins = getCoins();
  const formattedCoins = formatCoins(coins);
  
  // Update navbar coin display
  const navCoinDisplay = document.getElementById('nav-coin-count');
  if (navCoinDisplay) {
    navCoinDisplay.textContent = formattedCoins;
  }
  
  // Update any other coin displays (like in points banner)
  const ptsDisplay = document.getElementById('pts-display');
  if (ptsDisplay) {
    ptsDisplay.textContent = formattedCoins;
  }
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins } }));
}

/**
 * Initialize coin display on page load
 */
export function initCoinDisplay() {
  // Ensure default coins are set if not present
  if (!localStorage.getItem(COIN_STORAGE_KEY)) {
    localStorage.setItem(COIN_STORAGE_KEY, DEFAULT_COINS);
  }
  
  // Update display immediately
  updateCoinDisplay();
  
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === COIN_STORAGE_KEY) {
      updateCoinDisplay();
    }
  });
  
  // Listen for custom coin update events
  window.addEventListener('coinsUpdated', () => {
    updateCoinDisplay();
  });
}

/**
 * Create and inject the coin display HTML into navbar
 */
export function injectCoinDisplay() {
  const navAvatarWrap = document.getElementById('nav-avatar-wrap');
  if (!navAvatarWrap) return;
  
  // Check if coin display already exists
  if (document.getElementById('nav-coin-display')) return;
  
  // Create coin display element
  const coinDisplay = document.createElement('div');
  coinDisplay.id = 'nav-coin-display';
  coinDisplay.className = 'nav-coin-display';
  coinDisplay.innerHTML = `
    <div class="nav-coin-icon">🪙</div>
    <span id="nav-coin-count">${formatCoins(getCoins())}</span>
  `;
  
  // Insert before avatar
  navAvatarWrap.parentNode.insertBefore(coinDisplay, navAvatarWrap);
}

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectCoinDisplay();
      initCoinDisplay();
    });
  } else {
    injectCoinDisplay();
    initCoinDisplay();
  }
}
