import { Phase } from '../types';

export const roadmapPhases: Phase[] = [
  {
    id: 'phase-1',
    phaseNum: 1,
    title: 'Phase 1 — MVP Launch',
    subtitle: 'MVP Development',
    dateRange: 'July 7 - July 31, 2026',
    status: 'Active',
    progress: 35,
    goal: 'Build a functional ride-hailing MVP where passengers can request rides and drivers can complete trips.',
    milestones: [
      'Passenger requests ride',
      'Driver accepts',
      'Live tracking',
      'Trip completion',
      'Rating'
    ],
    objectives: [
      'Passenger app setup & screens',
      'Driver app setup & screens',
      'Backend authentication & services',
      'PostgreSQL & PostGIS database mapping',
      'Real-time socket.io tracking server',
      'Automated matching algorithm prototype'
    ],
    weeks: [
      {
        id: 'week-1',
        weekNum: 1,
        title: 'Foundation & Environment Setup',
        goal: 'Create the technical foundation.',
        milestones: [
          { text: 'Repository created', completed: true },
          { text: 'React Native initialized', completed: true },
          { text: 'Backend running', completed: true },
          { text: 'Database connected', completed: false },
          { text: 'Authentication started', completed: false }
        ],
        days: [
          {
            id: 'day-1',
            dayNum: 1,
            title: 'Environment Setup',
            objective: 'Prepare all development environments.',
            estimatedTime: '8 hours',
            difficulty: 'Beginner',
            expectedOutcome: 'A complete development environment ready for coding.',
            whyMatters: 'Setting up your environment correctly ensures smooth development, avoids dependency mismatch nightmares, and establishes standard linting/formatting early.',
            tasks: [
              {
                id: 'p1w1d1t1',
                title: 'Install Node.js',
                description: 'Install Node.js (LTS version) because it powers the backend server and package management.',
                commands: ['node -v', 'npm -v'],
                expectedResult: 'Node version (v20+) and npm version (v10+) appear successfully.',
                completed: true,
                duration: '45 mins'
              },
              {
                id: 'p1w1d1t2',
                title: 'Install VS Code',
                description: 'Install Visual Studio Code along with React Native Tools and ESLint extensions.',
                completed: true,
                duration: '30 mins'
              },
              {
                id: 'p1w1d1t3',
                title: 'Setup GitHub repositories',
                description: 'Create separate git repositories for passenger-app, driver-app, and backend-server under a unified organization.',
                commands: ['git init', 'git remote add origin https://github.com/pickher/backend.git'],
                expectedResult: 'Repository connected to GitHub remote.',
                completed: true,
                duration: '1 hour'
              },
              {
                id: 'p1w1d1t4',
                title: 'Initialize React Native projects',
                description: 'Initialize both passenger and driver apps using Expo with pre-configured TypeScript templates.',
                commands: ['npx create-expo-app passenger-app --template expo-template-blank-typescript'],
                expectedResult: 'A running skeleton of Expo app.',
                completed: false,
                duration: '2 hours'
              },
              {
                id: 'p1w1d1t5',
                title: 'Setup backend folder',
                description: 'Setup Node.js, Express, and TypeScript configurations for the central API server.',
                commands: ['npm init -y', 'npm install express typescript @types/node @types/express tsx --save-dev'],
                expectedResult: 'Backend folder contains a valid package.json and tsconfig.json.',
                completed: false,
                duration: '1.5 hours'
              },
              {
                id: 'p1w1d1t6',
                title: 'First Git commit',
                description: 'Commit all skeletal structures and push them to the main branch.',
                commands: ['git add .', 'git commit -m "chore: initial skeleton configuration"', 'git push origin main'],
                expectedResult: 'First commit appears in remote GitHub repo.',
                completed: false,
                duration: '30 mins'
              }
            ]
          },
          {
            id: 'day-2',
            dayNum: 2,
            title: 'React Native & Expo Layouts',
            objective: 'Configure navigation routing, layout components, and context provider skeletons.',
            estimatedTime: '6 hours',
            difficulty: 'Intermediate',
            expectedOutcome: 'Interactive routing with functional bottom tabs and custom header components.',
            whyMatters: 'A rigid navigation tree prevents navigation memory leaks and sets up a predictable user-journey hierarchy.',
            tasks: [
              {
                id: 'p1w1d2t1',
                title: 'Configure Expo Router',
                description: 'Implement expo-router with tabs configuration in app/directory.',
                completed: false,
                duration: '2 hours'
              },
              {
                id: 'p1w1d2t2',
                title: 'Set up global state context',
                description: 'Set up React Context for managing authentication token, user location state, and active rides.',
                completed: false,
                duration: '1.5 hours'
              },
              {
                id: 'p1w1d2t3',
                title: 'Build Passenger screen skeletons',
                description: 'Create files for Home, MapView, RequestRide, TripHistory, and Profile screens.',
                completed: false,
                duration: '1.5 hours'
              },
              {
                id: 'p1w1d2t4',
                title: 'Build Driver screen skeletons',
                description: 'Create files for OnlineDashboard, RideOffers, ActiveTrip, Earnings, and Settings.',
                completed: false,
                duration: '1 hour'
              }
            ]
          },
          {
            id: 'day-3',
            dayNum: 3,
            title: 'Backend & Database Setup',
            objective: 'Configure Express, PostgreSQL, and initial migrations for passenger and driver schemas.',
            estimatedTime: '7 hours',
            difficulty: 'Advanced',
            expectedOutcome: 'Express API connected to local database and successfully executing custom SQL migrations.',
            whyMatters: 'Establishing clean relational mapping avoids database normalization headaches and speeds up location query lookups.',
            tasks: [
              {
                id: 'p1w1d3t1',
                title: 'Setup PostgreSQL & PostGIS',
                description: 'Install PostgreSQL with the PostGIS extension for handling geolocation coordinates efficiently.',
                commands: ['CREATE EXTENSION IF NOT EXISTS postgis;'],
                expectedResult: 'PostGIS extensions successfully enabled in DB.',
                completed: false,
                duration: '2 hours'
              },
              {
                id: 'p1w1d3t2',
                title: 'Create DB Migration schemas',
                description: 'Create table schemas for Users, Drivers, Vehicles, and Trips.',
                completed: false,
                duration: '2.5 hours'
              },
              {
                id: 'p1w1d3t3',
                title: 'Build JWT Authentication endpoints',
                description: 'Write token-based register and login router endpoints using bcrypt and jsonwebtoken.',
                completed: false,
                duration: '2.5 hours'
              }
            ]
          },
          {
            id: 'day-4',
            dayNum: 4,
            title: 'Real-time WebSocket Core',
            objective: 'Establish WebSocket channels using Socket.io for live communication.',
            estimatedTime: '8 hours',
            difficulty: 'Advanced',
            expectedOutcome: 'Bi-directional socket messaging between test client clients and the backend.',
            whyMatters: 'Instant driver matching and live tracking require millisecond-accurate sockets rather than expensive HTTP polling.',
            tasks: [
              {
                id: 'p1w1d4t1',
                title: 'Install socket.io on backend',
                description: 'Configure socket.io inside Express server setup.',
                completed: false,
                duration: '3 hours'
              },
              {
                id: 'p1w1d4t2',
                title: 'Integrate socket.io-client in mobile templates',
                description: 'Add and configure socket client hooks inside passenger and driver apps.',
                completed: false,
                duration: '3 hours'
              },
              {
                id: 'p1w1d4t3',
                title: 'Location Broadcast service',
                description: 'Write server routines to capture geolocation pings and broadcast them to corresponding booking channels.',
                completed: false,
                duration: '2 hours'
              }
            ]
          },
          {
            id: 'day-5',
            dayNum: 5,
            title: 'Mock Map Tracking',
            objective: 'Simulate real-time driver movement on the map canvas.',
            estimatedTime: '6 hours',
            difficulty: 'Intermediate',
            expectedOutcome: 'A moving map pin tracking a predefined path using mock coordinate state.',
            whyMatters: 'A smooth tracking animation reduces passenger anxiety and gives real-time visual feedback.',
            tasks: [
              {
                id: 'p1w1d5t1',
                title: 'Integrate Mapbox / Google Maps SDK',
                description: 'Install and mount map components on Home screens.',
                completed: false,
                duration: '2 hours'
              },
              {
                id: 'p1w1d5t2',
                title: 'GPS Location Poll simulation',
                description: 'Write a background timer simulating driver position updates.',
                completed: false,
                duration: '2 hours'
              },
              {
                id: 'p1w1d5t3',
                title: 'Render driver route polylines',
                description: 'Draw polylines connecting passenger and driver locations based on directions.',
                completed: false,
                duration: '2 hours'
              }
            ]
          }
        ]
      },
      {
        id: 'week-2',
        weekNum: 2,
        title: 'Core Feature Implementation',
        goal: 'Build passenger booking & driver matching.',
        milestones: [
          { text: 'Location querying working', completed: false },
          { text: 'Passenger can request trip', completed: false },
          { text: 'Matching algorithm running', completed: false },
          { text: 'Driver accept screen active', completed: false },
          { text: 'Real-time track socket active', completed: false }
        ],
        days: [
          {
            id: 'day-6',
            dayNum: 6,
            title: 'Ride Request Flow',
            objective: 'Create Passenger checkout screen to select pickup, destination and request a ride.',
            estimatedTime: '7 hours',
            difficulty: 'Intermediate',
            expectedOutcome: 'Request stored in Database with PENDING status.',
            whyMatters: 'Clean checkout experiences increase client retention and decrease cart abandonment.',
            tasks: [
              { id: 'p1w2d6t1', title: 'Pickup & Dropoff Search UI', description: 'Integrate Places Autocomplete search input boxes.', completed: false, duration: '2.5 hours' },
              { id: 'p1w2d6t2', title: 'Fare Calculation Engine', description: 'Calculate fare estimates dynamically based on distance & base rates.', completed: false, duration: '2 hours' },
              { id: 'p1w2d6t3', title: 'Ride Request API', description: 'Create POST /api/trips endpoint to commit new rides in database.', completed: false, duration: '2.5 hours' }
            ]
          },
          {
            id: 'day-7',
            dayNum: 7,
            title: 'Matching Engine Design',
            objective: 'Build service algorithm selecting closest available drivers.',
            estimatedTime: '8 hours',
            difficulty: 'Advanced',
            expectedOutcome: 'Query matching driver in 2km radius using geospatial indexing.',
            whyMatters: 'Quick matches keep both passenger and drivers happy, preventing cancellations.',
            tasks: [
              { id: 'p1w2d7t1', title: 'Geospatial queries with PostGIS', description: 'Write SQL queries to filter drivers using ST_DWithin function.', completed: false, duration: '3 hours' },
              { id: 'p1w2d7t2', title: 'Driver queue manager', description: 'Implement queuing mechanisms for driver notifications.', completed: false, duration: '2 hours' },
              { id: 'p1w2d7t3', title: 'Broadcast ride request', description: 'Trigger websocket broadcast to eligible driver terminals.', completed: false, duration: '3 hours' }
            ]
          }
        ]
      },
      {
        id: 'week-3',
        weekNum: 3,
        title: 'Payment, Security & Ratings',
        goal: 'Handle payments, emergency safety features, and rating feedback loops.',
        milestones: [
          { text: 'Stripe API connected', completed: false },
          { text: 'SOS trigger emergency contact', completed: false },
          { text: 'Wallet balance state active', completed: false },
          { text: 'Passenger/Driver rating feedback loop', completed: false }
        ],
        days: [
          {
            id: 'day-11',
            dayNum: 11,
            title: 'Stripe Gateway Setup',
            objective: 'Process digital credit card payments and coordinate driver payouts.',
            estimatedTime: '8 hours',
            difficulty: 'Advanced',
            expectedOutcome: 'Successful mock charging flow and balance updating.',
            whyMatters: 'Reliable, instant, and secure payment processing is critical to client trust and driver cash flow.',
            tasks: [
              { id: 'p1w3d11t1', title: 'Initialize Stripe Node SDK', description: 'Configure backend server to create Stripe payment intents.', completed: false, duration: '3 hours' },
              { id: 'p1w3d11t2', title: 'Add Mobile Card Input UI', description: 'Integrate Stripe Card Element in Mobile Client payment settings.', completed: false, duration: '3 hours' },
              { id: 'p1w3d11t3', title: 'Webhooks verification', description: 'Set up endpoints to handle success payment events.', completed: false, duration: '2 hours' }
            ]
          }
        ]
      },
      {
        id: 'week-4',
        weekNum: 4,
        title: 'Scaling, Hardening & MVP Launch',
        goal: 'Deploy, load test, and launch Phase 1 MVP on July 31.',
        milestones: [
          { text: 'AWS/Cloud Run deployment', completed: false },
          { text: 'App Store Sandbox Build compiled', completed: false },
          { text: '1000 simultaneous websocket requests test passed', completed: false }
        ],
        days: [
          {
            id: 'day-16',
            dayNum: 16,
            title: 'Setup CI/CD Pipelines',
            objective: 'Configure automated Github Actions to test, build, and deploy server containers.',
            estimatedTime: '6 hours',
            difficulty: 'Intermediate',
            expectedOutcome: 'Continuous integration running green and auto-deploying to staging server.',
            whyMatters: 'Manual deployment causes human errors and reduces continuous deployment speed.',
            tasks: [
              { id: 'p1w4d16t1', title: 'Setup GitHub Actions yaml workflow', description: 'Write a pipeline script triggers on push to main.', completed: false, duration: '3 hours' },
              { id: 'p1w4d16t2', title: 'Dockerize central backend service', description: 'Write optimal Dockerfile for Node/Express build layers.', completed: false, duration: '3 hours' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    phaseNum: 2,
    title: 'Phase 2 — Safety & Experience',
    subtitle: 'Safety & Experience',
    dateRange: 'August 2026',
    status: 'Upcoming',
    progress: 0,
    goal: 'Introduce biometric validation, ride audio streaming, panic triggers, SOS notification dispatchers, and detailed passenger sharing features.',
    objectives: [
      'Selfie verification routines for driver onboarding',
      'Real-time trip sharing links (Web viewer)',
      'Audio recording storage integration during active emergencies',
      'Geofencing alert routing'
    ]
  },
  {
    id: 'phase-3',
    phaseNum: 3,
    title: 'Phase 3 — Growth & Monetization',
    subtitle: 'Growth & Monetization',
    dateRange: 'September - October 2026',
    status: 'Locked',
    progress: 0,
    goal: 'Develop dynamic pricing multipliers, corporate business portals, subscription packages, and direct promotion referral engines.',
    objectives: [
      'Heatmap pricing multiplier configurations',
      'Corporate ride-budget billing dashboards',
      'Referral code reward triggers in database',
      'Promotional advertisement banner carousels'
    ]
  },
  {
    id: 'phase-4',
    phaseNum: 4,
    title: 'Phase 4 — Scale & Intelligence',
    subtitle: 'Scale & Intelligence',
    dateRange: 'November 2026',
    status: 'Locked',
    progress: 0,
    goal: 'Deploy custom AI matching predictors, demand heatmap forecasting widgets, microservices container clusters, and multi-region database replication.',
    objectives: [
      'AI-based ETA predictive optimization calculations',
      'Demand/supply weather forecasting neural nets',
      'Kubernetes service cluster deployment charts',
      'Read-replica synchronization configurations'
    ]
  }
];
