/* ═══════════════════════════════════════════════════════════
   TrackWeave — Avatar Utilities Module
   Shared avatar rendering functions
   ═══════════════════════════════════════════════════════════ */

export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

export function avatarColor(uid) {
  const hue = Math.abs(hashStr(uid)) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

export function getAvatarInitial(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}

export function renderAvatar(el, { username, photoURL, uid }) {
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
