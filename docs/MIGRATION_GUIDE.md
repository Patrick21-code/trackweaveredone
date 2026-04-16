# Migration Guide: Old Structure → New Structure

This guide helps you understand the changes made during the project reorganization and how to update any references.

## 🎯 Overview

The project has been reorganized from a flat structure to a modular, scalable architecture:

```
OLD STRUCTURE              →    NEW STRUCTURE
─────────────────────────────────────────────────────
frontend/                  →    src/pages/
styles/                    →    src/styles/
scripts/                   →    src/scripts/
tests/                     →    tests/unit/
CHECKIN_FEATURE.md         →    docs/CHECKIN_FEATURE.md
```

## 📋 Complete File Mapping

### HTML Pages
| Old Path | New Path |
|----------|----------|
| `frontend/index.html` | `src/pages/index.html` |
| `frontend/about.html` | `src/pages/about.html` |
| `frontend/support.html` | `src/pages/support.html` |
| `frontend/login.html` | `src/pages/login.html` |
| `frontend/register.html` | `src/pages/register.html` |
| `frontend/onboarding.html` | `src/pages/onboarding.html` |
| `frontend/dashboard.html` | `src/pages/dashboard.html` |
| `frontend/artist-details.html` | `src/pages/artist-details.html` |
| `frontend/engagement.html` | `src/pages/engagement.html` |
| `frontend/checkin.html` | `src/pages/checkin.html` |
| `frontend/shop.html` | `src/pages/shop.html` |

### CSS Files
| Old Path | New Path |
|----------|----------|
| `styles/trackweave-base.css` | `src/styles/base.css` |
| `styles/index-page.css` | `src/styles/pages/index.css` |
| `styles/about-page.css` | `src/styles/pages/about.css` |
| `styles/support-page.css` | `src/styles/pages/support.css` |
| `styles/auth-page.css` | `src/styles/pages/auth.css` |
| `styles/dashboard-page.css` | `src/styles/pages/dashboard.css` |
| `styles/engagement-page.css` | `src/styles/pages/engagement.css` |
| `styles/checkin-page.css` | `src/styles/pages/checkin.css` |

### JavaScript Files
| Old Path | New Path |
|----------|----------|
| `scripts/checkin.js` | `src/scripts/checkin.js` |

### Test Files
| Old Path | New Path |
|----------|----------|
| `tests/avatar.test.js` | `tests/unit/avatar.test.js` |
| `tests/cache.test.js` | `tests/unit/cache.test.js` |
| `tests/feed.test.js` | `tests/unit/feed.test.js` |

### Documentation
| Old Path | New Path |
|----------|----------|
| `CHECKIN_FEATURE.md` | `docs/CHECKIN_FEATURE.md` |

## 🔧 Required Updates

### 1. CSS Link References

#### In HTML Files
Update all stylesheet links:

**Before:**
```html
<link rel="stylesheet" href="../styles/trackweave-base.css" />
<link rel="stylesheet" href="../styles/index-page.css" />
```

**After:**
```html
<link rel="stylesheet" href="../styles/base.css" />
<link rel="stylesheet" href="../styles/pages/index.css" />
```

### 2. JavaScript Script References

#### In HTML Files
Update all script sources:

**Before:**
```html
<script src="../scripts/checkin.js"></script>
```

**After:**
```html
<script src="../scripts/checkin.js"></script>
```
*(Path remains the same relative to pages)*

### 3. Internal Page Links

#### In Navigation Menus
Update all internal links:

**Before:**
```html
<a href="./index.html">Home</a>
<a href="./about.html">About</a>
```

**After:**
```html
<a href="./index.html">Home</a>
<a href="./about.html">About</a>
```
*(No change needed - relative paths work the same)*

### 4. Asset References

#### Images (Future)
When adding images:

**Before:**
```html
<img src="../images/logo.png" />
```

**After:**
```html
<img src="../assets/images/logo.png" />
```

## 🚀 Quick Update Script

If you need to update path references in bulk, use these commands:

### Update CSS References (PowerShell)
```powershell
# Update base.css references
Get-ChildItem -Path "src/pages" -Filter "*.html" -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'trackweave-base\.css', 'base.css' | Set-Content $_.FullName
}

# Update page CSS references
Get-ChildItem -Path "src/pages" -Filter "*.html" -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'styles/(\w+)-page\.css', 'styles/pages/$1.css' | Set-Content $_.FullName
}
```

### Update CSS References (Bash)
```bash
# Update base.css references
find src/pages -name "*.html" -exec sed -i 's/trackweave-base\.css/base.css/g' {} +

# Update page CSS references
find src/pages -name "*.html" -exec sed -i 's/styles\/\([a-z]*\)-page\.css/styles\/pages\/\1.css/g' {} +
```

## 📝 Checklist

Use this checklist to ensure all updates are complete:

### HTML Files
- [ ] All CSS links updated to new paths
- [ ] All script sources updated to new paths
- [ ] All internal page links verified
- [ ] All asset references updated (if any)

### CSS Files
- [ ] All `@import` statements updated (if any)
- [ ] All `url()` references updated (if any)

### JavaScript Files
- [ ] All module imports updated (if any)
- [ ] All dynamic path references updated

### Test Files
- [ ] All test imports updated
- [ ] All test file paths updated in test runner config

### Documentation
- [ ] README.md updated with new structure
- [ ] All documentation references updated
- [ ] Code examples updated with new paths

## 🔍 Verification

### 1. Check All Pages Load
Open each HTML file in a browser and verify:
- ✅ Styles load correctly
- ✅ Scripts execute without errors
- ✅ Navigation links work
- ✅ No 404 errors in console

### 2. Run Tests
```bash
npm test
```
Ensure all tests pass with new file locations.

### 3. Check Build (if applicable)
```bash
npm run build
```
Verify build completes without errors.

## 🐛 Common Issues & Solutions

### Issue 1: Styles Not Loading
**Symptom:** Page appears unstyled

**Solution:** Check CSS link paths in HTML:
```html
<!-- Correct -->
<link rel="stylesheet" href="../styles/base.css" />

<!-- Incorrect -->
<link rel="stylesheet" href="../styles/trackweave-base.css" />
```

### Issue 2: Scripts Not Running
**Symptom:** JavaScript functionality broken

**Solution:** Check script source paths:
```html
<!-- Correct -->
<script src="../scripts/checkin.js"></script>

<!-- Incorrect -->
<script src="../../scripts/checkin.js"></script>
```

### Issue 3: 404 Errors
**Symptom:** Browser console shows 404 errors

**Solution:** 
1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Verify file exists at expected location
4. Update path in source file

### Issue 4: Tests Failing
**Symptom:** Test suite reports failures

**Solution:** Update test file imports:
```javascript
// Before
import { function } from '../src/module.js';

// After
import { function } from '../../src/scripts/modules/module.js';
```

## 📚 Additional Resources

- [Project Structure Documentation](./ARCHITECTURE.md)
- [README.md](../README.md)
- [Check-in Feature Documentation](./CHECKIN_FEATURE.md)

## 🆘 Getting Help

If you encounter issues during migration:

1. **Check this guide** for common solutions
2. **Review the Architecture docs** for structure details
3. **Check git history** to see what changed:
   ```bash
   git log --follow -- path/to/file
   ```
4. **Create an issue** on GitHub with:
   - What you're trying to do
   - What error you're seeing
   - What you've already tried

## ✅ Post-Migration Tasks

After completing the migration:

1. **Update bookmarks** to new file locations
2. **Update IDE workspace** settings if needed
3. **Update deployment scripts** with new paths
4. **Update CI/CD pipelines** if applicable
5. **Notify team members** of the changes
6. **Update any external documentation**

## 🎉 Benefits of New Structure

After migration, you'll enjoy:

- ✅ **Better Organization**: Files grouped logically
- ✅ **Easier Navigation**: Predictable file locations
- ✅ **Improved Scalability**: Room for growth
- ✅ **Enhanced Maintainability**: Simpler updates
- ✅ **Team Collaboration**: Clearer structure for multiple developers

---

**Migration completed?** Great! You're now working with a clean, professional project structure. 🚀
