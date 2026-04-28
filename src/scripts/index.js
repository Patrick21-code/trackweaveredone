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

  // Edges between song nodes (cross and intra-album)
  const edges = [
    ['a1','b1'], ['a1','c1'], ['a2','c3'], ['a2','b4'],
    ['a3','c4'], ['a4','c1'], ['b2','c2'], ['b3','c3'],
    ['b4','c1'], ['b1','c2'], ['a3','a4'], ['b1','b2'],
    ['a1','a2'], ['c1','c2'],
  ];

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

  // ── legend ──
  const legendEl = document.getElementById('graph-legend');
  albums.forEach(al => {
    const item = document.createElement('div');
    item.className = 'leg-item';
    item.innerHTML = `<span class="leg-dot" style="background:${al.fill}"></span>${al.name}`;
    legendEl.appendChild(item);
  });
})();


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
