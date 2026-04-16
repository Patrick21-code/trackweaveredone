/* ═══════════════════════════════════════════════════════════
   TrackWeave — Landing Page Script
   Hero graph visualization, scroll reveal, and search functionality
   ═══════════════════════════════════════════════════════════ */

/* ─── HERO GRAPH ─────────────────────────────────────────── */
(function () {
  const svg = document.getElementById('hero-svg');

  // Albums: name, colour, list of song nodes
  const albums = [
    {
      name: 'Album I',
      fill: '#2563eb', stroke: '#1d4ed8',
      songs: [
        { id: 'a1', cx: 138, cy: 112 },
        { id: 'a2', cx: 182, cy: 162 },
        { id: 'a3', cx:  96, cy: 178 },
        { id: 'a4', cx:  80, cy: 122 },
      ],
    },
    {
      name: 'Album II',
      fill: '#7c3aed', stroke: '#6d28d9',
      songs: [
        { id: 'b1', cx: 278, cy:  88 },
        { id: 'b2', cx: 338, cy: 118 },
        { id: 'b3', cx: 325, cy: 178 },
        { id: 'b4', cx: 260, cy: 160 },
      ],
    },
    {
      name: 'Album III',
      fill: '#0891b2', stroke: '#0e7490',
      songs: [
        { id: 'c1', cx: 192, cy:  58 },
        { id: 'c2', cx: 242, cy:  44 },
        { id: 'c3', cx: 218, cy: 218 },
        { id: 'c4', cx: 162, cy: 234 },
      ],
    },
  ];

  // Artist node — top-left, separate
  const artist = { cx: 44, cy: 40 };

  // Edges between song nodes (cross and intra-album)
  const edges = [
    ['a1','b1'], ['a1','c1'], ['a2','c3'], ['a2','b4'],
    ['a3','c4'], ['a4','c1'], ['b2','c2'], ['b3','c3'],
    ['b4','c1'], ['b1','c2'], ['a3','a4'], ['b1','b2'],
    ['a1','a2'], ['c1','c2'],
  ];

  // Dashed edges: artist → one representative song per album
  const artistEdges = ['a1', 'b1', 'c1'];

  // Build lookup
  const map = {};
  albums.forEach(al => al.songs.forEach(s => { map[s.id] = { ...s, fill: al.fill, stroke: al.stroke }; }));

  const ns = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };

  // ── edge layer ──
  const eg = el('g', { stroke: '#c7d2fe', 'stroke-width': '1.1', opacity: '0.65' });
  edges.forEach(([a, b]) => {
    const na = map[a], nb = map[b]; if (!na || !nb) return;
    eg.appendChild(el('line', { x1: na.cx, y1: na.cy, x2: nb.cx, y2: nb.cy }));
  });
  svg.appendChild(eg);

  // ── artist dashed edges ──
  const ag = el('g', { stroke: '#94a3b8', 'stroke-width': '1', 'stroke-dasharray': '4 3', opacity: '0.55' });
  artistEdges.forEach(sid => {
    const n = map[sid]; if (!n) return;
    ag.appendChild(el('line', { x1: artist.cx, y1: artist.cy, x2: n.cx, y2: n.cy }));
  });
  svg.appendChild(ag);

  // ── song nodes ──
  albums.forEach(al => {
    const g = el('g', {});
    al.songs.forEach(s => {
      const halo = el('circle', { cx: s.cx, cy: s.cy, r: '11', fill: al.fill, opacity: '0.11' });
      g.appendChild(halo);

      const c = el('circle', { cx: s.cx, cy: s.cy, r: '6', fill: al.fill, stroke: al.stroke, 'stroke-width': '1.5' });
      c.style.cursor = 'pointer';
      c.style.transition = 'r .15s';

      const t = document.createElementNS(ns, 'title');
      t.textContent = `${al.name}`;
      c.appendChild(t);

      c.addEventListener('mouseenter', () => { c.setAttribute('r', '8.5'); halo.setAttribute('r', '14'); });
      c.addEventListener('mouseleave', () => { c.setAttribute('r', '6');   halo.setAttribute('r', '11'); });
      g.appendChild(c);
    });
    svg.appendChild(g);
  });

  // ── artist node (diamond, top-left) ──
  const artG = el('g', {});

  const halo = el('circle', { cx: artist.cx, cy: artist.cy, r: '18', fill: '#f59e0b', opacity: '0.09' });
  artG.appendChild(halo);

  const d = 12;
  const diamond = el('polygon', {
    points: `${artist.cx},${artist.cy - d} ${artist.cx + d},${artist.cy} ${artist.cx},${artist.cy + d} ${artist.cx - d},${artist.cy}`,
    fill: '#f59e0b', stroke: '#d97706', 'stroke-width': '1.5',
  });
  artG.appendChild(diamond);

  const lbl = el('text', {
    x: artist.cx, y: artist.cy + d + 14,
    'text-anchor': 'middle', 'font-size': '9',
    'font-family': 'Instrument Sans, sans-serif',
    fill: '#92400e', 'font-weight': '600',
  });
  lbl.textContent = 'Artist';
  artG.appendChild(lbl);

  svg.appendChild(artG);

  // ── legend ──
  const legendEl = document.getElementById('graph-legend');
  albums.forEach(al => {
    const item = document.createElement('div');
    item.className = 'leg-item';
    item.innerHTML = `<span class="leg-dot" style="background:${al.fill}"></span>${al.name}`;
    legendEl.appendChild(item);
  });
  // artist legend entry
  const artEntry = document.createElement('div');
  artEntry.className = 'leg-item';
  artEntry.innerHTML = `<span class="leg-dot" style="background:#f59e0b;border-radius:2px;transform:rotate(45deg);display:inline-block;"></span>Artist`;
  legendEl.appendChild(artEntry);
})();


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));


/* ─── SEARCH ─────────────────────────────────────────────── */
const PROXY = 'https://corsproxy.io/?';
const BASE  = 'https://api.deezer.com';
const inp   = document.getElementById('searchInput');
const drop  = document.getElementById('searchResults');
let timer;

function search(q) {
  clearTimeout(timer);
  if (!q.trim()) { drop.classList.add('hidden'); return; }
  drop.innerHTML = `<div style="padding:1rem;text-align:center;color:#7a8e9e;font-size:.84rem;">Searching…</div>`;
  drop.classList.remove('hidden');
  timer = setTimeout(async () => {
    try {
      const [ar, al] = await Promise.all([
        fetch(`${PROXY}${encodeURIComponent(`${BASE}/search/artist?q=${encodeURIComponent(q)}&limit=4`)}`).then(r=>r.json()),
        fetch(`${PROXY}${encodeURIComponent(`${BASE}/search/album?q=${encodeURIComponent(q)}&limit=4`)}`).then(r=>r.json()),
      ]);
      render(ar?.data||[], al?.data||[]);
    } catch {
      drop.innerHTML = `<div style="padding:1rem;color:#ef4444;font-size:.84rem;">Search failed — please try again.</div>`;
    }
  }, 280);
}

function row(img, title, sub, link, round) {
  return `<a href="${link||'#'}" target="_blank" style="display:flex;align-items:center;gap:.68rem;padding:.58rem 1rem;border-bottom:1px solid #ddd7cf;transition:background .14s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
    <div style="width:33px;height:33px;border-radius:${round?'50%':'7px'};overflow:hidden;flex-shrink:0;background:#dbeafe;display:flex;align-items:center;justify-content:center;">
      ${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;" crossorigin="anonymous"/>` :
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`}
    </div>
    <div style="min-width:0;">
      <div style="color:#111820;font-size:.86rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
      <div style="color:#7a8e9e;font-size:.76rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sub}</div>
    </div>
  </a>`;
}

function secHead(label) {
  return `<div style="padding:.38rem 1rem .2rem;font-size:.67rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7a8e9e;border-bottom:1px solid #ddd7cf;">${label}</div>`;
}

function render(artists, albums) {
  if (!artists.length && !albums.length) {
    drop.innerHTML = `<div style="padding:1.2rem;text-align:center;color:#7a8e9e;font-size:.84rem;">No results found.</div>`;
    return;
  }
  let h = '';
  if (artists.length) { h += secHead('Artists'); artists.forEach(a => h += row(a.picture_medium, a.name, `${(a.nb_fan||0).toLocaleString()} fans · ${a.nb_album||0} albums`, a.link, true)); }
  if (albums.length)  { h += secHead('Albums');  albums.forEach(a  => h += row(a.cover_medium,   a.title, a.artist?.name||'Unknown Artist', a.link, false)); }
  drop.innerHTML = h;
  drop.classList.remove('hidden');
}

inp.addEventListener('input',  e => search(e.target.value));
inp.addEventListener('focus',  e => { if (e.target.value.trim()) search(e.target.value); });
document.addEventListener('click', e => { if (!inp.contains(e.target) && !drop.contains(e.target)) drop.classList.add('hidden'); });
inp.addEventListener('keydown', e => { if (e.key === 'Escape') { drop.classList.add('hidden'); inp.blur(); } });
