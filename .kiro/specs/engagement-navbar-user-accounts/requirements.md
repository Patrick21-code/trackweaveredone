# Requirements Document

## Introduction

This feature updates the engagement page (`engagement.html`) of the TrackWeave music platform to replace the current placeholder navbar elements (Reward Shop nav link, Support link, and Log In button) with a user avatar component that serves as the primary identity element for authenticated users. It also replaces the hardcoded demo user accounts with real user accounts sourced from Firebase Authentication and Firestore — the same backend already used by `dashboard.html`. For privacy and consistency, only usernames are displayed (not full names). The changes must be reflected consistently across all pages that share the same nav pattern, and the overall design must remain clean, modern, and professional.

## Glossary

- **Engagement_Page**: The `frontend/engagement.html` page — the community feed of TrackWeave.
- **Navbar**: The sticky top navigation bar present on all TrackWeave pages.
- **Avatar_Button**: The circular button in the nav-end area that displays the current user's initial or photo and opens a dropdown menu.
- **Dropdown_Menu**: The panel that appears below the Avatar_Button, showing the user's username and navigation options.
- **Current_User**: The Firebase-authenticated user currently viewing the page.
- **Firebase_Auth**: The Firebase Authentication service used for session management across TrackWeave.
- **Firestore**: The Firebase Firestore database storing user profile data including `username`, `firstName`, `lastName`, `photoURL`, and `favoriteGenres`.
- **Username**: The unique handle stored in Firestore under the `username` field, displayed with an `@` prefix (e.g., `@janesmith`). Full names are never shown in the community context.
- **Demo_Users**: The hardcoded `USERS` object in `engagement.html` containing mock user data (`mia`, `james`, `priya`, etc.).
- **Real_User**: A user whose data is fetched from Firestore at runtime, identified by their Firebase UID.
- **Post_Author**: The user who created a post or comment, identified by their Firebase UID in stored engagement data.
- **Seed_Data**: The initial mock posts and comments (`SEED_POSTS`, `SEED_COMMENTS`, `SEED_REPLIES`) used to populate the feed on first visit.
- **Auth_Guard**: A redirect mechanism that sends unauthenticated visitors to `login.html`.

---

## Requirements

### Requirement 1: Auth Guard on Engagement Page

**User Story:** As a platform operator, I want the engagement page to be accessible only to authenticated users, so that community features are protected and user identity is always known.

#### Acceptance Criteria

1. WHEN a visitor loads `engagement.html` without an active Firebase session, THE Engagement_Page SHALL redirect the visitor to `login.html`.
2. WHEN a visitor loads `engagement.html` with an active Firebase session but has not completed onboarding, THE Engagement_Page SHALL redirect the visitor to `onboarding.html`.
3. WHILE a Firebase session is active and onboarding is complete, THE Engagement_Page SHALL render the full page content for the Current_User.

---

### Requirement 2: Replace Navbar Buttons with User Avatar

**User Story:** As an authenticated user, I want to see my avatar in the navbar instead of generic Log In and Support buttons, so that the page feels personalised and professional.

#### Acceptance Criteria

1. THE Navbar SHALL remove the "Reward Shop" nav link, the "Support" text link, and the "Log In" button from the nav-end area of `engagement.html`.
2. THE Navbar SHALL display an Avatar_Button in the nav-end area as the sole user identity element.
3. WHEN the Current_User has a `photoURL` stored in Firebase_Auth, THE Avatar_Button SHALL render the photo as a circular image.
4. WHEN the Current_User has no `photoURL`, THE Avatar_Button SHALL render the first character of the `username` field (uppercased) as the avatar initial, with a gradient background.
5. THE Avatar_Button SHALL have a diameter of 36–40 px, a circular shape, and a hover state that applies a coloured ring matching the brand blue (`#2563eb`).
6. WHEN the Avatar_Button is clicked, THE Dropdown_Menu SHALL toggle open or closed.
7. WHEN the Dropdown_Menu is open and the user clicks outside it, THE Dropdown_Menu SHALL close.
8. THE Dropdown_Menu SHALL display the Current_User's `username` prefixed with `@` and SHALL NOT display the user's full name.
9. THE Dropdown_Menu SHALL include navigation links to Dashboard, Community, and a Sign Out action.
10. WHEN the Sign Out action is triggered, THE Engagement_Page SHALL call `signOut` from Firebase_Auth and redirect to `login.html`.

---

### Requirement 3: Replace Demo Accounts with Real User Data

**User Story:** As a community member, I want posts and comments to show real usernames instead of placeholder names, so that the feed feels authentic.

#### Acceptance Criteria

1. THE Engagement_Page SHALL remove the hardcoded `USERS` object (`mia`, `james`, `priya`, `leo`, `soren`, `ada`) and the `CURRENT_USER` constant that references it.
2. THE Engagement_Page SHALL define the Current_User's identity from the Firebase-authenticated session and Firestore profile at page load.
3. WHEN a post or comment is authored by the Current_User, THE Engagement_Page SHALL display the Current_User's `username` (with `@` prefix) as the author handle.
4. WHEN a post or comment is authored by another user whose UID is stored in engagement data, THE Engagement_Page SHALL fetch that user's `username` from Firestore and display it.
5. IF a Firestore fetch for a post author fails or the document does not exist, THEN THE Engagement_Page SHALL display a fallback label of `@unknown` for that author.
6. THE Engagement_Page SHALL cache fetched user profiles in memory for the duration of the page session to avoid redundant Firestore reads.
7. THE Seed_Data SHALL be updated to use the Current_User's Firebase UID as the `authorId` for the "you" posts, replacing the hardcoded `'you'` string.

---

### Requirement 4: Username-Only Display (Privacy)

**User Story:** As a user, I want only my username to be shown in the community feed, so that my full name remains private.

#### Acceptance Criteria

1. THE Engagement_Page SHALL display only the `username` field (prefixed with `@`) wherever an author identity is shown in posts, comments, replies, the compose box, the sidebar, and the leaderboard.
2. THE Engagement_Page SHALL NOT display `firstName`, `lastName`, or any concatenation of them in the community context.
3. THE Dropdown_Menu SHALL display the `username` (with `@` prefix) as the primary identity label and SHALL NOT show the full name.
4. WHERE a `username` field is empty or undefined for the Current_User, THE Engagement_Page SHALL fall back to displaying the user's email address as the identity label.

---

### Requirement 5: Avatar Rendering in Feed

**User Story:** As a community member, I want each post and comment to show the author's avatar initial and colour, so that I can visually distinguish users at a glance.

#### Acceptance Criteria

1. THE Engagement_Page SHALL derive a consistent avatar colour for each user by hashing the user's UID or username to a hue value in the HSL colour space.
2. WHEN rendering a post or comment avatar, THE Engagement_Page SHALL display the first character of the author's `username` (uppercased) as the avatar initial.
3. IF the author's `username` is unavailable at render time, THEN THE Engagement_Page SHALL display `?` as the avatar initial with a neutral grey background.
4. THE Engagement_Page SHALL apply the same avatar colour consistently for the same user across all posts, comments, and the compose box within a single page session.

---

### Requirement 6: Consistent Navbar Across Other Pages

**User Story:** As a user navigating between pages, I want the navbar to look and behave consistently, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE Navbar on `shop.html` SHALL replace the "Support" link and "Log In" button in the nav-end area with the Avatar_Button when a Firebase session is active.
2. THE Navbar on `shop.html` SHALL retain the "Get Started" button and "Log In" button only when no Firebase session is active.
3. WHERE `dashboard.html` already implements the Avatar_Button pattern, THE Engagement_Page SHALL adopt the same CSS classes and dropdown structure for visual consistency.
4. THE Avatar_Button styles (size, ring, dropdown) on `engagement.html` SHALL match the Avatar_Button styles defined in `dashboard-page.css` to within visual equivalence.

---

### Requirement 7: Secure and Reliable Backend Integration

**User Story:** As a platform operator, I want user data to be read from Firebase securely, so that the engagement page handles real accounts reliably.

#### Acceptance Criteria

1. THE Engagement_Page SHALL initialise Firebase using the same `firebaseConfig` object already used in `dashboard.html`, with no hardcoded credentials beyond what is already present in the frontend codebase.
2. THE Engagement_Page SHALL use `onAuthStateChanged` from Firebase_Auth as the sole mechanism for determining session state, and SHALL NOT rely on `localStorage` flags for authentication.
3. WHEN Firestore is unavailable or a read times out, THE Engagement_Page SHALL display the feed with available cached data and SHALL NOT crash or show a blank page.
4. THE Engagement_Page SHALL request only the Firestore fields required for display (`username`, `photoURL`) when fetching other users' profiles, using field masks where the Firestore SDK supports it.
5. THE Engagement_Page SHALL store engagement data (posts, comments, replies) in `localStorage` under the existing `tw_engagement` key, unchanged from the current implementation, so that no server-side storage is required for community content at this stage.
