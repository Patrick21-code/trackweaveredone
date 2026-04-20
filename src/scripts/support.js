/* ═══════════════════════════════════════════════════════════
   TrackWeave — Support Page Script
   Scroll reveal animations for community engagement
   ═══════════════════════════════════════════════════════════ */

/* ── Scroll reveal ── */
const io = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
