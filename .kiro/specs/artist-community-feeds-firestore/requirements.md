# Requirements Document

## Introduction

This feature migrates the artist discussion system from localStorage to Firestore, enabling real-time multi-user community feeds for each artist. Currently, artist comments are stored locally using keys like `tw_artist_comments_${artistId}`, meaning users can only see their own comments. The new system will store all artist comments in Firestore, allowing users to see comments from all community members in real-time while maintaining per-artist isolation.

## Glossary

- **Artist_Feed**: A collection of comments and discussions specific to a single artist, isolated from other artists
- **Comment**: A user-generated text post within an Artist_Feed, including metadata like author, timestamp, and likes
- **Firestore**: Google's real-time NoSQL cloud database service
- **Real_Time_Listener**: A Firestore subscription that automatically updates the UI when data changes
- **Artist_ID**: A unique identifier for an artist from the MusicBrainz API
- **User_Profile**: User account information including UID, username, and photoURL from Firebase Authentication
- **Security_Rules**: Firestore server-side rules that control read/write access to data
- **Community_Feed_View**: The main UI section where users interact with artist-specific discussions
- **localStorage**: Browser-based client-side storage (current implementation, being replaced)

## Requirements

### Requirement 1: Remove Artist Discussion Section from engagement.html

**User Story:** As a developer, I want to remove the existing artist discussion section from engagement.html, so that the community feed becomes the primary interaction area.

#### Acceptance Criteria

1. THE System SHALL remove the "Artist Discussions" tab from the main view tabs in engagement.html
2. THE System SHALL remove all HTML elements related to the artist picker card (artist-picker-card)
3. THE System SHALL remove all HTML elements related to the artist discussion panel (artist-discussion-panel)
4. THE System SHALL remove all JavaScript functions specific to artist discussions (switchMainView, searchArtistMB, selectArtist, closeArtistPanel, submitArtistComment, toggleArtistCommentLike, renderArtistComments, buildArtistCommentElement, checkArtistUrlParam)
5. THE System SHALL remove all CSS styles specific to artist discussions (.main-view-tabs, .artist-picker-card, .artist-discussion-panel, .ap-*, .adp-*)
6. THE System SHALL remove localStorage keys for artist comments (tw_artist_comments_${artistId}) and recent artists (tw_recent_artists)

### Requirement 2: Migrate Artist Comments to Firestore

**User Story:** As a user, I want my artist comments to be stored in Firestore, so that I can see comments from other users in real-time.

#### Acceptance Criteria

1. THE System SHALL create a Firestore collection named "artistComments" to store all artist comments
2. WHEN a user submits a comment, THE System SHALL store it in Firestore with fields: id, artistId, artistName, authorId, authorName, text, createdAt, likes (array of UIDs), photoURL
3. THE System SHALL generate unique comment IDs using a combination of timestamp and random string
4. THE System SHALL validate that artistId is not empty before storing a comment
5. THE System SHALL validate that text content is between 1 and 300 characters before storing
6. THE System SHALL store createdAt as a Firestore Timestamp for proper sorting
7. THE System SHALL initialize the likes array as empty when creating a new comment

### Requirement 3: Implement Real-Time Comment Synchronization

**User Story:** As a user, I want to see new comments from other users appear automatically, so that I can engage in real-time discussions.

#### Acceptance Criteria

1. WHEN a user views an artist's community feed, THE System SHALL establish a Real_Time_Listener for that artist's comments
2. THE Real_Time_Listener SHALL filter comments by artistId to ensure per-artist isolation
3. THE Real_Time_Listener SHALL order comments by createdAt in descending order (newest first)
4. WHEN a new comment is added to Firestore, THE System SHALL automatically update the UI without requiring a page refresh
5. WHEN a comment is modified (likes updated), THE System SHALL automatically reflect the change in the UI
6. WHEN a user navigates away from an artist feed, THE System SHALL unsubscribe from the Real_Time_Listener to prevent memory leaks
7. THE System SHALL limit the initial query to the 50 most recent comments per artist

### Requirement 4: Display Only Usernames for Privacy

**User Story:** As a user, I want to see only usernames (not full names) in the community feed, so that my privacy is maintained.

#### Acceptance Criteria

1. THE System SHALL display usernames in the format "@username" for all comments
2. WHEN a user's profile does not have a username, THE System SHALL display "Anonymous" instead
3. THE System SHALL NOT display email addresses or full names in the community feed
4. THE System SHALL use the username field from the User_Profile for all author displays
5. THE System SHALL maintain the existing avatar rendering system using deterministic colors based on UID

### Requirement 5: Implement Per-Artist Feed Isolation

**User Story:** As a user, I want to see only comments related to the artist I'm viewing, so that discussions remain focused and organized.

#### Acceptance Criteria

1. WHEN a user views Artist A's feed, THE System SHALL query only comments where artistId equals Artist A's ID
2. THE System SHALL NOT display comments from Artist B when viewing Artist A's feed
3. THE System SHALL store artistId and artistName with each comment for filtering and display purposes
4. THE System SHALL validate artistId matches the current artist before displaying any comment
5. THE System SHALL maintain separate Real_Time_Listeners for each artist feed to ensure isolation

### Requirement 6: Implement Firestore Security Rules

**User Story:** As a system administrator, I want secure Firestore rules, so that users can only perform authorized operations.

#### Acceptance Criteria

1. THE Security_Rules SHALL allow any authenticated user to read comments from the artistComments collection
2. THE Security_Rules SHALL allow authenticated users to create comments only if authorId matches their UID
3. THE Security_Rules SHALL allow users to update only the likes array of a comment
4. THE Security_Rules SHALL prevent users from modifying the text, authorId, artistId, or createdAt fields after creation
5. THE Security_Rules SHALL prevent users from deleting comments they did not author
6. THE Security_Rules SHALL validate that required fields (artistId, authorId, text, createdAt) are present on creation
7. THE Security_Rules SHALL validate that text length is between 1 and 300 characters

### Requirement 7: Handle Loading States and Errors

**User Story:** As a user, I want to see clear feedback when comments are loading or if errors occur, so that I understand the system status.

#### Acceptance Criteria

1. WHEN comments are being loaded from Firestore, THE System SHALL display a loading indicator
2. WHEN no comments exist for an artist, THE System SHALL display an empty state message encouraging users to post
3. IF a Firestore operation fails, THE System SHALL display an error toast notification with a user-friendly message
4. IF a user is not authenticated, THE System SHALL display a message prompting them to log in
5. THE System SHALL handle network disconnections gracefully by showing a "reconnecting" indicator
6. WHEN a comment submission fails, THE System SHALL retain the user's input text for retry
7. THE System SHALL log detailed error information to the browser console for debugging

### Requirement 8: Implement Like Functionality with Firestore

**User Story:** As a user, I want to like comments in the artist feed, so that I can show appreciation for contributions.

#### Acceptance Criteria

1. WHEN a user clicks the like button on a comment, THE System SHALL add their UID to the likes array in Firestore
2. WHEN a user clicks the like button on an already-liked comment, THE System SHALL remove their UID from the likes array
3. THE System SHALL use Firestore arrayUnion to add UIDs atomically without race conditions
4. THE System SHALL use Firestore arrayRemove to remove UIDs atomically without race conditions
5. THE System SHALL display the current like count next to the like button
6. THE System SHALL visually indicate when the current user has liked a comment (filled heart icon)
7. THE System SHALL update the like count in real-time when other users like the comment

### Requirement 9: Maintain Existing UI/UX Design Patterns

**User Story:** As a user, I want the artist feed to maintain the existing visual design, so that the interface remains familiar and consistent.

#### Acceptance Criteria

1. THE System SHALL preserve the existing CSS styles for comment cards (.comment, .comment-bubble, .comment-avatar)
2. THE System SHALL maintain the existing avatar rendering system with deterministic colors
3. THE System SHALL preserve the existing comment action buttons (like, reward)
4. THE System SHALL maintain the existing compose box design for submitting comments
5. THE System SHALL preserve the existing responsive layout for mobile and desktop views
6. THE System SHALL maintain the existing typography and spacing conventions
7. THE System SHALL preserve the existing color scheme and visual hierarchy

### Requirement 10: Optimize Firestore Query Performance

**User Story:** As a developer, I want efficient Firestore queries, so that the application remains fast and cost-effective.

#### Acceptance Criteria

1. THE System SHALL create a composite index on (artistId, createdAt) for efficient querying
2. THE System SHALL limit initial queries to 50 comments per artist to reduce data transfer
3. THE System SHALL implement pagination for loading older comments when users scroll
4. THE System SHALL cache user profile data to minimize redundant Firestore reads
5. THE System SHALL debounce like button clicks to prevent excessive write operations
6. THE System SHALL unsubscribe from Real_Time_Listeners when components unmount
7. THE System SHALL use Firestore's offline persistence to improve perceived performance

### Requirement 11: Preserve Comment Metadata and Timestamps

**User Story:** As a user, I want to see when comments were posted, so that I can understand the timeline of discussions.

#### Acceptance Criteria

1. THE System SHALL display relative timestamps (e.g., "2m ago", "3h ago", "5d ago") for all comments
2. THE System SHALL use the existing formatTime() function for consistent timestamp formatting
3. THE System SHALL store timestamps as Firestore Timestamp objects for accurate sorting
4. THE System SHALL handle timezone differences correctly by using UTC timestamps
5. THE System SHALL update relative timestamps dynamically as time passes
6. WHEN a comment is less than 1 minute old, THE System SHALL display "just now"
7. THE System SHALL sort comments by createdAt in descending order (newest first)

### Requirement 12: Integrate with Existing Reward System

**User Story:** As a user, I want to send rewards to artist feed comments, so that I can appreciate valuable contributions.

#### Acceptance Criteria

1. THE System SHALL preserve the existing reward button on artist feed comments
2. WHEN a user clicks the reward button, THE System SHALL open the existing reward picker modal
3. THE System SHALL store reward data in Firestore alongside comment data
4. THE System SHALL display reward pills on comments showing the icon and count
5. THE System SHALL update reward counts in real-time when other users send rewards
6. THE System SHALL maintain the existing reward inventory system from shop.html
7. THE System SHALL track rewards sent and received in user statistics

### Requirement 13: Handle Artist Navigation from artist-details.html

**User Story:** As a user, I want to navigate from artist-details.html to the artist's community feed, so that I can participate in discussions about that artist.

#### Acceptance Criteria

1. WHEN a user clicks a link from artist-details.html, THE System SHALL navigate to engagement.html with artist context
2. THE System SHALL accept URL parameters (artist, artistName, artistType) to identify the target artist
3. THE System SHALL automatically load the specified artist's community feed on page load
4. THE System SHALL display the artist's name and metadata in the feed header
5. THE System SHALL preserve the artist context throughout the user's session
6. THE System SHALL update the browser URL to reflect the current artist context
7. THE System SHALL handle missing or invalid artist parameters gracefully

### Requirement 14: Implement Comment Submission with Validation

**User Story:** As a user, I want to submit comments with proper validation, so that I receive clear feedback on any issues.

#### Acceptance Criteria

1. WHEN a user submits an empty comment, THE System SHALL display an error toast "Write something first!"
2. WHEN a user submits a comment exceeding 300 characters, THE System SHALL prevent submission and show a character count warning
3. THE System SHALL trim whitespace from comment text before submission
4. THE System SHALL disable the submit button while a comment is being saved to prevent duplicate submissions
5. THE System SHALL clear the input field after successful submission
6. THE System SHALL display a success toast "Comment posted! 🎵" after successful submission
7. THE System SHALL re-enable the submit button after submission completes (success or failure)

### Requirement 15: Maintain User Statistics and Activity Log

**User Story:** As a user, I want my comment activity to be tracked in my statistics, so that I can see my engagement metrics.

#### Acceptance Criteria

1. WHEN a user posts a comment, THE System SHALL increment their comments count in user statistics
2. WHEN a user likes a comment, THE System SHALL increment their likesGiven count in user statistics
3. THE System SHALL add activity log entries for comment submissions with format "You commented on [Artist Name]"
4. THE System SHALL add activity log entries for likes with format "You liked a comment on [Artist Name]"
5. THE System SHALL preserve the existing activity feed rendering in the sidebar
6. THE System SHALL maintain the existing stats grid display (posts, comments, likes, rewards)
7. THE System SHALL update statistics in real-time as users interact with the feed
