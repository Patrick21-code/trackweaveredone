/* ================================================================
   Comment Cleanup Utility
   Run this in the browser console on the engagement page to delete
   all comments from all artist discussions
   ================================================================ */

async function deleteAllComments() {
  console.log('🧹 Starting comment cleanup...');
  
  const db = window._fbDb;
  if (!db) {
    console.error('❌ Firestore not initialized. Please run this on the engagement page.');
    return;
  }

  const cu = window._currentUser;
  if (!cu) {
    console.error('❌ No user logged in.');
    return;
  }

  try {
    const { collection, getDocs, deleteDoc, doc } = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
    );

    // Get all artist comment collections
    // Note: We need to know which artists have comments
    // For now, we'll delete comments from the currently active artist
    
    if (!window.activeArtist) {
      console.error('❌ No active artist selected. Please select an artist first.');
      return;
    }

    const artistId = window.activeArtist.id;
    const artistName = window.activeArtist.name;
    
    console.log(`🎵 Deleting comments for artist: ${artistName}`);
    
    const commentsRef = collection(db, 'artistComments', artistId, 'comments');
    const snapshot = await getDocs(commentsRef);
    
    console.log(`📊 Found ${snapshot.size} comments to delete`);
    
    let deleted = 0;
    const deletePromises = [];
    
    snapshot.forEach((docSnap) => {
      const commentRef = doc(db, 'artistComments', artistId, 'comments', docSnap.id);
      deletePromises.push(
        deleteDoc(commentRef)
          .then(() => {
            deleted++;
            console.log(`✅ Deleted comment ${deleted}/${snapshot.size}`);
          })
          .catch((error) => {
            console.error(`❌ Failed to delete comment ${docSnap.id}:`, error);
          })
      );
    });
    
    await Promise.all(deletePromises);
    
    console.log(`✨ Cleanup complete! Deleted ${deleted} comments.`);
    
    // Reset stats
    const stats = {
      comments: 0,
      likesGiven: 0,
      rewardsSent: 0,
      rewardsReceived: 0
    };
    localStorage.setItem('tw_eng_stats', JSON.stringify(stats));
    
    console.log('📊 Stats reset to zero.');
    
    // Refresh the page to see changes
    if (confirm('Comments deleted! Refresh the page to see changes?')) {
      window.location.reload();
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Also provide a function to delete comments from ALL artists
async function deleteAllCommentsFromAllArtists() {
  console.log('🧹 Starting FULL comment cleanup (all artists)...');
  
  const db = window._fbDb;
  if (!db) {
    console.error('❌ Firestore not initialized. Please run this on the engagement page.');
    return;
  }

  const cu = window._currentUser;
  if (!cu) {
    console.error('❌ No user logged in.');
    return;
  }

  if (!confirm('⚠️ This will delete ALL comments from ALL artists. Are you sure?')) {
    console.log('❌ Cancelled by user.');
    return;
  }

  try {
    const { collection, getDocs, deleteDoc, doc, collectionGroup, query } = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
    );

    // Use collectionGroup to get all comments across all artists
    console.log('🔍 Searching for all comments...');
    
    const commentsQuery = query(collectionGroup(db, 'comments'));
    const snapshot = await getDocs(commentsQuery);
    
    console.log(`📊 Found ${snapshot.size} total comments across all artists`);
    
    let deleted = 0;
    const deletePromises = [];
    
    snapshot.forEach((docSnap) => {
      // Get the parent path to reconstruct the full document reference
      const pathSegments = docSnap.ref.path.split('/');
      // Path format: artistComments/{artistId}/comments/{commentId}
      const artistId = pathSegments[1];
      const commentId = pathSegments[3];
      
      const commentRef = doc(db, 'artistComments', artistId, 'comments', commentId);
      deletePromises.push(
        deleteDoc(commentRef)
          .then(() => {
            deleted++;
            console.log(`✅ Deleted comment ${deleted}/${snapshot.size}`);
          })
          .catch((error) => {
            console.error(`❌ Failed to delete comment ${commentId}:`, error);
          })
      );
    });
    
    await Promise.all(deletePromises);
    
    console.log(`✨ Full cleanup complete! Deleted ${deleted} comments from all artists.`);
    
    // Reset stats
    const stats = {
      comments: 0,
      likesGiven: 0,
      rewardsSent: 0,
      rewardsReceived: 0
    };
    localStorage.setItem('tw_eng_stats', JSON.stringify(stats));
    
    console.log('📊 Stats reset to zero.');
    
    // Refresh the page to see changes
    if (confirm('All comments deleted! Refresh the page to see changes?')) {
      window.location.reload();
    }
    
  } catch (error) {
    console.error('❌ Error during full cleanup:', error);
  }
}

// Expose functions globally
window.deleteAllComments = deleteAllComments;
window.deleteAllCommentsFromAllArtists = deleteAllCommentsFromAllArtists;

console.log('🛠️ Comment cleanup utilities loaded!');
console.log('📝 Available commands:');
console.log('  - deleteAllComments() - Delete comments from current artist');
console.log('  - deleteAllCommentsFromAllArtists() - Delete ALL comments from ALL artists');
