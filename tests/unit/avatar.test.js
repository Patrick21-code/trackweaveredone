// Feature: engagement-navbar-user-accounts, Property 5: avatar color determinism
// Validates: Requirements 5.1, 5.4

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Extracted from frontend/engagement.html inline <script type="module">
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function avatarColor(uid) {
  const hue = Math.abs(hashStr(uid)) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

describe('Property 5: Avatar Color Determinism', () => {
  it('avatarColor returns the same value for the same uid across multiple calls', () => {
    // **Validates: Requirements 5.1, 5.4**
    fc.assert(
      fc.property(fc.string(), (uid) => {
        return avatarColor(uid) === avatarColor(uid);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: engagement-navbar-user-accounts, Property 1: avatar initial derivation
// Validates: Requirements 2.4, 5.2

// Extracted from frontend/engagement.html inline <script>
function getAvatarInitial(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}

describe('Property 1: Avatar Initial Derivation', () => {
  it('getAvatarInitial returns the uppercased first character for any non-empty string', () => {
    // **Validates: Requirements 2.4, 5.2**
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (username) => {
        return getAvatarInitial(username) === username[0].toUpperCase();
      }),
      { numRuns: 100 }
    );
  });

  it('getAvatarInitial returns "?" for empty string', () => {
    // **Validates: Requirements 2.4, 5.2**
    expect(getAvatarInitial('')).toBe('?');
  });

  it('getAvatarInitial returns "?" for falsy input (null, undefined)', () => {
    // **Validates: Requirements 2.4, 5.2**
    expect(getAvatarInitial(null)).toBe('?');
    expect(getAvatarInitial(undefined)).toBe('?');
  });
});
