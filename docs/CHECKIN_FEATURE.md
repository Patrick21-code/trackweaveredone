# Daily Check-In & Interactive Tasks Feature

## Overview
The Daily Check-In system is a gamification feature that rewards users with coins for completing daily activities and interactive tasks. Users can spend these coins in the shop to purchase exclusive rewards and even gift items to other community members.

## Features

### 1. Daily Check-In System
- **Streak Tracking**: Users build consecutive day streaks by checking in daily
- **Progressive Rewards**: Coin rewards increase with streak length
  - Day 1: +50 coins
  - Day 2: +75 coins
  - Day 3: +100 coins
  - Day 4: +125 coins
  - Day 5: +150 coins
  - Day 6: +175 coins
  - Day 7: +300 coins (bonus!)
- **Streak Reset**: Missing a day resets the streak back to Day 1
- **Visual Feedback**: Animated streak display shows progress and upcoming rewards

### 2. Interactive Tasks
Users can complete various tasks to earn additional coins:

#### Graph Generator (200 coins)
- Create an interactive music graph visualization
- Shows connections between songs using nodes and edges
- Randomly generated with different colors representing albums

#### Music Knowledge Quiz (150 coins)
- 5 multiple-choice questions about music history and theory
- Instant feedback on correct/incorrect answers
- Score tracking and completion celebration

#### Mood Tracker (100 coins)
- Log current mood from 6 options (Happy, Energetic, Calm, Sad, Focused, Nostalgic)
- Visual mood selection interface
- Data saved for future mood-music correlation analysis

#### Album Review (250 coins)
- Write a detailed album review (minimum 100 words)
- Real-time word counter
- Album name and review text saved

#### Discovery Challenge (175 coins)
- Discover and add 3 new artists
- Progress tracking (X/3 artists added)
- Encourages music exploration

#### Playlist Creator (125 coins)
- Create a themed playlist with at least 10 songs
- Add playlist name and theme/mood
- Dynamic song list with remove functionality

### 3. Coin Economy
- **Earning**: Complete check-ins and tasks to earn coins
- **Spending**: Use coins in the shop to purchase rewards
- **Tracking**: Dashboard shows total balance, daily earnings, and streak
- **Persistence**: All data saved to localStorage for permanent storage

### 4. Shop Integration
- **Shared Currency**: Coins earned from check-ins work seamlessly with shop
- **Purchase System**: Buy themes, avatars, boosts, and badges
- **Ownership Tracking**: Purchased items permanently saved to user account
- **Gifting Feature**: Users can gift owned items to commenters
  - Gift button appears on owned items
  - Enter recipient username to send gift
  - Gift history tracked in localStorage

### 5. Visual Feedback
- **Toast Notifications**: Success/error messages for all actions
- **Coin Animations**: Floating coins celebrate earning rewards
- **Confetti Effects**: Burst of colors when completing tasks or making purchases
- **Progress Indicators**: Real-time updates on task completion status

## File Structure

```
frontend/
  ├── checkin.html          # Main check-in page
  └── shop.html             # Shop page (updated with gifting)

styles/
  └── checkin-page.css      # Check-in page styles

scripts/
  └── checkin.js            # Check-in logic and task handlers
```

## Data Persistence

All user data is stored in localStorage with the following keys:

- `tw_points`: Total coin balance
- `tw_streak`: Current check-in streak
- `tw_last_checkin`: Last check-in date
- `tw_earned_today`: Coins earned today
- `tw_tasks`: Task completion status
- `tw_owned`: Purchased shop items
- `tw_spent`: Total coins spent
- `tw_gifts`: Gift history

## Usage

### Accessing the Feature
Navigate to `/frontend/checkin.html` or click "Daily Check-In" in the navigation menu.

### Daily Check-In
1. Visit the page
2. Click "Check In" button
3. Receive coins based on current streak
4. Streak automatically increments

### Completing Tasks
1. Browse available tasks in the grid
2. Click "Start Task" on any task card
3. Complete the interactive activity in the modal
4. Receive coins upon completion
5. Task marked as "Completed"

### Shopping
1. Navigate to the shop page
2. Browse items by category
3. Purchase items with earned coins
4. Owned items show "Owned" status

### Gifting Items
1. Go to shop page
2. Find an item you own
3. Click "🎁 Gift to Commenter" button
4. Enter recipient username
5. Gift is recorded and recipient notified (in full implementation)

## Technical Details

### State Management
- Centralized state loading/saving functions
- Automatic synchronization between check-in and shop pages
- Real-time UI updates on state changes

### Task System
- Modular task definitions
- Dynamic modal content generation
- Task-specific initialization and completion handlers
- Extensible architecture for adding new tasks

### Animation System
- CSS keyframe animations for smooth transitions
- JavaScript-triggered celebrations
- Performance-optimized particle effects

## Future Enhancements

1. **Backend Integration**
   - Server-side validation of check-ins and tasks
   - Prevent cheating/manipulation
   - Real-time leaderboards

2. **Social Features**
   - See friends' streaks
   - Gift items directly from user profiles
   - Comment on completed tasks

3. **Advanced Tasks**
   - Collaborative challenges
   - Time-limited events
   - Seasonal special tasks

4. **Analytics**
   - Mood-music correlation insights
   - Listening pattern analysis
   - Personalized task recommendations

5. **Rewards Expansion**
   - More shop items
   - Limited edition items
   - Exclusive event rewards

## Browser Compatibility
- Modern browsers with localStorage support
- Canvas API for graph generation
- ES6+ JavaScript features

## Notes
- All data is stored locally (no backend required for demo)
- Streak resets if user misses a day
- Tasks can only be completed once per session
- Gifting feature requires username input (would integrate with user system in production)
