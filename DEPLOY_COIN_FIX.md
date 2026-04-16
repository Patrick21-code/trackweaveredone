# Deploy Coin Balance Fix 🪙

## The Issue
The coin balance code is updated in your repository, but your web browser is still loading the **old version** of the JavaScript files from your web server.

## Quick Fix (Choose ONE method)

### Method 1: Deploy via Firebase Hosting (Recommended)

If you're using Firebase Hosting, run this command in your terminal:

```bash
firebase deploy --only hosting
```

**Or deploy everything:**
```bash
firebase deploy
```

This will upload the updated `shop.js` and `checkin.js` files to your hosting.

---

### Method 2: Hard Refresh Your Browser (Temporary Test)

If you want to test locally before deploying:

1. **Clear your browser cache:**
   - **Chrome/Edge**: Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard refresh the page:**
   - **Windows**: `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac**: `Cmd + Shift + R`

3. **Or use Incognito/Private mode:**
   - Open a new incognito window
   - Navigate to your site
   - The coin balance should now appear

**Note**: This only works if you're testing locally. For production, you need Method 1.

---

### Method 3: Manual File Upload

If you're using a different hosting service:

1. Locate these files in your repository:
   - `src/scripts/shop.js`
   - `src/scripts/checkin.js`

2. Upload them to your web server, replacing the old versions

3. Make sure they're in the correct paths:
   - `your-domain.com/src/scripts/shop.js`
   - `your-domain.com/src/scripts/checkin.js`

---

## Verify the Fix

After deploying, test the coin balance:

### Test 1: Shop Page
1. Go to `your-site.com/src/pages/shop.html`
2. **Look at the banner at the top**
3. ✅ You should see: **"1,250"** (or your current balance)
4. ❌ If you see: **"0"** → The old code is still cached

### Test 2: Check-In Page
1. Go to `your-site.com/src/pages/checkin.html`
2. **Look at the banner at the top**
3. ✅ You should see: **"1,250"** (or your current balance)
4. Click "Check In" button
5. ✅ Balance should increase to **"1,300"**

### Test 3: Persistence
1. Go back to Shop page
2. ✅ Balance should still show **"1,300"**

---

## Still Not Working?

### Check 1: Verify Files Are Deployed
Open your browser's Developer Tools:
1. Press `F12` to open DevTools
2. Go to **Network** tab
3. Refresh the page (`F5`)
4. Find `shop.js` in the list
5. Click on it
6. Look for this code in the **Response** tab:

```javascript
// Initialize points banner on page load
document.addEventListener('DOMContentLoaded', () => {
  const state = loadUserData();
  updateBanner(state);
});
```

- ✅ **If you see this**: Files are deployed correctly
- ❌ **If you don't see this**: Files are not deployed yet

### Check 2: Clear Browser Cache Completely
1. Close ALL browser tabs
2. Clear cache: `Ctrl + Shift + Delete`
3. Select "All time" for time range
4. Check "Cached images and files"
5. Click "Clear data"
6. Restart browser
7. Visit your site again

### Check 3: Check Console for Errors
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Refresh the page
4. Look for any red error messages
5. If you see errors, share them for troubleshooting

---

## What Changed in the Code?

### shop.js (Lines 505-509)
**Before:**
```javascript
renderShop();
```

**After:**
```javascript
// Initialize points banner on page load
document.addEventListener('DOMContentLoaded', () => {
  const state = loadUserData();
  updateBanner(state);
});

renderShop();
```

### checkin.js (Lines 1004-1018)
The initialization was enhanced to ensure `updateUI()` is called properly on page load.

---

## Quick Command Reference

### If using Firebase Hosting:
```bash
# Deploy only hosting files (fastest)
firebase deploy --only hosting

# Or deploy everything
firebase deploy

# Check deployment status
firebase hosting:channel:list
```

### If using Git:
```bash
# Commit the changes
git add src/scripts/shop.js src/scripts/checkin.js
git commit -m "Fix coin balance display on page load"
git push

# Then deploy to your hosting service
```

---

## Expected Timeline

- **Deploy command**: 30 seconds - 2 minutes
- **Cache clear**: 10 seconds
- **Testing**: 1 minute
- **Total**: ~3-5 minutes

---

## Success Checklist

After deployment, you should see:
- ✅ Coin balance displays immediately on shop.html
- ✅ Coin balance displays immediately on checkin.html
- ✅ Coin balance updates when you check in
- ✅ Coin balance persists when navigating between pages
- ✅ No "0" showing in the banner
- ✅ No console errors

---

## Need More Help?

If the coin balance still doesn't work after deploying:

1. **Take a screenshot** of:
   - The shop page showing the coin balance
   - The browser console (F12 → Console tab)
   - The Network tab showing shop.js loaded

2. **Check if you're testing on**:
   - Local file system (file://) → Won't work, need a web server
   - Local server (localhost) → Should work after refresh
   - Production server → Need to deploy first

3. **Verify localStorage**:
   - Press F12 → Application tab → Local Storage
   - Look for key: `tw_points`
   - Value should be: `"1250"` or similar
   - If missing, the app will create it on first load

---

## Pro Tip: Bypass Cache During Development

Add this to your HTML files temporarily during development:

```html
<script src="../scripts/shop.js?v=2"></script>
```

The `?v=2` forces the browser to reload the file. Increment the number each time you make changes.

**Remove this before production deployment!**
