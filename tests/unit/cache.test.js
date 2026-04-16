// Feature: engagement-navbar-user-accounts, Property 4: user profile cache idempotence
// Validates: Requirements 3.6

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';

// Mirrors the cache logic from frontend/engagement.html
// Accepts an injected getDocFn for testability
async function resolveAuthorWithCache(uid, cache, getDocFn) {
  if (cache.has(uid)) return cache.get(uid);
  try {
    const snap = await getDocFn(uid);
    const profile = snap.exists()
      ? { username: snap.data().username ?? '', photoURL: snap.data().photoURL ?? '' }
      : { username: '', photoURL: '' };
    cache.set(uid, profile);
    return profile;
  } catch {
    const fallback = { username: '', photoURL: '' };
    cache.set(uid, fallback);
    return fallback;
  }
}

describe('Property 4: User Profile Cache Idempotence', () => {
  it('resolves a UID N times but calls getDoc exactly once', async () => {
    // **Validates: Requirements 3.6**
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.integer({ min: 1, max: 20 }),
        async (uid, n) => {
          const getDocFn = vi.fn().mockResolvedValue({
            exists: () => true,
            data: () => ({ username: 'testuser', photoURL: '' }),
          });
          const cache = new Map();

          for (let i = 0; i < n; i++) {
            await resolveAuthorWithCache(uid, cache, getDocFn);
          }

          return getDocFn.mock.calls.length === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
