# TrackWeave Architecture Documentation

## Overview
This document describes the architecture, file organization, and design decisions for the TrackWeave platform.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Design Principles](#design-principles)
3. [File Organization](#file-organization)
4. [Naming Conventions](#naming-conventions)
5. [Style Architecture](#style-architecture)
6. [Script Architecture](#script-architecture)
7. [Data Flow](#data-flow)
8. [Future Scalability](#future-scalability)

---

## Project Structure

### Directory Layout
```
src/
├── pages/          # All HTML pages
├── styles/         # All CSS files
│   ├── base.css   # Global styles
│   └── pages/     # Page-specific styles
├── scripts/        # All JavaScript files
│   └── modules/   # Reusable modules
└── assets/         # Static assets
    ├── images/    # Images
    └── fonts/     # Fonts
```

### Why This Structure?

#### ✅ Benefits
1. **Clear Separation**: Each file type has its own directory
2. **Easy Navigation**: Developers can quickly find what they need
3. **Scalability**: Easy to add new pages, styles, or scripts
4. **Maintainability**: Changes are isolated to specific areas
5. **Team Collaboration**: Multiple developers can work without conflicts

#### 🎯 Design Goals
- **Discoverability**: File locations are predictable
- **Modularity**: Components can be reused
- **Consistency**: Similar files are grouped together
- **Flexibility**: Structure supports future growth

---

## Design Principles

### 1. Separation of Concerns
- **Pages**: HTML structure only
- **Styles**: Visual presentation
- **Scripts**: Behavior and logic
- **Assets**: Static resources

### 2. Single Responsibility
Each file has one clear purpose:
- `index.html` → Landing page structure
- `index.css` → Landing page styles
- `checkin.js` → Check-in functionality

### 3. DRY (Don't Repeat Yourself)
- Shared styles in `base.css`
- Reusable scripts in `modules/`
- Common assets in `assets/`

### 4. Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features added with JS
- Graceful degradation for older browsers

---

## File Organization

### Pages (`src/pages/`)

#### Marketing Pages
```
index.html       # Landing page with hero, features, CTA
about.html       # Company information, mission, team
support.html     # Help center, FAQs, contact
```

#### Authentication Pages
```
login.html       # User login form
register.html    # New user registration
onboarding.html  # First-time user setup
```

#### Application Pages
```
dashboard.html       # User home with personalized content
artist-details.html  # Artist profile with graph visualization
engagement.html      # Community feed with posts & comments
```

#### Feature Pages
```
checkin.html     # Daily check-in & interactive tasks
shop.html        # Rewards shop with purchasable items
```

### Styles (`src/styles/`)

#### Base Styles (`base.css`)
Contains:
- CSS custom properties (design tokens)
- Reset styles
- Typography
- Shared components (nav, footer, buttons)
- Utility classes
- Responsive breakpoints

#### Page Styles (`pages/`)
Each page has its own CSS file:
```
pages/
├── index.css        # Landing page specific
├── about.css        # About page specific
├── auth.css         # Login & register shared
├── dashboard.css    # Dashboard specific
├── engagement.css   # Engagement page specific
└── checkin.css      # Check-in page specific
```

**Naming Convention**: `{page-name}.css`

#### Component Styles (`components/`)
Future location for reusable components:
```
components/
├── card.css
├── modal.css
├── toast.css
└── graph.css
```

### Scripts (`src/scripts/`)

#### Feature Scripts (Root Level)
```
checkin.js       # Check-in system & tasks
shop.js          # Shop functionality (future)
graph.js         # Graph visualization (future)
```

#### Modules (`modules/`)
Reusable utilities (future):
```
modules/
├── storage.js       # localStorage wrapper
├── api.js          # API client
├── validation.js   # Form validation
└── animations.js   # Animation helpers
```

### Assets (`src/assets/`)

#### Images (`images/`)
```
images/
├── logo/           # Brand logos
├── icons/          # UI icons
├── avatars/        # User avatars
└── backgrounds/    # Background images
```

#### Fonts (`fonts/`)
```
fonts/
├── fraunces/       # Serif font family
└── instrument-sans/ # Sans-serif font family
```

---

## Naming Conventions

### Files
- **HTML**: `kebab-case.html` (e.g., `artist-details.html`)
- **CSS**: `kebab-case.css` (e.g., `checkin-page.css` → `checkin.css`)
- **JS**: `camelCase.js` (e.g., `checkin.js`)
- **Images**: `kebab-case.ext` (e.g., `hero-background.jpg`)

### CSS Classes
- **BEM Methodology**: `block__element--modifier`
- **Utility Classes**: `u-{property}` (e.g., `u-text-center`)
- **State Classes**: `is-{state}` (e.g., `is-active`)

### JavaScript
- **Variables**: `camelCase` (e.g., `userName`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `STORAGE_KEYS`)
- **Functions**: `camelCase` (e.g., `loadUserData()`)
- **Classes**: `PascalCase` (e.g., `TaskManager`)

### CSS Custom Properties
```css
--{category}-{property}-{variant}

Examples:
--color-primary-500
--spacing-md
--radius-lg
--font-heading
```

---

## Style Architecture

### CSS Organization

#### 1. Base Styles (`base.css`)
```css
/* Design Tokens */
:root { ... }

/* Reset */
*, *::before, *::after { ... }

/* Typography */
body { ... }
h1, h2, h3 { ... }

/* Layout */
.container { ... }

/* Components */
.nav { ... }
.footer { ... }
.btn { ... }

/* Utilities */
.u-text-center { ... }
```

#### 2. Page Styles
```css
/* Page-specific components */
.hero { ... }
.features { ... }

/* Page-specific overrides */
.nav--transparent { ... }
```

### CSS Methodology

#### BEM (Block Element Modifier)
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--compact { }
```

#### Utility-First (Selective)
```css
.u-text-center { text-align: center; }
.u-mb-2 { margin-bottom: 1rem; }
.u-hidden { display: none; }
```

### Responsive Design
```css
/* Mobile First */
.element { /* mobile styles */ }

@media (min-width: 768px) {
  .element { /* tablet styles */ }
}

@media (min-width: 1024px) {
  .element { /* desktop styles */ }
}
```

---

## Script Architecture

### Module Pattern
```javascript
// checkin.js structure

// 1. Constants
const STORAGE_KEYS = { ... };
const TASKS = { ... };

// 2. State Management
function loadState() { ... }
function saveState() { ... }

// 3. UI Updates
function updateUI() { ... }
function renderTasks() { ... }

// 4. Event Handlers
function handleCheckIn() { ... }
function handleTaskComplete() { ... }

// 5. Initialization
document.addEventListener('DOMContentLoaded', init);
```

### Data Flow
```
User Action → Event Handler → State Update → Save to Storage → UI Update
```

### Error Handling
```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  showToast('Something went wrong', 'error');
}
```

---

## Data Flow

### localStorage Architecture
```javascript
// Storage Keys
tw_points          // User coin balance
tw_streak          // Check-in streak
tw_last_checkin    // Last check-in date
tw_earned_today    // Daily earnings
tw_tasks           // Task completion status
tw_owned           // Purchased items
tw_spent           // Total spent
tw_gifts           // Gift history
```

### State Management Pattern
```javascript
// 1. Load state
const state = loadState();

// 2. Modify state
state.points += 100;

// 3. Save state
saveState(state);

// 4. Update UI
updateUI(state);
```

### Cross-Page Communication
```javascript
// Page A: Save data
localStorage.setItem('tw_points', '1500');

// Page B: Read data
const points = localStorage.getItem('tw_points');
```

---

## Future Scalability

### Component Library
```
src/components/
├── Button/
│   ├── Button.js
│   ├── Button.css
│   └── Button.test.js
├── Card/
│   ├── Card.js
│   ├── Card.css
│   └── Card.test.js
└── Modal/
    ├── Modal.js
    ├── Modal.css
    └── Modal.test.js
```

### State Management
```javascript
// Future: Redux/Vuex store
store/
├── index.js
├── actions.js
├── reducers.js
└── selectors.js
```

### API Layer
```javascript
// Future: API client
api/
├── client.js
├── endpoints/
│   ├── users.js
│   ├── tasks.js
│   └── shop.js
└── interceptors.js
```

### Build System
```javascript
// Future: Webpack/Vite config
build/
├── webpack.config.js
├── webpack.dev.js
└── webpack.prod.js
```

### Testing Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

---

## Migration Guide

### From Old Structure to New

#### Pages
```
frontend/index.html → src/pages/index.html
```

#### Styles
```
styles/index-page.css → src/styles/pages/index.css
styles/trackweave-base.css → src/styles/base.css
```

#### Scripts
```
scripts/checkin.js → src/scripts/checkin.js
```

#### Tests
```
tests/avatar.test.js → tests/unit/avatar.test.js
```

### Path Updates
Update all file references:
```html
<!-- Old -->
<link rel="stylesheet" href="../styles/trackweave-base.css" />
<link rel="stylesheet" href="../styles/index-page.css" />

<!-- New -->
<link rel="stylesheet" href="../styles/base.css" />
<link rel="stylesheet" href="../styles/pages/index.css" />
```

---

## Best Practices

### 1. File Organization
- ✅ Group related files together
- ✅ Use clear, descriptive names
- ✅ Keep directory depth reasonable (max 3-4 levels)
- ❌ Don't mix different file types in same directory

### 2. Code Organization
- ✅ One component per file
- ✅ Clear separation of concerns
- ✅ Consistent naming conventions
- ❌ Don't create god files (>500 lines)

### 3. Documentation
- ✅ Comment complex logic
- ✅ Use JSDoc for functions
- ✅ Keep README up to date
- ❌ Don't over-comment obvious code

### 4. Version Control
- ✅ Commit related changes together
- ✅ Write clear commit messages
- ✅ Use feature branches
- ❌ Don't commit generated files

---

## Conclusion

This architecture provides:
- **Clarity**: Easy to understand and navigate
- **Scalability**: Room for growth and new features
- **Maintainability**: Simple to update and refactor
- **Collaboration**: Multiple developers can work efficiently

The structure is designed to evolve with the project while maintaining organization and clarity.
