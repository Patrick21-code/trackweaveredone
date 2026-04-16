/* ═══════════════════════════════════════════════════════════
   TrackWeave — Daily Check-In & Tasks System
   Handles check-ins, task completion, coin earning, and persistence
   ═══════════════════════════════════════════════════════════ */

// ─── STORAGE KEYS ───────────────────────────────────────────
const STORAGE = {
  points: 'tw_points',
  streak: 'tw_streak',
  lastCheckin: 'tw_last_checkin',
  earnedToday: 'tw_earned_today',
  tasks: 'tw_tasks',
  inventory: 'tw_owned', // For shop integration
  spent: 'tw_spent',
};

// ─── TASK DEFINITIONS ───────────────────────────────────────
const TASKS = {
  'graph-generator': {
    id: 'graph-generator',
    title: 'Generate a Music Graph',
    icon: '📊',
    reward: 200,
    type: 'interactive',
  },
  'listening-quiz': {
    id: 'listening-quiz',
    title: 'Music Knowledge Quiz',
    icon: '🎵',
    reward: 150,
    type: 'quiz',
  },
  'mood-tracker': {
    id: 'mood-tracker',
    title: 'Track Your Mood',
    icon: '😊',
    reward: 100,
    type: 'simple',
  },
  'album-review': {
    id: 'album-review',
    title: 'Write an Album Review',
    icon: '✍️',
    reward: 250,
    type: 'form',
  },
  'discovery-challenge': {
    id: 'discovery-challenge',
    title: 'Discovery Challenge',
    icon: '🔍',
    reward: 175,
    type: 'collection',
  },
  'playlist-creator': {
    id: 'playlist-creator',
    title: 'Create a Themed Playlist',
    icon: '🎧',
    reward: 125,
    type: 'collection',
  },
};

// ─── STATE MANAGEMENT ───────────────────────────────────────
function loadState() {
  const today = new Date().toDateString();
  const lastCheckin = localStorage.getItem(STORAGE.lastCheckin);
  const earnedToday = lastCheckin === today 
    ? parseInt(localStorage.getItem(STORAGE.earnedToday) || '0', 10)
    : 0;

  return {
    points: parseInt(localStorage.getItem(STORAGE.points) || '1250', 10),
    streak: parseInt(localStorage.getItem(STORAGE.streak) || '0', 10),
    lastCheckin: lastCheckin,
    earnedToday: earnedToday,
    tasks: JSON.parse(localStorage.getItem(STORAGE.tasks) || '{}'),
    inventory: JSON.parse(localStorage.getItem(STORAGE.inventory) || '[]'),
    spent: parseInt(localStorage.getItem(STORAGE.spent) || '0', 10),
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE.points, state.points);
  localStorage.setItem(STORAGE.streak, state.streak);
  localStorage.setItem(STORAGE.lastCheckin, state.lastCheckin);
  localStorage.setItem(STORAGE.earnedToday, state.earnedToday);
  localStorage.setItem(STORAGE.tasks, JSON.stringify(state.tasks));
  localStorage.setItem(STORAGE.inventory, JSON.stringify(state.inventory));
  localStorage.setItem(STORAGE.spent, state.spent);
}

function addCoins(amount, reason = 'Task completed') {
  const state = loadState();
  state.points += amount;
  state.earnedToday += amount;
  saveState(state);
  updateUI();
  showToast(`+${amount} coins! ${reason}`, 'coin');
  celebrateCoins(amount);
}

// ─── UI UPDATES ─────────────────────────────────────────────
function updateUI() {
  const state = loadState();
  document.getElementById('pts-display').textContent = state.points.toLocaleString();
  document.getElementById('streak-display').textContent = state.streak;
  document.getElementById('earned-today').textContent = state.earnedToday.toLocaleString();
  
  // Update streak visualization
  updateStreakDisplay(state.streak);
  
  // Update task statuses
  updateTaskStatuses(state.tasks);
  
  // Update check-in button
  updateCheckinButton(state.lastCheckin);
}

function updateStreakDisplay(streak) {
  const streakDays = document.querySelectorAll('.streak-day');
  streakDays.forEach((day, index) => {
    const dayNum = index + 1;
    day.classList.remove('active', 'completed');
    if (dayNum < streak) {
      day.classList.add('completed');
    } else if (dayNum === streak + 1) {
      day.classList.add('active');
    }
  });
}

function updateTaskStatuses(tasks) {
  Object.keys(TASKS).forEach(taskId => {
    const statusEl = document.getElementById(`status-${taskId}`);
    const card = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskData = tasks[taskId];
    
    if (taskData && taskData.completed) {
      statusEl.textContent = 'Completed';
      statusEl.className = 'task-status completed';
      card.classList.add('completed');
      const btn = card.querySelector('.btn');
      btn.textContent = 'Completed ✓';
      btn.disabled = true;
    } else if (taskData && taskData.inProgress) {
      statusEl.textContent = 'In Progress';
      statusEl.className = 'task-status in-progress';
    }
  });
}

function updateCheckinButton(lastCheckin) {
  const today = new Date().toDateString();
  const btn = document.getElementById('checkin-btn');
  
  if (lastCheckin === today) {
    btn.textContent = 'Checked In ✓';
    btn.disabled = true;
    btn.style.background = 'var(--green)';
  }
}

// ─── DAILY CHECK-IN ─────────────────────────────────────────
function performCheckIn() {
  const state = loadState();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check if already checked in today
  if (state.lastCheckin === today) {
    showToast('You already checked in today!', 'error');
    return;
  }
  
  // Calculate streak
  let newStreak = 1;
  if (state.lastCheckin === yesterday) {
    newStreak = state.streak + 1;
  }
  
  // Calculate reward based on streak
  const streakRewards = [50, 75, 100, 125, 150, 175, 300];
  const rewardIndex = Math.min(newStreak - 1, streakRewards.length - 1);
  const reward = streakRewards[rewardIndex];
  
  // Update state
  state.streak = newStreak;
  state.lastCheckin = today;
  state.points += reward;
  state.earnedToday += reward;
  saveState(state);
  
  // Update UI
  updateUI();
  
  // Show celebration
  showToast(`Day ${newStreak} streak! +${reward} coins 🔥`, 'coin');
  celebrateCoins(reward);
  
  // Animate check-in card
  const card = document.getElementById('daily-checkin');
  card.style.animation = 'none';
  setTimeout(() => {
    card.style.animation = 'pop-in .4s cubic-bezier(.34,1.56,.64,1)';
  }, 10);
}

// ─── TASK MODAL SYSTEM ──────────────────────────────────────
function openTask(taskId) {
  const task = TASKS[taskId];
  const state = loadState();
  
  // Check if already completed
  if (state.tasks[taskId] && state.tasks[taskId].completed) {
    showToast('You already completed this task!', 'error');
    return;
  }
  
  // Mark as in progress
  if (!state.tasks[taskId]) {
    state.tasks[taskId] = { inProgress: true, completed: false };
    saveState(state);
    updateTaskStatuses(state.tasks);
  }
  
  // Load task content
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = getTaskContent(taskId, task);
  
  // Show modal
  document.getElementById('task-modal').classList.add('active');
  
  // Initialize task-specific functionality
  initializeTask(taskId);
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.remove('active');
}

function getTaskContent(taskId, task) {
  const templates = {
    'graph-generator': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>Create an interactive graph showing connections between songs</p>
      </div>
      <div class="task-content">
        <canvas id="graph-canvas" class="graph-canvas"></canvas>
        <button class="btn btn-solid btn-lg" onclick="generateGraph()" style="width:100%;">Generate Graph</button>
      </div>
    `,
    
    'listening-quiz': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>Answer 5 questions to test your music knowledge</p>
      </div>
      <div class="task-content" id="quiz-container">
        <!-- Quiz questions loaded dynamically -->
      </div>
    `,
    
    'mood-tracker': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>How are you feeling right now?</p>
      </div>
      <div class="task-content">
        <div class="mood-grid" id="mood-grid">
          <div class="mood-option" data-mood="happy">
            <div class="mood-emoji">😊</div>
            <div class="mood-label">Happy</div>
          </div>
          <div class="mood-option" data-mood="energetic">
            <div class="mood-emoji">⚡</div>
            <div class="mood-label">Energetic</div>
          </div>
          <div class="mood-option" data-mood="calm">
            <div class="mood-emoji">😌</div>
            <div class="mood-label">Calm</div>
          </div>
          <div class="mood-option" data-mood="sad">
            <div class="mood-emoji">😢</div>
            <div class="mood-label">Sad</div>
          </div>
          <div class="mood-option" data-mood="focused">
            <div class="mood-emoji">🎯</div>
            <div class="mood-label">Focused</div>
          </div>
          <div class="mood-option" data-mood="nostalgic">
            <div class="mood-emoji">🌅</div>
            <div class="mood-label">Nostalgic</div>
          </div>
        </div>
        <button class="btn btn-solid btn-lg" onclick="submitMood()" style="width:100%;margin-top:1.5rem;">Submit Mood</button>
      </div>
    `,
    
    'album-review': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>Share your thoughts on an album (minimum 100 words)</p>
      </div>
      <div class="task-content">
        <div class="review-form">
          <input type="text" id="album-name" placeholder="Album name" style="width:100%;padding:.8rem 1rem;font-family:'Instrument Sans',sans-serif;font-size:.9rem;border:1.5px solid var(--rule);border-radius:var(--radius-sm);margin-bottom:1rem;">
          <textarea id="review-text" placeholder="Write your review here..."></textarea>
          <div class="word-count"><span id="word-count">0</span> / 100 words</div>
          <button class="btn btn-solid btn-lg" onclick="submitReview()" style="width:100%;">Submit Review</button>
        </div>
      </div>
    `,
    
    'discovery-challenge': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>Discover 3 new artists you've never listened to</p>
      </div>
      <div class="task-content">
        <div class="artist-search">
          <input type="text" id="artist-input" placeholder="Enter artist name...">
          <button class="btn btn-solid" onclick="addArtist()" style="width:100%;margin-top:.8rem;">Add Artist</button>
        </div>
        <div class="discovered-artists" id="discovered-artists">
          <!-- Artists added here -->
        </div>
        <button class="btn btn-solid btn-lg" onclick="completeDiscovery()" style="width:100%;margin-top:1.5rem;" id="complete-discovery-btn" disabled>Complete Challenge</button>
      </div>
    `,
    
    'playlist-creator': `
      <div class="modal-header">
        <div class="task-icon">${task.icon}</div>
        <h2>${task.title}</h2>
        <p>Create a playlist with at least 10 songs</p>
      </div>
      <div class="task-content">
        <div class="playlist-form">
          <input type="text" id="playlist-name" placeholder="Playlist name">
          <input type="text" id="playlist-theme" placeholder="Theme or mood">
          <input type="text" id="song-input" placeholder="Add a song...">
          <button class="btn btn-solid" onclick="addSong()" style="width:100%;margin-bottom:1rem;">Add Song</button>
          <div class="playlist-songs" id="playlist-songs">
            <!-- Songs added here -->
          </div>
          <button class="btn btn-solid btn-lg" onclick="completePlaylist()" style="width:100%;" id="complete-playlist-btn" disabled>Complete Playlist</button>
        </div>
      </div>
    `,
  };
  
  return templates[taskId] || '<p>Task content not found</p>';
}

function initializeTask(taskId) {
  switch(taskId) {
    case 'listening-quiz':
      loadQuiz();
      break;
    case 'mood-tracker':
      initMoodTracker();
      break;
    case 'album-review':
      initReviewForm();
      break;
    case 'discovery-challenge':
      initDiscoveryChallenge();
      break;
    case 'playlist-creator':
      initPlaylistCreator();
      break;
  }
}

// ─── TASK: GRAPH GENERATOR ─────────────────────────────────
function generateGraph() {
  const canvas = document.getElementById('graph-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  // Generate random nodes
  const nodes = [];
  const numNodes = 12;
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: Math.random() * (canvas.height - 60) + 30,
      radius: Math.random() * 8 + 6,
      color: ['#2563eb', '#7c3aed', '#0891b2', '#f59e0b'][Math.floor(Math.random() * 4)],
    });
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw connections
  ctx.strokeStyle = '#c7d2fe';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.7) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Draw nodes
  nodes.forEach(node => {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.fillStyle = node.color + '22';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Complete task
  setTimeout(() => {
    completeTask('graph-generator');
  }, 800);
}

// ─── TASK: LISTENING QUIZ ───────────────────────────────────
const quizQuestions = [
  {
    question: "Which artist is known as the 'King of Pop'?",
    options: ["Elvis Presley", "Michael Jackson", "Prince", "David Bowie"],
    correct: 1,
  },
  {
    question: "What year was The Beatles' album 'Abbey Road' released?",
    options: ["1967", "1969", "1971", "1973"],
    correct: 1,
  },
  {
    question: "Which genre originated in Jamaica in the late 1960s?",
    options: ["Jazz", "Reggae", "Blues", "Soul"],
    correct: 1,
  },
  {
    question: "Who composed the 'Four Seasons'?",
    options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
    correct: 2,
  },
  {
    question: "Which instrument has 88 keys?",
    options: ["Organ", "Harpsichord", "Piano", "Synthesizer"],
    correct: 2,
  },
];

let currentQuestion = 0;
let quizAnswers = [];

function loadQuiz() {
  currentQuestion = 0;
  quizAnswers = [];
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById('quiz-container');
  const q = quizQuestions[currentQuestion];
  
  container.innerHTML = `
    <div class="quiz-question">
      <h4>Question ${currentQuestion + 1} of ${quizQuestions.length}</h4>
      <p style="font-size:1.05rem;margin-bottom:1.2rem;color:var(--ink);">${q.question}</p>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <div class="quiz-option" onclick="selectAnswer(${i})">${opt}</div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectAnswer(index) {
  const q = quizQuestions[currentQuestion];
  quizAnswers.push(index);
  
  // Show feedback
  const options = document.querySelectorAll('.quiz-option');
  options[index].classList.add(index === q.correct ? 'correct' : 'incorrect');
  options[q.correct].classList.add('correct');
  
  // Disable all options
  options.forEach(opt => opt.style.pointerEvents = 'none');
  
  // Move to next question or complete
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      completeQuiz();
    }
  }, 1500);
}

function completeQuiz() {
  const correct = quizAnswers.filter((ans, i) => ans === quizQuestions[i].correct).length;
  const container = document.getElementById('quiz-container');
  
  container.innerHTML = `
    <div style="text-align:center;padding:2rem 0;">
      <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
      <h3 style="font-family:'Fraunces',serif;font-size:1.5rem;margin-bottom:.5rem;">Quiz Complete!</h3>
      <p style="font-size:1.1rem;color:var(--ink-soft);margin-bottom:2rem;">You got ${correct} out of ${quizQuestions.length} correct!</p>
      <button class="btn btn-solid btn-lg" onclick="completeTask('listening-quiz')" style="width:100%;">Claim Reward</button>
    </div>
  `;
}

// ─── TASK: MOOD TRACKER ─────────────────────────────────────
let selectedMood = null;

function initMoodTracker() {
  const moodOptions = document.querySelectorAll('.mood-option');
  moodOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      moodOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedMood = opt.dataset.mood;
    });
  });
}

function submitMood() {
  if (!selectedMood) {
    showToast('Please select a mood first!', 'error');
    return;
  }
  
  // Save mood data (could be expanded to track over time)
  const moodData = {
    mood: selectedMood,
    timestamp: new Date().toISOString(),
  };
  
  completeTask('mood-tracker');
}

// ─── TASK: ALBUM REVIEW ─────────────────────────────────────
function initReviewForm() {
  const textarea = document.getElementById('review-text');
  const wordCountEl = document.getElementById('word-count');
  
  textarea.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCountEl.textContent = words.length;
  });
}

function submitReview() {
  const albumName = document.getElementById('album-name').value.trim();
  const reviewText = document.getElementById('review-text').value.trim();
  const words = reviewText.split(/\s+/).filter(w => w.length > 0);
  
  if (!albumName) {
    showToast('Please enter an album name!', 'error');
    return;
  }
  
  if (words.length < 100) {
    showToast(`Your review needs ${100 - words.length} more words!`, 'error');
    return;
  }
  
  // Save review (could be expanded to store reviews)
  const review = {
    album: albumName,
    text: reviewText,
    wordCount: words.length,
    timestamp: new Date().toISOString(),
  };
  
  completeTask('album-review');
}

// ─── TASK: DISCOVERY CHALLENGE ──────────────────────────────
let discoveredArtists = [];

function initDiscoveryChallenge() {
  discoveredArtists = [];
  updateDiscoveryButton();
}

function addArtist() {
  const input = document.getElementById('artist-input');
  const artistName = input.value.trim();
  
  if (!artistName) {
    showToast('Please enter an artist name!', 'error');
    return;
  }
  
  if (discoveredArtists.length >= 3) {
    showToast('You already added 3 artists!', 'error');
    return;
  }
  
  discoveredArtists.push(artistName);
  input.value = '';
  
  // Add to list
  const container = document.getElementById('discovered-artists');
  const artistEl = document.createElement('div');
  artistEl.className = 'discovered-artist';
  artistEl.innerHTML = `
    <div class="discovered-artist-icon">🎵</div>
    <div class="discovered-artist-name">${artistName}</div>
  `;
  container.appendChild(artistEl);
  
  updateDiscoveryButton();
}

function updateDiscoveryButton() {
  const btn = document.getElementById('complete-discovery-btn');
  btn.disabled = discoveredArtists.length < 3;
  btn.textContent = `Complete Challenge (${discoveredArtists.length}/3)`;
}

function completeDiscovery() {
  if (discoveredArtists.length < 3) {
    showToast('You need to discover 3 artists!', 'error');
    return;
  }
  
  completeTask('discovery-challenge');
}

// ─── TASK: PLAYLIST CREATOR ─────────────────────────────────
let playlistSongs = [];

function initPlaylistCreator() {
  playlistSongs = [];
  updatePlaylistButton();
}

function addSong() {
  const input = document.getElementById('song-input');
  const songName = input.value.trim();
  
  if (!songName) {
    showToast('Please enter a song name!', 'error');
    return;
  }
  
  playlistSongs.push(songName);
  input.value = '';
  
  // Add to list
  const container = document.getElementById('playlist-songs');
  const songEl = document.createElement('div');
  songEl.className = 'playlist-song';
  songEl.innerHTML = `
    <div class="playlist-song-name">${songName}</div>
    <button class="playlist-song-remove" onclick="removeSong(${playlistSongs.length - 1})">✕</button>
  `;
  container.appendChild(songEl);
  
  updatePlaylistButton();
}

function removeSong(index) {
  playlistSongs.splice(index, 1);
  const container = document.getElementById('playlist-songs');
  container.children[index].remove();
  updatePlaylistButton();
}

function updatePlaylistButton() {
  const btn = document.getElementById('complete-playlist-btn');
  btn.disabled = playlistSongs.length < 10;
  btn.textContent = `Complete Playlist (${playlistSongs.length}/10)`;
}

function completePlaylist() {
  const playlistName = document.getElementById('playlist-name').value.trim();
  const playlistTheme = document.getElementById('playlist-theme').value.trim();
  
  if (!playlistName || !playlistTheme) {
    showToast('Please fill in playlist name and theme!', 'error');
    return;
  }
  
  if (playlistSongs.length < 10) {
    showToast('You need at least 10 songs!', 'error');
    return;
  }
  
  completeTask('playlist-creator');
}

// ─── TASK COMPLETION ────────────────────────────────────────
function completeTask(taskId) {
  const state = loadState();
  const task = TASKS[taskId];
  
  // Mark as completed
  state.tasks[taskId] = { inProgress: false, completed: true };
  saveState(state);
  
  // Award coins
  addCoins(task.reward, task.title);
  
  // Update UI
  updateTaskStatuses(state.tasks);
  
  // Close modal
  setTimeout(() => {
    closeTaskModal();
  }, 1500);
}

// ─── VISUAL FEEDBACK ────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '🪙';
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toast-out .25s ease both';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

function celebrateCoins(amount) {
  // Create floating coin animations
  const colors = ['#f59e0b', '#fbbf24', '#fcd34d'];
  for (let i = 0; i < Math.min(amount / 50, 10); i++) {
    setTimeout(() => {
      const coin = document.createElement('div');
      coin.textContent = '🪙';
      coin.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        font-size: ${Math.random() * 20 + 20}px;
        pointer-events: none;
        z-index: 10001;
        animation: float-up ${Math.random() * 1 + 2}s ease-out forwards;
      `;
      document.body.appendChild(coin);
      
      setTimeout(() => coin.remove(), 3000);
    }, i * 100);
  }
}

// Add float-up animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float-up {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-${window.innerHeight}px) rotate(360deg); opacity: 0; }
  }
  @keyframes pop-in {
    0% { opacity: 0; transform: scale(.7) translateY(8px); }
    60% { transform: scale(1.06) translateY(-2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

// ─── INITIALIZATION ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI with current state
  updateUI();
  
  // Close modal on overlay click
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target.id === 'task-modal') {
      closeTaskModal();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTaskModal();
    }
  });
});
