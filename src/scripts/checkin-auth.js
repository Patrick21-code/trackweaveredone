/* ═══════════════════════════════════════════════════════════
   TrackWeave — Check-in Page Authentication
   Handles Firebase auth and user profile for checkin.html
   ═══════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './modules/firebase-config.js';
import { setupAuthHandler, setupAvatarDropdown } from './modules/auth-handler.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authHandler = setupAuthHandler(auth, db, getDoc, doc, signOut);

onAuthStateChanged(auth, authHandler);

// Setup avatar dropdown
document.addEventListener('DOMContentLoaded', setupAvatarDropdown);
