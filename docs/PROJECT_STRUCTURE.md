# TrackWeave Project Structure

## 📊 Visual Directory Tree

```
trackweave/
│
├── 📁 src/                          # Source code directory
│   │
│   ├── 📁 pages/                    # HTML pages (11 files)
│   │   ├── 📄 index.html           # Landing page
│   │   ├── 📄 about.html           # About page
│   │   ├── 📄 support.html         # Support/Help page
│   │   ├── 📄 login.html           # User login
│   │   ├── 📄 register.html        # User registration
│   │   ├── 📄 onboarding.html      # New user onboarding
│   │   ├── 📄 dashboard.html       # User dashboard
│   │   ├── 📄 artist-details.html  # Artist profile
│   │   ├── 📄 engagement.html      # Community feed
│   │   ├── 📄 checkin.html         # Daily check-in
│   │   └── 📄 shop.html            # Rewards shop
│   │
│   ├── 📁 styles/                   # Stylesheets
│   │   ├── 📄 base.css             # Global styles & design tokens
│   │   │
│   │   ├── 📁 pages/               # Page-specific styles
│   │   │   ├── 📄 index.css
│   │   │   ├── 📄 about.css
│   │   │   ├── 📄 support.css
│   │   │   ├── 📄 auth.css         # Login & register
│   │   │   ├── 📄 dashboard.css
│   │   │   ├── 📄 engagement.css
│   │   │   └── 📄 checkin.css
│   │   │
│   │   └── 📁 components/          # Component styles (future)
│   │       ├── 📄 card.css
│   │       ├── 📄 modal.css
│   │       └── 📄 toast.css
│   │
│   ├── 📁 scripts/                  # JavaScript files
│   │   ├── 📄 checkin.js           # Check-in system
│   │   │
│   │   └── 📁 modules/             # Reusable modules (future)
│   │       ├── 📄 storage.js       # localStorage wrapper
│   │       ├── 📄 api.js           # API client
│   │       ├── 📄 validation.js    # Form validation
│   │       └── 📄 animations.js    # Animation helpers
│   │
│   └── 📁 assets/                   # Static assets
│       ├── 📁 images/              # Images & graphics
│       │   ├── 📁 logo/
│       │   ├── 📁 icons/
│       │   ├── 📁 avatars/
│       │   └── 📁 backgrounds/
│       │
│       └── 📁 fonts/               # Custom fonts
│           ├── 📁 fraunces/
│           └── 📁 instrument-sans/
│
├── 📁 tests/                        # Test files
│   └── 📁 unit/                    # Unit tests
│       ├── 📄 avatar.test.js
│       ├── 📄 cache.test.js
│       └── 📄 feed.test.js
│
├── 📁 docs/                         # Documentation
│   ├── 📄 ARCHITECTURE.md          # Architecture guide
│   ├── 📄 MIGRATION_GUIDE.md       # Migration instructions
│   ├── 📄 PROJECT_STRUCTURE.md     # This file
│   └── 📄 CHECKIN_FEATURE.md       # Check-in feature docs
│
├── 📁 public/                       # Public assets (build output)
│
├── 📁 .kiro/                        # Kiro AI configuration
│   └── 📁 specs/                   # Feature specifications
│       └── 📁 artist-community-feeds-firestore/
│
├── 📁 .vscode/                      # VS Code settings
│   └── 📄 settings.json
│
├── 📁 node_modules/                 # Dependencies (gitignored)
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Project dependencies
├── 📄 package-lock.json             # Dependency lock file
├── 📄 vitest.config.js             # Test configuration
└── 📄 README.md                     # Project overview
```

## 📋 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| **HTML Pages** | 11 | All application pages |
| **CSS Files** | 8+ | Base + page-specific styles |
| **JS Files** | 1+ | Scripts and modules |
| **Test Files** | 3 | Unit tests |
| **Docs** | 4 | Documentation files |
| **Config Files** | 4 | Project configuration |

## 🎯 Directory Purposes

### `/src` - Source Code
The main source code directory containing all application files.

#### `/src/pages` - HTML Pages
All HTML pages organized by functionality:
- **Marketing**: index, about, support
- **Auth**: login, register, onboarding
- **App**: dashboard, artist-details, engagement
- **Features**: checkin, shop

#### `/src/styles` - Stylesheets
CSS files organized by scope:
- **base.css**: Global styles, design tokens, shared components
- **pages/**: Page-specific styles matching page structure
- **components/**: Reusable component styles (future)

#### `/src/scripts` - JavaScript
JavaScript files organized by purpose:
- **Root level**: Feature-specific scripts
- **modules/**: Reusable utilities and helpers (future)

#### `/src/assets` - Static Assets
Static resources organized by type:
- **images/**: All image files
- **fonts/**: Custom font files

### `/tests` - Test Files
Test files organized by type:
- **unit/**: Unit tests for individual functions/modules
- **integration/**: Integration tests (future)
- **e2e/**: End-to-end tests (future)

### `/docs` - Documentation
Project documentation:
- **ARCHITECTURE.md**: System architecture and design
- **MIGRATION_GUIDE.md**: Migration instructions
- **PROJECT_STRUCTURE.md**: This file
- **CHECKIN_FEATURE.md**: Feature-specific documentation

### `/public` - Build Output
Public assets and build output (future):
- Compiled/bundled files
- Optimized assets
- Production-ready files

## 🔗 File Relationships

### Page → Style → Script
```
index.html
  ├── base.css (global)
  ├── pages/index.css (page-specific)
  └── (no script yet)

checkin.html
  ├── base.css (global)
  ├── pages/checkin.css (page-specific)
  └── checkin.js (functionality)

shop.html
  ├── base.css (global)
  ├── (inline styles)
  └── (inline script)
```

### Style Hierarchy
```
base.css (loaded first)
  ├── Design tokens
  ├── Reset styles
  ├── Typography
  ├── Shared components
  └── Utilities

pages/*.css (loaded second)
  ├── Page-specific components
  ├── Page-specific layouts
  └── Page-specific overrides
```

### Script Dependencies
```
checkin.js
  ├── localStorage API
  ├── DOM manipulation
  └── Event handling

modules/storage.js (future)
  └── localStorage wrapper

modules/api.js (future)
  └── Fetch API wrapper
```

## 📏 Size Guidelines

### File Size Recommendations
- **HTML**: < 500 lines
- **CSS**: < 1000 lines per file
- **JS**: < 500 lines per file
- **Images**: < 500KB each

### When to Split Files
Split a file when:
- ✅ It exceeds size guidelines
- ✅ It has multiple responsibilities
- ✅ Parts are reusable elsewhere
- ✅ It's hard to navigate

## 🎨 Naming Patterns

### Files
```
HTML:  kebab-case.html     (artist-details.html)
CSS:   kebab-case.css      (checkin.css)
JS:    camelCase.js        (checkin.js)
Test:  name.test.js        (avatar.test.js)
Docs:  UPPER_CASE.md       (README.md)
```

### Directories
```
All lowercase, no spaces
Use hyphens for multi-word names
Keep names short and descriptive
```

## 🔄 Common Workflows

### Adding a New Page
1. Create HTML in `src/pages/`
2. Create CSS in `src/styles/pages/`
3. Create JS in `src/scripts/` (if needed)
4. Link CSS in HTML
5. Link JS in HTML
6. Update navigation menus

### Adding a New Component
1. Create CSS in `src/styles/components/`
2. Create JS in `src/scripts/modules/` (if needed)
3. Import in relevant pages
4. Document usage

### Adding a New Feature
1. Create feature branch
2. Add necessary files
3. Write tests
4. Update documentation
5. Submit pull request

## 📊 Growth Projections

### Current State (v1.0)
```
src/
├── pages/      11 files
├── styles/     8 files
├── scripts/    1 file
└── assets/     0 files
```

### Near Future (v1.5)
```
src/
├── pages/      15 files
├── styles/     15 files
├── scripts/    5 files
└── assets/     20 files
```

### Long Term (v2.0)
```
src/
├── pages/      20 files
├── styles/     30 files
├── scripts/    20 files
└── assets/     50 files
```

## 🚀 Scalability Features

### Current Structure Supports
- ✅ Adding new pages
- ✅ Adding new styles
- ✅ Adding new scripts
- ✅ Adding new tests
- ✅ Adding new documentation

### Future Enhancements
- 🔄 Component library
- 🔄 Build system
- 🔄 Module bundling
- 🔄 Asset optimization
- 🔄 Code splitting

## 📚 Related Documentation

- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration instructions
- [CHECKIN_FEATURE.md](./CHECKIN_FEATURE.md) - Feature documentation

## 🔍 Quick Reference

### Find a File
```bash
# Find HTML page
ls src/pages/

# Find CSS file
ls src/styles/pages/

# Find JS file
ls src/scripts/

# Find test
ls tests/unit/
```

### Common Paths
```
Landing page:     src/pages/index.html
Base styles:      src/styles/base.css
Check-in script:  src/scripts/checkin.js
Tests:            tests/unit/
Documentation:    docs/
```

---

**Last Updated**: April 16, 2026  
**Structure Version**: 1.0  
**Total Files**: ~30+
