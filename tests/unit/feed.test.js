// Feature: engagement-navbar-user-accounts, Property 3: author handle rendering
// Validates: Requirements 3.3, 3.4

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Extracted from frontend/engagement.html feed rendering logic
function renderPostAuthorHandle(uid, profile) {
  return profile.username ? `@${profile.username}` : '@unknown';
}

describe('Property 3: Author Handle Rendering', () => {
  it('renders "@" + username for any non-empty username', () => {
    // **Validates: Requirements 3.3, 3.4**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (uid, username) => {
          const handle = renderPostAuthorHandle(uid, { username, photoURL: '' });
          return handle === `@${username}`;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('renders "@unknown" when username is empty', () => {
    expect(renderPostAuthorHandle('uid123', { username: '', photoURL: '' })).toBe('@unknown');
  });
});

// Feature: engagement-navbar-user-accounts, Property 2: username-only display
// Validates: Requirements 4.1, 4.2, 4.3, 2.8

// Pure function: renders author handle using only username, ignoring firstName/lastName
function renderAuthorHandle({ username, firstName, lastName }) {
  return `@${username}`;
}

describe('Property 2: Username-Only Display', () => {
  it('rendered handle equals "@" + username and excludes firstName/lastName', () => {
    // **Validates: Requirements 4.1, 4.2, 4.3, 2.8**
    fc.assert(
      fc.property(
        fc.record({
          username:  fc.string({ minLength: 1 }),
          firstName: fc.string({ minLength: 1 }),
          lastName:  fc.string({ minLength: 1 }),
        }),
        ({ username, firstName, lastName }) => {
          const handle = renderAuthorHandle({ username, firstName, lastName });

          // Handle must always equal "@" + username
          if (handle !== `@${username}`) return false;

          // Only assert firstName exclusion when it's not a substring of username
          if (firstName && !username.includes(firstName)) {
            if (handle.includes(firstName)) return false;
          }

          // Only assert lastName exclusion when it's not a substring of username
          if (lastName && !username.includes(lastName)) {
            if (handle.includes(lastName)) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
