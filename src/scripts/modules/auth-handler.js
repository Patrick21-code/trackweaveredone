/* ═══════════════════════════════════════════════════════════
   TrackWeave — Authentication Handler Module
   Shared authentication and dropdown logic
   ═══════════════════════════════════════════════════════════ */

import { renderAvatar } from './avatar-utils.js';

export function setupAuthHandler(auth, db, getDoc, doc, signOut) {
  return async (user) => {
    if (!user) { 
      window.location.href = "./login.html"; 
      return; 
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};
    const username = data.username ?? '';
    const photoURL = user.photoURL ?? '';
    const uid = user.uid;

    // Render nav avatar button
    const navAvBtn = document.getElementById('nav-avatar');
    if (navAvBtn) renderAvatar(navAvBtn, { username, photoURL, uid });

    // Render dropdown mini-avatar and username
    const dropMini = document.getElementById('drop-av-mini');
    if (dropMini) renderAvatar(dropMini, { username, photoURL, uid });

    const dropHandle = document.getElementById('drop-username');
    if (dropHandle) dropHandle.textContent = username ? `@${username}` : (user.email ?? '');

    const dropName = document.getElementById('drop-display-name');
    if (dropName) dropName.textContent = username ? `@${username}` : (user.email ?? '');

    // Wire sign out
    const signOutBtn = document.getElementById('btn-signout');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        try { await signOut(auth); } catch(e) { console.error(e); }
        window.location.href = './login.html';
      });
    }

    return { user, data, username, photoURL, uid };
  };
}

export function setupAvatarDropdown() {
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
}
