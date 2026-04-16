/* ═══════════════════════════════════════════════════════════
   TrackWeave — Support Page Script
   Scroll reveal animations and donation amount selector
   ═══════════════════════════════════════════════════════════ */

/* ── Scroll reveal ── */
const io = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Amount chip selector ── */
function pickAmount(el, val) {
  document.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Make pickAmount available globally for onclick handlers
window.pickAmount = pickAmount;
