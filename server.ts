import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';
const rootPath = process.cwd();
const dataFilePath = path.join(rootPath, 'db.json');

app.use(express.json());

// Helper to load current state from db.json
function loadState() {
  const defaultChecklist = [
    { id: 'item-1', text: 'Node installed', completed: true },
    { id: 'item-2', text: 'Git installed', completed: true },
    { id: 'item-3', text: 'VS Code installed', completed: true },
    { id: 'item-4', text: 'Android Studio installed', completed: false },
    { id: 'item-5', text: 'Expo installed', completed: false },
    { id: 'item-6', text: 'Passenger app created', completed: false },
    { id: 'item-7', text: 'Driver app created', completed: false },
    { id: 'item-8', text: 'Backend created', completed: false },
    { id: 'item-9', text: 'Database configured', completed: false },
    { id: 'item-10', text: 'First commit pushed', completed: false }
  ];

  const defaultBugs = [
    {
      id: 'bug-1',
      title: 'WebSocket connection drop on driver client lock screen',
      description: 'Socket connection detaches when the device goes to sleep mode. Need connection retry handshake with exponetial backoff.',
      priority: 'High',
      status: 'Backlog',
      createdAt: '2026-07-06'
    },
    {
      id: 'bug-2',
      title: 'Stripe webhook 400 Bad Request signatures verification failure',
      description: 'Signature verification fails in local sandbox tests. Requires rawBody parsing middleware buffering.',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2026-07-06'
    },
    {
      id: 'bug-3',
      title: 'Passenger app map polyline rendering stutter',
      description: 'The navigation path lines stutter on minor location updates. Needs coordinate interpolation.',
      priority: 'Low',
      status: 'Testing',
      createdAt: '2026-07-05'
    },
    {
      id: 'bug-4',
      title: 'Database connection pool timeout in staging',
      description: 'Under peak simulated ride-hailing traffic, pool connections exhaust. Increased pool size to 50.',
      priority: 'High',
      status: 'Completed',
      createdAt: '2026-07-04'
    }
  ];

  const defaultJournal = [
    {
      id: 'journal-1',
      date: '2026-07-06',
      completed: 'Skeletal setup and git configurations configured for Passenger and Driver.',
      challenges: 'Expo Router template compatibility with React 19 peer dependencies warnings.',
      solutions: 'Resolved peer conflicts using npm install --legacy-peer-deps inside mobile clients.',
      nextSteps: 'Create Docker layers for backend testing, write DB migration models.'
    }
  ];

  const defaultState = {
    checklist: defaultChecklist,
    bugs: defaultBugs,
    journal: defaultJournal,
    completedTasks: ['p1w1d1t1', 'p1w1d1t2', 'p1w1d1t3'], // Mark Node.js, VS Code, and Git repos as pre-completed
    taskNotes: {}
  };

  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(content);
    } else {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultState, null, 2), 'utf-8');
      return defaultState;
    }
  } catch (error) {
    console.error('Failed to read or write database file:', error);
    return defaultState;
  }
}

// Helper to save state to db.json
function saveState(state: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to save state to database:', error);
    return false;
  }
}

// API Routes
app.get('/api/state', (req, res) => {
  const state = loadState();
  res.json({ success: true, state });
});

app.post('/api/state', (req, res) => {
  const newState = req.body;
  if (!newState) {
    res.status(400).json({ error: 'Invalid state object' });
    return;
  }
  const result = saveState(newState);
  if (result) {
    res.json({ success: true, state: newState });
  } else {
    res.status(500).json({ error: 'Failed to write data to disk' });
  }
});

// Admin login route
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === 'pickher2026') {
    res.json({ success: true, token: 'pickher-token-2026' });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Mission Control credentials.' });
  }
});

async function main() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(rootPath, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PickHer Mission Control Server] Booted successfully on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Server boot failed:', err);
});
