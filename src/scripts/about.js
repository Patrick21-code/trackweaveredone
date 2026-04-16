/* ═══════════════════════════════════════════════════════════
   TrackWeave — About Page Script
   Scroll reveal animations
   ═══════════════════════════════════════════════════════════ */

// Scroll reveal animation
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
