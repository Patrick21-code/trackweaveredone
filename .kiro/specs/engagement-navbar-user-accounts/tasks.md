# Implementation Plan: Engagement Navbar & User Accounts

## Overview

Implement Firebase Authentication integration on `engagement.html` and `shop.html`, replacing placeholder navbar elements with a real user avatar component, removing hardcoded demo accounts, and wiring up live Firestore user data throughout the community feed.

## Tasks

- [x] 1. Set up Firebase integration and auth guard on engagement.html
  - Add Firebase SDK ESM imports (`firebase-app`, `firebase-auth`, `firebase-firestore`) using the same `firebaseConfig` already in `dashboard.html`
  - Wrap all page initialisation inside `onAuthStateChanged`; redirect to `login.html` if no session, redirect to `onboarding.html` if `onboardingComplete` is false
  - Hide page content until auth resolves (set `hidden` on the main shell, reveal on success)
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2_

- [x] 2. Implement avatar utility functions
  - [x] 2.1 Implement `hashStr(s)` and `avatarColor(uid)` functions
    - `hashStr` uses the same djb2-style hash already in `dashboard.html`
    - `avatarColor` returns `hsl(hue, 65%, 48%)` derived from the UID
    - _Requirements: 5.1, 5.4_

  - [x] 2.2 Write property test for avatar color determinism
    - **Property 5: Avatar Color Determinism**
    - **Validates: Requirements 5.1, 5.4**

  - [x] 2.3 Implement `getAvatarInitial(username)` function
    - Returns `username.charAt(0).toUpperCase()` for non-empty strings, `'?'` for empty/falsy
    - _Requirements: 2.4, 5.2, 5.3_

  - [x] 2.4 Write property test for avatar initial derivation
    - **Property 1: Avatar Initial Derivation**
    - **Validates: Requirements 2.4, 5.2**

  - [x] 2.5 Implement `renderAvatar(el, { username, photoURL })` function
    - If `photoURL` is present, sets `el.innerHTML` to an `<img>` tag
    - Otherwise sets `el.textContent` to the initial and applies gradient background
    - _Requirements: 2.3, 2.4_

- [x] 3. Replace navbar buttons with Avatar Button on engagement.html
  - [x] 3.1 Update the HTML nav-end area in `engagement.html`
    - Remove the "Reward Shop" nav link, "Support" text link, and "Log In" button from `.nav-end`
    - Add the Avatar Button markup using `.nav-avatar-wrap`, `.nav-av-btn`, and `.nav-dropdown` classes from `dashboard-page.css`
    - Include dropdown items: Dashboard link, Community link (active), Sign Out button
    - _Requirements: 2.1, 2.2, 2.9, 6.3, 6.4_

  - [x] 3.2 Wire up avatar rendering and dropdown toggle behaviour
    - Call `renderAvatar` on both the nav button and the dropdown mini-avatar after auth resolves
    - Populate dropdown with `@username` (no full name)
    - Implement click-to-toggle and outside-click-to-close using the same pattern as `dashboard.html`
    - Wire Sign Out to call `signOut(auth)` then redirect to `login.html`
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.10, 4.3_

- [x] 4. Implement user profile cache and author resolution
  - [x] 4.1 Implement `userProfileCache` Map and `resolveAuthor(uid, currentUser)` function
    - Returns `currentUser` immediately if `uid === currentUser.uid`
    - Returns cached profile if present; otherwise calls `getDoc(users/{uid})`, caches result, and returns it
    - On error or missing document, caches and returns `{ username: '', photoURL: '' }`
    - _Requirements: 3.4, 3.5, 3.6, 7.3, 7.4_

  - [x] 4.2 Write property test for user profile cache idempotence
    - **Property 4: User Profile Cache Idempotence**
    - **Validates: Requirements 3.6**

- [x] 5. Remove demo accounts and wire real user data into the feed
  - [x] 5.1 Remove the hardcoded `USERS` object and `CURRENT_USER` constant
    - Delete the `USERS` map (`mia`, `james`, `priya`, `leo`, `soren`, `ada`) and the `CURRENT_USER` reference
    - Define `currentUser` from the Firebase auth result and Firestore profile after auth resolves
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Implement `patchSeedData(uid)` and apply it after auth resolves
    - Iterate `SEED_POSTS`, `SEED_COMMENTS`, `SEED_REPLIES` and replace `authorId === 'you'` with the real Firebase UID
    - Call `patchSeedData` before `renderFeed`
    - _Requirements: 3.7_

  - [x] 5.3 Update feed rendering to use `resolveAuthor` for all author identities
    - For each post, comment, and reply, call `resolveAuthor(authorId, currentUser)` to get `{ username, photoURL }`
    - Render author handle as `@username` (or `@unknown` if username is empty)
    - Render avatar initial from `getAvatarInitial(username)` with colour from `avatarColor(uid)`
    - Update the compose box avatar to use the current user's initial and colour
    - Update the sidebar leaderboard to display `@username` handles
    - _Requirements: 3.3, 3.4, 3.5, 4.1, 4.2, 5.2, 5.3_

  - [x] 5.4 Write property test for author handle rendering
    - **Property 3: Author Handle Rendering**
    - **Validates: Requirements 3.3, 3.4**

  - [x] 5.5 Write property test for username-only display
    - **Property 2: Username-Only Display**
    - **Validates: Requirements 4.1, 4.2, 4.3, 2.8**

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update shop.html navbar with conditional avatar
  - [x] 7.1 Add Firebase Auth SDK import and `onAuthStateChanged` listener to `shop.html`
    - Use the same `firebaseConfig` as `dashboard.html`
    - On authenticated user: replace `.nav-end` content with the Avatar Button markup and render the user's avatar
    - On no session: leave the existing "Log In" and "Get Started" buttons untouched
    - _Requirements: 6.1, 6.2_

  - [x] 7.2 Fetch username and photoURL from Firestore for the shop.html avatar
    - Call `getDoc(users/{uid})` to retrieve `username` and `photoURL`
    - Render avatar initial or photo using the same `renderAvatar` logic
    - Wire dropdown toggle and Sign Out on `shop.html`
    - _Requirements: 6.1, 6.4_

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a minimum of 100 iterations per property
- The canonical avatar/dropdown CSS lives in `dashboard-page.css` — `engagement.html` must link that stylesheet or inline the relevant classes
- `shop.html` has its own inline `<style>` block; avatar styles should be added there directly
- All Firestore reads use `getDoc` (not `onSnapshot`) to keep the implementation simple and avoid open listeners
