import React from 'react';
import { 
  Smartphone, 
  Cpu, 
  Database, 
  MapPin, 
  Key, 
  Bell, 
  Activity, 
  ArrowDown, 
  Server,
  Workflow,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Architecture() {
  const [selectedNode, setSelectedNode] = React.useState<string>('matching');

  const layers = [
    {
      id: 'clients',
      title: 'Mobile Client Tier',
      description: 'Native mobile apps developed with Expo & React Native, compiling to Android/iOS targets.',
      nodes: [
        { id: 'passenger-app', name: 'Passenger Client', icon: Smartphone, type: 'app', spec: 'React Native / Expo, Redux Toolkit, Mapbox GL' },
        { id: 'driver-app', name: 'Driver Client', icon: Smartphone, type: 'app', spec: 'React Native / Expo, Background Location Tracking' }
      ]
    },
    {
      id: 'gateway',
      title: 'Ingress & API Gateway',
      description: 'Reverse proxy and API router distributing REST calls and socket channels.',
      nodes: [
        { id: 'api-gateway', name: 'Nginx / Socket Gateway', icon: Server, type: 'gateway', spec: 'Reverse proxy, SSL termination, Socket.io clustering' }
      ]
    },
    {
      id: 'services',
      title: 'Central Node.js Backend & Services',
      description: 'Distributed microservices driving ride logistics, user accounts, and matching workflows.',
      nodes: [
        { id: 'auth-service', name: 'Auth Service', icon: Key, type: 'service', desc: 'Handles passenger & driver register/login, JWT validation, and password salting.' },
        { id: 'trip-service', name: 'Trip Manager', icon: Activity, type: 'service', desc: 'State-machine tracking ride state (PENDING, ACCEPTED, EN_ROUTE, COMPLETED).' },
        { id: 'matching-engine', name: 'Matching Engine', icon: Sparkles, type: 'service', desc: 'Selects the closest active driver using spatial geometry computations and queues.' },
        { id: 'location-service', name: 'Location Poller', icon: MapPin, type: 'service', desc: 'Captures driver coordinates at 3s intervals and broadcasts real-time telemetry.' },
        { id: 'notification-service', name: 'Notification Hub', icon: Bell, type: 'service', desc: 'Coordinates Firebase Cloud Messages (FCM) and instant alert sounds.' }
      ]
    },
    {
      id: 'data-tier',
      title: 'State & Persistence Tier',
      description: 'High-availability storage managing transaction state and spatial geospatial coordinates.',
      nodes: [
        { id: 'postgres', name: 'PostgreSQL & PostGIS', icon: Database, type: 'db', spec: 'Users, Trips, Driver state. PostGIS ST_DWithin geospatial querying.' },
        { id: 'redis', name: 'Redis Cache', icon: Database, type: 'db', spec: 'Active driver coordinate lookup cache, session stores, lock keys.' }
      ]
    }
  ];

  const nodeDetails: Record<string, { title: string; tech: string; description: string; codeSample?: string }> = {
    'passenger-app': {
      title: 'Passenger Client Application',
      tech: 'React Native / TypeScript / Expo Router',
      description: 'The core rider interface. Features map-based checkout screens, real-time vehicle movement, automatic routing polylines, digital Stripe wallet integrations, and distress SOS triggers.',
      codeSample: `// Connect passenger client to core matching stream
import { io } from 'socket.io-client';
const socket = io(process.env.BACKEND_API_URL);

socket.emit('ride:request', {
  pickup: { lat: 37.7749, lng: -122.4194 },
  destination: { lat: 37.7892, lng: -122.4014 },
  tier: 'PickHer_Standard'
});`
    },
    'driver-app': {
      title: 'Driver Client Application',
      tech: 'React Native / TypeScript / Background Geolocation',
      description: 'The driver partner dashboard. Runs persistent background OS location tasks tracking GPS coordinates, handles incoming ride-match cards with automatic price surging, and renders inline navigation routes.',
      codeSample: `// Start background location updates at 3-second intervals
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';

Location.startLocationUpdatesAsync('driver-location-tracker', {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 3000,
  deferredUpdatesInterval: 3000,
});`
    },
    'api-gateway': {
      title: 'API Gateway Routing',
      tech: 'Express / Nginx / Socket.io Engine',
      description: 'Binds the HTTP ports, intercepts incoming HTTP REST payloads, validates JWT credentials in header authorization blocks, and handles persistent keep-alive web-socket connections.',
      codeSample: `// Gateway WebSocket connection middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (verifyJWT(token)) {
    return next();
  }
  return next(new Error("Authentication failed"));
});`
    },
    'auth-service': {
      title: 'Authentication Service',
      tech: 'Node.js / Express / BCrypt / JWT',
      description: 'Handles credentials authentication, processes signup validation rules, generates JWT tokens with custom claims, and performs permission gatekeeping.',
      codeSample: `// Generate JWT payload for authenticated session
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { uid: user.id, role: 'driver' }, 
  process.env.JWT_SECRET, 
  { expiresIn: '30d' }
);`
    },
    'trip-service': {
      title: 'Trip State Manager',
      tech: 'Node.js / Finite State Machines',
      description: 'Orchestrates the entire lifecycle of a trip. Guarantees that active rides transition through state stages sequentially (PENDING -> MATCHED -> ARRIVED -> EN_ROUTE -> COMPLETED) to avoid state conflicts.',
      codeSample: `// Enforce sequential trip state transitions
const transitionTrip = async (tripId, nextState) => {
  const current = await db.trips.findUnique({ where: { id: tripId } });
  if (isValidTransition(current.status, nextState)) {
    return await db.trips.update({
      where: { id: tripId },
      data: { status: nextState }
    });
  }
  throw new Error("Invalid state transition");
};`
    },
    'matching-engine': {
      title: 'PickHer Matching Algorithm',
      tech: 'Node.js / PostGIS Spatial Radius Query',
      description: 'The central brains. Triggers on new ride request, queries PostgreSQL/Redis for active and unengaged drivers in a 3km geofence, and handles FIFO broadcast buffers.',
      codeSample: `// Core spatial query selecting closest driver
const queryClosestDriver = async (pickupLat, pickupLng) => {
  return await db.$queryRaw\`
    SELECT id, socket_id, ST_Distance(geom, ST_MakePoint(\${pickupLng}, \${pickupLat})::geography) AS distance
    FROM drivers
    WHERE status = 'ONLINE' AND active_trip_id IS NULL
    AND ST_DWithin(geom, ST_MakePoint(\${pickupLng}, \${pickupLat})::geography, 3000)
    ORDER BY distance ASC
    LIMIT 1;
  \`;
};`
    },
    'location-service': {
      title: 'Geotelemetry Location Poller',
      tech: 'Node.js / Socket.io broadcast',
      description: 'Captures rapid geospatial telemetry reports from active drivers and broadcasts them to active passengers so that map pins slide smoothly along route lines without screen jumps.',
      codeSample: `// Broadcast driver location coordinates to matching room
socket.on('driver:location:update', (data) => {
  const { tripId, latitude, longitude, heading } = data;
  
  // Cache coordinates in Redis
  redis.set(\`driver:loc:\${socket.userId}\`, JSON.stringify({ latitude, longitude }));
  
  // Broadcast coordinates to corresponding passenger
  socket.to(\`trip:\${tripId}\`).emit('driver:moved', { latitude, longitude, heading });
});`
    },
    'notification-service': {
      title: 'Push Notification Dispatcher',
      tech: 'Firebase Cloud Messaging (FCM)',
      description: 'Pushes silent system alerts, background notification banners, and app wake-up calls. Ensures drivers are immediately alerted even if the mobile device is currently in standby sleep mode.',
      codeSample: `// Send FCM alert to wake driver terminal
import admin from 'firebase-admin';

const payload = {
  notification: {
    title: 'New Ride Offer available!',
    body: 'Earn $18.50 - Pickup is 1.2km away.'
  },
  data: { tripId: trip.id }
};
admin.messaging().sendToDevice(driver.fcmToken, payload);`
    },
    'postgres': {
      title: 'Relational Database (PostgreSQL & PostGIS)',
      tech: 'PostgreSQL / PostGIS Spatial Indexes',
      description: 'Stores user accounts, financial records, transaction logs, and emergency contact registries. Leverages PostGIS geospatial tables to calculate instant trip distances and spatial queries.',
      codeSample: `// Trip record schema definition
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES users(id),
  pickup_geom GEOMETRY(Point, 4326),
  destination_geom GEOMETRY(Point, 4326),
  fare_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'PENDING'
);`
    },
    'redis': {
      title: 'Redis Telemetry Cache Store',
      tech: 'In-Memory Redis Cache',
      description: 'In-memory low-latency cluster caching real-time online driver geographic locations. Acts as a high-speed lock buffer preventing concurrent double driver matches.',
      codeSample: `// Cache coordinates in Redis
redis.set(\`driver:loc:\${driverId}\`, JSON.stringify({ lat, lng }), 'EX', 10);`
    }
  };

  const selectedDetails = nodeDetails[selectedNode] || nodeDetails['matching-engine'];

  return (
    <div className="space-y-6 pb-6">
      {/* Intro header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="space-y-1">
          <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">Technical Topology</span>
          <h2 className="font-display font-black text-2xl text-white tracking-tight">PickHer System Architecture</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Interactive, full-stack microservices blueprint. Click any node in the diagram below to inspect the service responsibilities, code templates, and databases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Architecture Layout Chart - 7 Columns */}
        <div className="lg:col-span-7 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden space-y-8">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-3 relative">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                  {layer.title}
                </span>
                <span className="h-[1px] bg-white/10 flex-grow" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layer.nodes.map((node) => {
                  const NodeIcon = node.icon;
                  const isSelected = selectedNode === node.id;
                  
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 relative cursor-pointer ${
                        isSelected 
                          ? 'bg-[#7C3AED]/10 border-purple-500/50 ring-1 ring-purple-500/50 font-medium' 
                          : 'bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-slate-500'
                      }`}>
                        <NodeIcon size={18} />
                      </div>
                      <div className="truncate">
                        <p className={`text-[9px] font-mono tracking-wider ${isSelected ? 'text-purple-400 font-bold' : 'text-slate-500'}`}>
                          {node.type.toUpperCase()}
                        </p>
                        <h4 className="text-xs font-sans font-bold text-white truncate">{node.name}</h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Connected flow arrow indicator */}
              {layer.id !== 'data-tier' && (
                <div className="flex justify-center py-1">
                  <div className="p-1 rounded-full bg-white/5 border border-white/10 text-slate-500">
                    <ArrowDown size={12} className="animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Node Inspector Details Panel - 5 Columns */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/20 flex items-center justify-center text-purple-400">
                <Layers size={16} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">LAYER NODE INSPECTOR</span>
                <h3 className="font-display font-bold text-white text-base leading-none mt-0.5">Component Spec</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-semibold">{selectedDetails.tech}</span>
                <h4 className="font-display font-black text-white text-lg tracking-tight mt-0.5">
                  {selectedDetails.title}
                </h4>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {selectedDetails.description}
              </p>
            </div>

            {selectedDetails.codeSample && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">LOGICAL IMPLEMENTATION</span>
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 font-mono text-[10px] text-slate-500">
                    <span>core_implementation.ts</span>
                    <span>TypeScript</span>
                  </div>
                  <pre className="p-4 font-mono text-[10px] text-slate-200 overflow-x-auto leading-normal">
                    <code>{selectedDetails.codeSample}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
