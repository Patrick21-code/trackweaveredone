/* ═══════════════════════════════════════════════════════════
   TrackWeave — Simplified Dashboard Script
   Uses only available artists from graph_data folder
   ═══════════════════════════════════════════════════════════ */

import { AVAILABLE_ARTISTS, getArtistsByGenre, searchArtists, getAllArtists, getAvailableGenres } from './available-artists.js';

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIEvBzIOtBFJpCxqM2onqFbK6Nw82AYp4",
  authDomain: "trackweave-26cad.firebaseapp.com",
  projectId: "trackweave-26cad",
  storageBucket: "trackweave-26cad.firebasestorage.app",
  messagingSenderId: "906996721432",
  appId: "1:906996721432:web:483313759725eb2022a06d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── Auth guard ────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.exists() ? snap.data() : {};
  if (!data.onboardingComplete) {
    window.location.href = "./onboarding.html";
    return;
  }

  const firstName = data.firstName ?? (user.displayName?.split(" ")[0] ?? "Listener");
  const lastName = data.lastName ?? "";
  const displayName = `${firstName} ${lastName}`.trim();
  const username = data.username ?? "";
  const photoURL = user.photoURL ?? "";
  const genres = data.favoriteGenres ?? [];

  // ── Hero header ───────────────────────────────────────────
  document.getElementById("dash-name").textContent = `Welcome back, ${firstName}.`;

  const genreChipWrap = document.getElementById("hero-genres");
  if (genres.length && genreChipWrap) {
    genreChipWrap.innerHTML = genres
      .map(g => `<span class="hero-genre-chip" data-genre="${escHtml(g)}">${escHtml(g)}</span>`)
      .join("");
    genreChipWrap.querySelectorAll(".hero-genre-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const genre = chip.dataset.genre;
        const blockId = "c-" + genre.toLowerCase().replace(/[\s&]/g, "-").replace(/[^a-z0-9-]/g, "");
        const target = document.getElementById(blockId);
        if (target) {
          const navH = document.querySelector(".nav")?.offsetHeight ?? 72;
          const y = target.getBoundingClientRect().top + window.scrollY - navH - 24;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  }

  // ── Avatar ────────────────────────────────────────────────
  const setAvatar = (el) => {
    if (!el) return;
    if (photoURL) {
      el.innerHTML = `<img src="${escHtml(photoURL)}" alt="${escHtml(displayName)}" />`;
    } else {
      el.textContent = firstName.charAt(0).toUpperCase();
      el.style.background = `linear-gradient(135deg, var(--blue), #7c3aed)`;
    }
  };
  setAvatar(document.getElementById("nav-avatar"));

  document.getElementById("drop-display-name").textContent = displayName;
  document.getElementById("drop-username").textContent = username ? `@${username}` : user.email ?? "";

  document.getElementById("btn-signout").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./login.html";
  });

  document.getElementById("dash-shell").hidden = false;

  // ── Build carousels ────────────────────────────────────
  if (genres.length) {
    buildCarousels(genres);
  } else {
    // Show all available genres if user hasn't selected any
    const availableGenres = getAvailableGenres();
    if (availableGenres.length > 0) {
      buildCarousels(availableGenres);
    } else {
      document.getElementById("artists-section").innerHTML =
        `<p class="artists-empty">No artists available at the moment.</p>`;
    }
  }
});

// ── Build all carousels ──────────────────────────────────────
function buildCarousels(genres) {
  const section = document.getElementById("artists-section");
  section.innerHTML = "";

  const eyebrow = document.createElement("p");
  eyebrow.className = "section-eyebrow";
  eyebrow.textContent = "Available Artists · Explore discography graphs";
  section.appendChild(eyebrow);

  // Build carousel for each genre
  genres.forEach(genre => {
    const artists = getArtistsByGenre(genre);
    if (artists.length > 0) {
      const block = buildCarouselBlock(genre, artists);
      section.appendChild(block);
    }
  });

  const creditEl = document.createElement("p");
  creditEl.className = "api-credit";
  creditEl.innerHTML = `Artist data from local graph database`;
  section.appendChild(creditEl);
}

// ── Build carousel DOM block ──────────────────────────────────────
function buildCarouselBlock(genre, artists) {
  const blockId = `c-${genre.toLowerCase().replace(/[\s&]/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  const block = document.createElement("div");
  block.className = "genre-carousel-block";
  block.id = blockId;

  block.innerHTML = `
    <div class="genre-carousel-header">
      <h3>${escHtml(genre)}</h3>
      <button class="see-all" type="button" data-genre="${escHtml(genre)}" tabindex="0">See all
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="carousel-wrapper">
      <div class="carousel-fade-left"></div>
      <div class="carousel-fade-right"></div>
      <button class="carousel-btn prev" aria-label="Scroll left" disabled>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="carousel-track-outer">
        <div class="carousel-track" id="${escHtml(blockId)}">
          ${artists.map((a, i) => artistCardHTML(a, i)).join("")}
        </div>
      </div>
      <button class="carousel-btn next" aria-label="Scroll right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>`;

  // Wire carousel behaviour
  const wrapper = block.querySelector(".carousel-wrapper");
  const track = block.querySelector(".carousel-track");
  const prevBtn = block.querySelector(".carousel-btn.prev");
  const nextBtn = block.querySelector(".carousel-btn.next");
  const fadeLeft = block.querySelector(".carousel-fade-left");
  const fadeRight = block.querySelector(".carousel-fade-right");

  let idx = 0;
  const GAP = 14;
  const totalItems = artists.length;

  const visibleCount = () => {
    const w = wrapper.offsetWidth;
    if (w < 420) return 2;
    if (w < 640) return 3;
    if (w < 860) return 4;
    if (w < 1100) return 5;
    return 6;
  };

  const updateFades = () => {
    fadeLeft.style.opacity = idx > 0 ? "1" : "0";
    fadeRight.style.opacity = idx < Math.max(0, totalItems - visibleCount()) ? "1" : "0";
  };

  const slide = () => {
    const vc = visibleCount();
    const maxIdx = Math.max(0, totalItems - vc);
    idx = Math.min(idx, maxIdx);
    const cardEl = track.querySelector(".artist-card");
    const cardW = cardEl ? cardEl.offsetWidth : 0;
    track.style.transform = `translateX(-${idx * (cardW + GAP)}px)`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= maxIdx;
    updateFades();
  };

  prevBtn.addEventListener("click", () => {
    idx = Math.max(0, idx - 1);
    slide();
  });
  nextBtn.addEventListener("click", () => {
    idx++;
    slide();
  });

  const ro = new ResizeObserver(slide);
  ro.observe(wrapper);
  requestAnimationFrame(slide);

  block.querySelector(".see-all").addEventListener("click", (e) => {
    e.preventDefault();
    openSeeAllOverlay(genre, artists);
  });

  return block;
}

// ── Store artist in sessionStorage and navigate to detail page ──────
function navigateToArtist(artist) {
  try {
    sessionStorage.setItem("tw_artist_detail", JSON.stringify(artist));
  } catch { /* storage full */ }
  window.location.href = `./artist-details.html?id=${encodeURIComponent(artist.id)}`;
}
window._navigateToArtist = navigateToArtist;

// ── Artist card HTML ─────────────────────────────────────────
function artistCardHTML(artist, index) {
  const hue = Math.abs(hashStr(artist.name)) % 360;
  const hue2 = (hue + 55) % 360;
  const sat = 58 + (Math.abs(hashStr(artist.name + "s")) % 18);

  const year = artist["life-span"]?.begin ?? "";
  const country = artist.country ?? "";
  const sub = [year, country].filter(Boolean).join(" · ") || "Artist";

  const gradStyle = `background:linear-gradient(135deg,hsl(${hue},${sat}%,50%),hsl(${hue2},${sat - 8}%,34%))`;

  // Use gradient placeholder for all artists (no external images)
  const imgHtml = `
    <div class="artist-img-bg artist-img-placeholder" style="${gradStyle}">
      ${musicNoteIconSVG()}
    </div>`;

  return `
    <a class="artist-card" href="./artist-details.html?id=${escHtml(artist.id)}"
       data-artist-id="${escHtml(artist.id)}"
       style="animation-delay:${index * 0.045}s"
       aria-label="View ${escHtml(artist.name)}"
       onclick="event.preventDefault(); window._navigateToArtist(${escHtml(JSON.stringify(artist))})">
      <div class="artist-img-wrap">
        ${imgHtml}
      </div>
      <div class="artist-name">${escHtml(artist.name)}</div>
      <div class="artist-sub">${escHtml(sub)}</div>
    </a>`;
}

// ── Music note SVG icon for placeholder ──────────────────────────
function musicNoteIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:38%;height:38%;opacity:0.75;">
    <path d="M9 18V5l12-2v13" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="white" stroke-width="1.8"/>
    <circle cx="18" cy="16" r="3" stroke="white" stroke-width="1.8"/>
  </svg>`;
}

// ── See All Overlay ───────────────────────────────────────────────
function openSeeAllOverlay(genre, artists) {
  const overlay = document.getElementById("see-all-overlay");
  if (!overlay) return;

  overlay.querySelector(".see-all-genre-title").textContent = genre;
  overlay.querySelector(".see-all-count").textContent = `${artists.length} artists`;

  const grid = overlay.querySelector(".see-all-grid");
  grid.innerHTML = "";

  artists.forEach((artist, i) => {
    const hue = Math.abs(hashStr(artist.name)) % 360;
    const hue2 = (hue + 55) % 360;
    const sat = 58 + (Math.abs(hashStr(artist.name + "s")) % 18);
    const year = artist["life-span"]?.begin ?? "";
    const country = artist.country ?? "";
    const badge = [year, country].filter(Boolean).join(" · ") || "Artist";
    const gradStyle = `background:linear-gradient(135deg,hsl(${hue},${sat}%,50%),hsl(${hue2},${sat - 8}%,34%))`;

    const imgHtml = `
      <div class="artist-img-bg artist-img-placeholder" style="${gradStyle}">
        ${musicNoteIconSVG()}
      </div>`;

    const card = document.createElement("a");
    card.className = "artist-card";
    card.href = `./artist-details.html?id=${encodeURIComponent(artist.id)}`;
    card.setAttribute("aria-label", `View ${artist.name}`);
    card.style.animationDelay = `${i * 0.025}s`;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToArtist(artist);
    });
    card.innerHTML = `
      <div class="artist-img-wrap">${imgHtml}</div>
      <div class="artist-name">${escHtml(artist.name)}</div>
      <div class="artist-sub">${escHtml(badge)}</div>`;
    grid.appendChild(card);
  });

  overlay.classList.add("open");
  document.body.classList.add("overlay-open");
}

function closeSeeAllOverlay() {
  const overlay = document.getElementById("see-all-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.classList.remove("overlay-open");
}

// ── Artist search (navbar) ────────────────────────────────────
const searchInput = document.getElementById("artist-search-input");
const searchResults = document.getElementById("artist-search-results");
const searchClear = document.getElementById("artist-search-clear");

let searchTimer = null;
let activeIndex = -1;

function setSearchLoading() {
  searchResults.classList.add("open");
  searchResults.innerHTML = `<div class="search-state"><span class="search-spinner"></span>Searching…</div>`;
}

function setSearchEmpty(query) {
  searchResults.innerHTML = `<div class="search-state search-state-empty">No artists found for "<strong>${escHtml(query)}</strong>"</div>`;
}

function closeSearchResults() {
  searchResults.classList.remove("open");
  searchResults.innerHTML = "";
  activeIndex = -1;
}

function renderSearchResults(artists) {
  if (!artists.length) return;
  activeIndex = -1;
  searchResults.classList.add("open");
  searchResults.innerHTML = artists.map((a, i) => {
    const hue = Math.abs(hashStr(a.name)) % 360;
    const hue2 = (hue + 55) % 360;
    const sat = 58 + (Math.abs(hashStr(a.name + "s")) % 18);
    const grad = `background:linear-gradient(135deg,hsl(${hue},${sat}%,50%),hsl(${hue2},${sat - 8}%,34%))`;
    const year = a["life-span"]?.begin ?? "";
    const country = a.country ?? "";
    const meta = [a.genre, year, country].filter(Boolean).join(" · ") || "Artist";

    const thumb = `<span class="sr-thumb-fallback" style="${grad}">${musicNoteIconSVG()}</span>`;

    return `<div class="search-result-item" role="option" tabindex="-1" data-index="${i}" data-artist='${escHtml(JSON.stringify(a))}'>
      <div class="sr-thumb">${thumb}</div>
      <div class="sr-info">
        <div class="sr-name">${escHtml(a.name)}</div>
        <div class="sr-meta">${escHtml(meta)}</div>
      </div>
      <svg class="sr-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`;
  }).join("");

  searchResults.querySelectorAll(".search-result-item").forEach(item => {
    item.addEventListener("click", () => {
      const artist = JSON.parse(item.dataset.artist);
      closeSearchResults();
      navigateToArtist(artist);
    });
    item.addEventListener("mouseenter", () => {
      activeIndex = parseInt(item.dataset.index);
      highlightItem();
    });
  });
}

function highlightItem() {
  searchResults.querySelectorAll(".search-result-item").forEach((el, i) => {
    el.classList.toggle("active", i === activeIndex);
  });
}

function doSearch(query) {
  setSearchLoading();
  
  // Search in available artists
  const artists = searchArtists(query);
  
  if (!artists.length) {
    setSearchEmpty(query);
    return;
  }

  renderSearchResults(artists);
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClear.hidden = !q;
  clearTimeout(searchTimer);
  if (!q) {
    closeSearchResults();
    return;
  }
  searchTimer = setTimeout(() => doSearch(q), 200);
});

searchInput.addEventListener("keydown", (e) => {
  const items = [...searchResults.querySelectorAll(".search-result-item")];
  if (!items.length) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
    highlightItem();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    highlightItem();
  } else if (e.key === "Enter" && activeIndex >= 0) {
    e.preventDefault();
    items[activeIndex]?.click();
  } else if (e.key === "Escape") {
    closeSearchResults();
    searchInput.blur();
  }
});

searchInput.addEventListener("focus", () => {
  if (searchInput.value.trim() && searchResults.innerHTML) searchResults.classList.add("open");
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.hidden = true;
  closeSearchResults();
  searchInput.focus();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#nav-search-wrap")) closeSearchResults();
});

// ── Helpers ───────────────────────────────────────────────────────
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Avatar dropdown ───────────────────────────────────────────
const _wrap = document.getElementById("nav-avatar-wrap");
const _avBtn = document.getElementById("nav-avatar");

_avBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = _wrap.classList.toggle("open");
  _avBtn.setAttribute("aria-expanded", open);
});

document.addEventListener("click", (e) => {
  if (!_wrap.contains(e.target)) {
    _wrap.classList.remove("open");
    _avBtn.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    _wrap.classList.remove("open");
    _avBtn.setAttribute("aria-expanded", "false");
  }
});

// ── See All overlay close ─────────────────────────────────────
document.getElementById("see-all-back")?.addEventListener("click", closeSeeAllOverlay);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSeeAllOverlay();
});

// ── Mirror avatar to dropdown mini-avatar ─────────────────────
const _dropMini = document.getElementById("drop-av-mini");
new MutationObserver(() => {
  if (_dropMini) {
    _dropMini.innerHTML = _avBtn.innerHTML;
    _dropMini.style.background = _avBtn.style.background;
  }
}).observe(_avBtn, { childList: true, subtree: true, characterData: true });

// ── Measure nav height for overlay offset ─────────────────────
const navEl = document.querySelector(".nav");
function updateNavHeight() {
  if (navEl) {
    document.documentElement.style.setProperty("--nav-height", navEl.offsetHeight + "px");
  }
}
updateNavHeight();
new ResizeObserver(updateNavHeight).observe(navEl);
