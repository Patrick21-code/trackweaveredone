# Firestore Security Rules Deployment Guide

## Overview
This guide explains how to deploy the Firestore security rules to fix the comment posting permission error.

## The Issue
The application uses a **subcollection structure** for artist comments:
```
artistComments/{artistId}/comments/{commentId}
```

The security rules need to match this structure to allow authenticated users to post comments.

## Deployment Steps

### Option 1: Deploy via Firebase Console (Recommended)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **trackweave-26cad**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents of `firestore.rules` from this repository
6. Paste into the rules editor
7. Click **Publish** to deploy the rules

### Option 2: Deploy via Firebase CLI

If you have the Firebase CLI installed:

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## Security Rules Explanation

### Read Access
```javascript
allow read: if request.auth != null;
```
- Any authenticated user can read comments
- Unauthenticated users cannot read comments

### Create Access
```javascript
allow create: if request.auth != null
  && request.resource.data.keys().hasAll([
    'artistId', 'authorId', 'text', 'createdAt', 'likes'
  ])
  && request.resource.data.authorId == request.auth.uid
  && request.resource.data.text is string
  && request.resource.data.text.size() >= 1
  && request.resource.data.text.size() <= 300
  && request.resource.data.artistId is string
  && request.resource.data.artistId.size() > 0
  && request.resource.data.likes is list;
```
- User must be authenticated
- Comment must include all required fields
- `authorId` must match the authenticated user's UID (prevents impersonation)
- Text must be between 1-300 characters
- `artistId` must be a non-empty string
- `likes` must be an array

### Update Access
```javascript
allow update: if request.auth != null
  && request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['likes'])
  && request.resource.data.likes is list;
```
- User must be authenticated
- Only the `likes` array can be modified
- Cannot modify text, authorId, artistId, or createdAt

### Delete Access
```javascript
allow delete: if request.auth != null
  && resource.data.authorId == request.auth.uid;
```
- User must be authenticated
- Users can only delete their own comments

## Testing the Rules

After deployment, test the rules by:

1. **Navigate to the Community page** (engagement.html)
2. **Search for an artist** using the search box
3. **Select an artist** to open their community chat
4. **Post a comment** - it should now work without permission errors
5. **Like a comment** - should work for any authenticated user
6. **Try to delete** - should only work for your own comments

## Verification

Check the browser console for any errors:
- ✅ No "permission-denied" errors
- ✅ Comments load successfully
- ✅ Comments can be posted
- ✅ Likes can be toggled

## Troubleshooting

### Still getting permission errors?
1. Verify the rules were published successfully in Firebase Console
2. Check that you're logged in (refresh the page if needed)
3. Clear browser cache and reload
4. Check browser console for specific error messages

### Rules not taking effect?
- Rules changes are immediate, but you may need to refresh the page
- If using Firebase Emulator, restart the emulator after rule changes

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Common Security Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-conditions)
