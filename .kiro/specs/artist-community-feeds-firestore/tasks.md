# Implementation Plan: Remove Artist Discussion Feature

## Overview

This implementation removes the artist discussion feature from engagement.html, including all related HTML elements, JavaScript functions, CSS styles, and localStorage keys. The community feed remains as the primary interaction area.

## Tasks

- [x] 1. Remove artist discussion HTML elements from engagement.html
  - Remove the main view tabs section (`.main-view-tabs`)
  - Remove the artist view container (`#view-artists`)
  - Remove the artist picker card (`.artist-picker-card`)
  - Remove the artist discussion panel (`.artist-discussion-panel`)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Remove artist discussion JavaScript functions from engagement.html
  - [x] 2.1 Remove main view switching function
    - Remove `switchMainView(view)` function
    - _Requirements: 1.4_
  
  - [ ] 2.2 Remove artist search and selection functions
    - Remove `searchArtistMB()` function
    - Remove `selectArtist(artist)` function
    - Remove `closeArtistPanel()` function
    - Remove `renderRecentArtistChips()` function
    - _Requirements: 1.4_
  
  - [ ] 2.3 Remove artist comment functions
    - Remove `submitArtistComment()` function
    - Remove `toggleArtistCommentLike(commentId)` function
    - Remove `renderArtistComments()` function
    - Remove `buildArtistCommentElement(comment, cu)` function
    - _Requirements: 1.4_
  
  - [ ] 2.4 Remove artist storage helper functions
    - Remove `artistCommentsKey(artistId)` function
    - Remove `loadArtistComments(artistId)` function
    - Remove `saveArtistComments(artistId, comments)` function
    - Remove `loadRecentArtists()` function
    - Remove `saveRecentArtist(artist)` function
    - Remove `RECENT_ARTISTS_KEY` constant
    - _Requirements: 1.4, 1.6_
  
  - [ ] 2.5 Remove URL parameter handling
    - Remove `checkArtistUrlParam()` function
    - Remove call to `checkArtistUrlParam()` in `_engagementInit()`
    - _Requirements: 1.4_
  
  - [ ] 2.6 Remove artist state variable
    - Remove `activeArtist` variable declaration
    - _Requirements: 1.4_

- [ ] 3. Remove artist discussion CSS styles from engagement-page.css
  - [ ] 3.1 Remove main view tabs styles
    - Remove `.main-view-tabs` and `.main-view-tab` styles
    - _Requirements: 1.5_
  
  - [ ] 3.2 Remove artist picker card styles
    - Remove `.artist-picker-card` styles
    - Remove all `.ap-*` prefixed classes (`.ap-header`, `.ap-search-*`, `.ap-result-*`, `.ap-recent-*`)
    - _Requirements: 1.5_
  
  - [ ] 3.3 Remove artist discussion panel styles
    - Remove `.artist-discussion-panel` styles
    - Remove all `.adp-*` prefixed classes (`.adp-header`, `.adp-avatar`, `.adp-info`, `.adp-meta`, `.adp-back-btn`, `.adp-body`)
    - _Requirements: 1.5_
  
  - [ ] 3.4 Remove artist compose and comments styles
    - Remove `.artist-compose`, `.artist-compose-input`, `.artist-compose-actions` styles
    - Remove `.artist-comments-list` and `.artist-comment-empty` styles
    - _Requirements: 1.5_

- [ ] 4. Clean up localStorage keys
  - [ ] 4.1 Add cleanup function to remove artist comment keys
    - Create a one-time cleanup function that removes all `tw_artist_comments_*` keys
    - Remove `tw_recent_artists` key
    - Call cleanup function on page initialization
    - _Requirements: 1.6_

- [ ] 5. Checkpoint - Verify removal and test functionality
  - Ensure all tests pass, ask the user if questions arise.
  - Verify engagement.html loads without console errors
  - Verify community feed still works correctly
  - Verify no broken references to removed functions
  - Verify responsive layout still works
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

## Notes

- This is a code removal task, not a Firestore migration
- The community feed functionality remains unchanged
- All artist discussion features are being completely removed
- localStorage cleanup ensures no orphaned data remains
- No new features are being added in this implementation
