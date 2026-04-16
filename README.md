# TrackWeave - Music Intelligence Platform

A graph-based music intelligence platform that connects songs, albums, and artists through NLP analysis, featuring a gamified reward system and social engagement features.

## 📁 Project Structure

```
trackweave/
├── src/                          # Source code
│   ├── pages/                    # HTML pages
│   │   ├── index.html           # Landing page
│   │   ├── about.html           # About page
│   │   ├── support.html         # Support page
│   │   ├── login.html           # Login page
│   │   ├── register.html        # Registration page
│   │   ├── onboarding.html      # User onboarding
│   │   ├── dashboard.html       # User dashboard
│   │   ├── artist-details.html  # Artist profile page
│   │   ├── engagement.html      # Community engagement
│   │   ├── checkin.html         # Daily check-in & tasks
│   │   └── shop.html            # Rewards shop
│   │
│   ├── styles/                   # Stylesheets
│   │   ├── base.css             # Base styles & design tokens
│   │   ├── pages/               # Page-specific styles
│   │   │   ├── index.css
│   │   │   ├── about.css
│   │   │   ├── support.css
│   │   │   ├── auth.css         # Login & register
│   │   │   ├── dashboard.css
│   │   │   ├── engagement.css
│   │   │   └── checkin.css
│   │   └── components/          # Component styles (future)
│   │
│   ├── scripts/                  # JavaScript files
│   │   ├── checkin.js           # Check-in & tasks logic
│   │   └── modules/             # Reusable modules (future)
│   │
│   └── assets/                   # Static assets
│       ├── images/              # Images & graphics
│       └── fonts/               # Custom fonts
│
├── tests/                        # Test files
│   └── unit/                    # Unit tests
│       ├── avatar.test.js
│       ├── cache.test.js
│       └── feed.test.js
│
├── docs/                         # Documentation
│   └── CHECKIN_FEATURE.md       # Check-in feature docs
│
├── public/                       # Public assets (build output)
│
├── .kiro/                        # Kiro AI configuration
│   └── specs/                   # Feature specifications
│
├── .vscode/                      # VS Code settings
├── node_modules/                 # Dependencies
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
├── package-lock.json             # Dependency lock file
├── vitest.config.js             # Test configuration
└── README.md                     # This file
```

## 🎯 Features

### Core Features
- **Graph-Based Music Analysis**: NLP-powered connections between songs, albums, and artists
- **Interactive Visualizations**: Dynamic graph displays of musical relationships
- **Social Feed**: Community engagement with posts, comments, and reactions
- **Artist Profiles**: Detailed artist pages with discography graphs

### Gamification System
- **Daily Check-In**: Build streaks and earn coins (50-300 coins/day)
- **Interactive Tasks**: 6 different task types to earn rewards
  - Graph Generator (200 coins)
  - Music Quiz (150 coins)
  - Mood Tracker (100 coins)
  - Album Review (250 coins)
  - Discovery Challenge (175 coins)
  - Playlist Creator (125 coins)
- **Rewards Shop**: Spend coins on themes, avatars, boosts, and badges
- **Gifting System**: Share owned items with community members

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Modern web browser with localStorage support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trackweave.git
cd trackweave
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Open any HTML file in `src/pages/` in your browser to view the application.

## 🏗️ Architecture

### Design Principles
- **Separation of Concerns**: Pages, styles, and scripts are organized separately
- **Modular Structure**: Easy to locate and modify specific features
- **Scalability**: Clear structure for adding new features
- **Maintainability**: Logical organization reduces cognitive load

### File Organization

#### Pages (`src/pages/`)
All HTML pages are stored here, organized by functionality:
- **Marketing**: index.html, about.html, support.html
- **Authentication**: login.html, register.html, onboarding.html
- **Application**: dashboard.html, artist-details.html, engagement.html
- **Features**: checkin.html, shop.html

#### Styles (`src/styles/`)
- **base.css**: Design tokens, resets, shared components (nav, footer, buttons)
- **pages/**: Page-specific styles matching the page structure
- **components/**: Reusable component styles (future expansion)

#### Scripts (`src/scripts/`)
- **Root level**: Feature-specific scripts (checkin.js)
- **modules/**: Shared utilities and helpers (future expansion)

#### Assets (`src/assets/`)
- **images/**: All image files
- **fonts/**: Custom font files

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📊 Data Persistence

The application uses localStorage for data persistence:

| Key | Description |
|-----|-------------|
| `tw_points` | User's coin balance |
| `tw_streak` | Current check-in streak |
| `tw_last_checkin` | Last check-in date |
| `tw_earned_today` | Coins earned today |
| `tw_tasks` | Task completion status |
| `tw_owned` | Purchased shop items |
| `tw_spent` | Total coins spent |
| `tw_gifts` | Gift history |

## 🎨 Design System

### Color Palette
- **Ink**: `#111820` (primary text)
- **Paper**: `#f8f7f4` (background)
- **Blue**: `#2563eb` (primary brand)
- **Amber**: `#f59e0b` (coins/rewards)
- **Green**: `#059669` (success)
- **Red**: `#dc2626` (error)

### Typography
- **Headings**: Fraunces (serif)
- **Body**: Instrument Sans (sans-serif)

### Border Radius
- Small: `8px`
- Medium: `14px`
- Large: `20px`

## 🔮 Future Enhancements

### Planned Features
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Collaborative playlists
- [ ] Live music events
- [ ] Artist verification system
- [ ] Premium subscription tier

### Technical Improvements
- [ ] Component library (React/Vue)
- [ ] State management (Redux/Vuex)
- [ ] Build system (Webpack/Vite)
- [ ] CSS preprocessor (SASS/LESS)
- [ ] TypeScript migration
- [ ] E2E testing (Cypress/Playwright)
- [ ] CI/CD pipeline
- [ ] Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Product Design**: Music intelligence & UX
- **Development**: Full-stack implementation
- **NLP Engineering**: Graph analysis & semantic extraction

## 📧 Contact

- Website: [trackweave.com](https://trackweave.com)
- Email: hello@trackweave.com
- Twitter: [@trackweave](https://twitter.com/trackweave)

## 🙏 Acknowledgments

- Google Fonts (Fraunces, Instrument Sans)
- Deezer API for music data
- Community contributors

---

**Built with ❤️ for music lovers everywhere**
