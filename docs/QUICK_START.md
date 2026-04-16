# Quick Start Guide

Get up and running with TrackWeave in minutes!

## 🚀 Installation

### Prerequisites
- Node.js v16 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/trackweave.git
cd trackweave
```

2. **Install dependencies**
```bash
npm install
```

3. **Open the application**
```bash
# Option 1: Open directly in browser
open src/pages/index.html

# Option 2: Use a local server (recommended)
npx serve src/pages
```

4. **Run tests** (optional)
```bash
npm test
```

## 📂 Project Structure

```
trackweave/
├── src/
│   ├── pages/       # HTML pages - start here!
│   ├── styles/      # CSS stylesheets
│   ├── scripts/     # JavaScript files
│   └── assets/      # Images & fonts
├── tests/           # Test files
├── docs/            # Documentation
└── README.md        # Project overview
```

## 🎯 Key Pages

### For Users
- **Landing Page**: `src/pages/index.html`
- **Daily Check-In**: `src/pages/checkin.html`
- **Rewards Shop**: `src/pages/shop.html`
- **Dashboard**: `src/pages/dashboard.html`

### For Developers
- **Architecture**: `docs/ARCHITECTURE.md`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`
- **Migration Guide**: `docs/MIGRATION_GUIDE.md`

## 🎮 Try These Features

### 1. Daily Check-In System
1. Open `src/pages/checkin.html`
2. Click "Check In" button
3. Build your streak and earn coins!

### 2. Interactive Tasks
1. On the check-in page, scroll to tasks
2. Click "Start Task" on any task
3. Complete the activity to earn coins

### 3. Rewards Shop
1. Open `src/pages/shop.html`
2. Browse items by category
3. Purchase items with earned coins
4. Gift items to friends!

## 🛠️ Development

### File Locations
```bash
# Add a new page
src/pages/your-page.html

# Add page styles
src/styles/pages/your-page.css

# Add page script
src/scripts/your-page.js
```

### Common Tasks

#### Create a New Page
```bash
# 1. Create HTML file
touch src/pages/new-page.html

# 2. Create CSS file
touch src/styles/pages/new-page.css

# 3. Link them together
# In new-page.html:
<link rel="stylesheet" href="../styles/base.css" />
<link rel="stylesheet" href="../styles/pages/new-page.css" />
```

#### Add a New Style
```css
/* In src/styles/pages/your-page.css */
.your-component {
  /* Your styles */
}
```

#### Add a New Script
```javascript
// In src/scripts/your-script.js
function yourFunction() {
  // Your code
}
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 📖 Learning Path

### Beginner
1. ✅ Read [README.md](../README.md)
2. ✅ Explore `src/pages/` files
3. ✅ Try the check-in feature
4. ✅ Modify a page style

### Intermediate
1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. ✅ Understand the file structure
3. ✅ Create a new page
4. ✅ Write a simple script

### Advanced
1. ✅ Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. ✅ Implement a new feature
3. ✅ Write tests
4. ✅ Contribute to documentation

## 🐛 Troubleshooting

### Styles Not Loading
**Problem**: Page appears unstyled

**Solution**: Check CSS link paths
```html
<!-- Correct -->
<link rel="stylesheet" href="../styles/base.css" />

<!-- Incorrect -->
<link rel="stylesheet" href="styles/base.css" />
```

### Scripts Not Running
**Problem**: JavaScript features don't work

**Solution**: Check browser console (F12) for errors

### localStorage Not Working
**Problem**: Data not persisting

**Solution**: 
- Check browser privacy settings
- Ensure cookies/storage is enabled
- Try a different browser

### Tests Failing
**Problem**: `npm test` shows errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

## 💡 Tips & Tricks

### Development
- Use browser DevTools (F12) for debugging
- Install Live Server extension for auto-reload
- Use VS Code for better IntelliSense
- Keep console open to catch errors

### File Organization
- One feature per file
- Keep files under 500 lines
- Use clear, descriptive names
- Group related files together

### Performance
- Minimize CSS/JS file sizes
- Optimize images before adding
- Use browser caching
- Lazy load heavy resources

## 🔗 Useful Links

### Documentation
- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - File organization
- [CHECKIN_FEATURE.md](./CHECKIN_FEATURE.md) - Feature docs

### External Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

## 🎓 Next Steps

After getting started:

1. **Explore the codebase**
   - Read through HTML files
   - Understand CSS structure
   - Review JavaScript logic

2. **Make small changes**
   - Modify colors in CSS
   - Change text content
   - Add console.log statements

3. **Build something new**
   - Create a new page
   - Add a new feature
   - Write tests

4. **Contribute**
   - Fix bugs
   - Improve documentation
   - Share feedback

## 📞 Getting Help

### Resources
1. Check documentation in `docs/`
2. Search existing issues on GitHub
3. Ask in community forums
4. Contact the team

### Before Asking
- ✅ Read relevant documentation
- ✅ Check browser console for errors
- ✅ Try basic troubleshooting
- ✅ Search for similar issues

### When Asking
Include:
- What you're trying to do
- What you expected to happen
- What actually happened
- Error messages (if any)
- Browser and OS version

## 🎉 You're Ready!

You now have everything you need to start working with TrackWeave. Happy coding! 🚀

---

**Need more help?** Check out the [full documentation](./ARCHITECTURE.md) or [create an issue](https://github.com/yourusername/trackweave/issues).
