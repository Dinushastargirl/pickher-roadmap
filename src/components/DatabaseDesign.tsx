import React from 'react';
import { Database, Link2, Info, TableProperties, CircleDot, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DBTableField {
  name: string;
  type: string;
  constraint?: string;
  desc: string;
}

interface DBTable {
  id: string;
  name: string;
  purpose: string;
  fields: DBTableField[];
  relationships: string[];
}

export default function DatabaseDesign() {
  const [expandedTable, setExpandedTable] = React.useState<string>('trips');

  const dbTables: DBTable[] = [
    {
      id: 'users',
      name: 'Users (Passengers & Admins)',
      purpose: 'Stores passenger accounts, contact info, credential hashes, and active session tokens.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Unique identifier generated automatically.' },
        { name: 'email', type: 'VARCHAR(150)', constraint: 'UNIQUE, NOT NULL', desc: 'User registered email for communications.' },
        { name: 'password_hash', type: 'VARCHAR(255)', constraint: 'NOT NULL', desc: 'Securely hashed password string using bcrypt.' },
        { name: 'full_name', type: 'VARCHAR(100)', constraint: 'NOT NULL', desc: 'Rider legal first and last name.' },
        { name: 'phone_number', type: 'VARCHAR(20)', constraint: 'UNIQUE', desc: 'Mobile number used for ride coordinates coordination.' },
        { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', desc: 'Record insertion date.' }
      ],
      relationships: [
        'One-to-many with Trips (User represents passenger_id)',
        'One-to-many with Emergency Contacts (User represents owner_id)'
      ]
    },
    {
      id: 'drivers',
      name: 'Drivers',
      purpose: 'Manages driver-partner screening profiles, availability toggles, and vehicle associations.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Links to User ID record.' },
        { name: 'license_number', type: 'VARCHAR(50)', constraint: 'UNIQUE, NOT NULL', desc: 'Government verified driving permit.' },
        { name: 'status', type: 'VARCHAR(20)', constraint: 'DEFAULT "OFFLINE"', desc: 'State toggle: ONLINE, OFFLINE, ON_TRIP, SUSPENDED.' },
        { name: 'current_coords', type: 'GEOMETRY(Point, 4326)', constraint: 'SPATIAL INDEX', desc: 'Real-time GPS coordinate longitude and latitude.' },
        { name: 'rating_avg', type: 'DECIMAL(3,2)', constraint: 'DEFAULT 5.00', desc: 'Weighted average of trip rating scores.' },
        { name: 'vehicle_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'Associates driver with vehicle record.' }
      ],
      relationships: [
        'One-to-one with Users table via id',
        'One-to-many with Trips (Driver represents driver_id)',
        'Many-to-one with Vehicles'
      ]
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      purpose: 'Contains registered vehicle details mapping physical license plates and vehicle categories.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Unique vehicle key.' },
        { name: 'make_model', type: 'VARCHAR(100)', constraint: 'NOT NULL', desc: 'Vehicle brand and model (e.g. Toyota Prius).' },
        { name: 'license_plate', type: 'VARCHAR(15)', constraint: 'UNIQUE, NOT NULL', desc: 'Verified state plate characters.' },
        { name: 'color', type: 'VARCHAR(30)', constraint: 'NOT NULL', desc: 'Primary exterior color.' },
        { name: 'tier', type: 'VARCHAR(20)', constraint: 'DEFAULT "PickHer_Standard"', desc: 'Vehicle class tier: PickHer_Standard, PickHer_Plus.' }
      ],
      relationships: [
        'One-to-many with Drivers'
      ]
    },
    {
      id: 'trips',
      name: 'Trips (Ride Requests)',
      purpose: 'The transactional core table tracking ride geometries, billing values, and operational logs.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Unique transaction token.' },
        { name: 'passenger_id', type: 'UUID', constraint: 'FOREIGN KEY, NOT NULL', desc: ' Renders reference to requesting User.' },
        { name: 'driver_id', type: 'UUID', constraint: 'FOREIGN KEY', desc: 'Renders reference to accepting Driver (Null if PENDING).' },
        { name: 'pickup_geom', type: 'GEOMETRY(Point, 4326)', constraint: 'SPATIAL INDEX, NOT NULL', desc: 'Pickup lat/lng point coordinates.' },
        { name: 'destination_geom', type: 'GEOMETRY(Point, 4326)', constraint: 'SPATIAL INDEX, NOT NULL', desc: 'Dropoff lat/lng point coordinates.' },
        { name: 'fare_amount', type: 'DECIMAL(10,2)', constraint: 'NOT NULL', desc: 'Calculated fare cost charged to card.' },
        { name: 'status', type: 'VARCHAR(30)', constraint: 'DEFAULT "PENDING"', desc: 'Trip state: PENDING, MATCHED, ARRIVED, EN_ROUTE, COMPLETED, CANCELLED.' }
      ],
      relationships: [
        'Many-to-one with Users (passenger_id -> users.id)',
        'Many-to-one with Drivers (driver_id -> drivers.id)',
        'One-to-one with Payments record'
      ]
    },
    {
      id: 'payments',
      name: 'Payments',
      purpose: 'Audit logs for Stripe billing events, tracking successful digital captures and payouts.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Payment confirmation reference.' },
        { name: 'trip_id', type: 'UUID', constraint: 'FOREIGN KEY, NOT NULL', desc: 'Links transaction back to specific Trip.' },
        { name: 'stripe_charge_id', type: 'VARCHAR(100)', constraint: 'UNIQUE, NOT NULL', desc: 'Token reference returned by Stripe API Gateway.' },
        { name: 'amount', type: 'DECIMAL(10,2)', constraint: 'NOT NULL', desc: 'Value charged.' },
        { name: 'status', type: 'VARCHAR(20)', constraint: 'NOT NULL', desc: 'Captured status: PENDING, SUCCEEDED, REFUNDED, FAILED.' }
      ],
      relationships: [
        'One-to-one with Trips table'
      ]
    },
    {
      id: 'emergency_contacts',
      name: 'Emergency Contacts',
      purpose: 'Allows riders to declare active safety contacts who are notified on SOS trigger alerts.',
      fields: [
        { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY, NOT NULL', desc: 'Unique contact index.' },
        { name: 'passenger_id', type: 'UUID', constraint: 'FOREIGN KEY, NOT NULL', desc: 'Rider record owning this contact.' },
        { name: 'name', type: 'VARCHAR(100)', constraint: 'NOT NULL', desc: 'Contact target full name.' },
        { name: 'phone_number', type: 'VARCHAR(20)', constraint: 'NOT NULL', desc: 'Target mobile number for automated SMS notifications.' },
        { name: 'relationship', type: 'VARCHAR(50)', desc: 'Rider relationship classification (e.g. Mother, Spouse).' }
      ],
      relationships: [
        'Many-to-one with Users (passenger_id -> users.id)'
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Page Description */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="space-y-1">
          <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">Relational Schema Model</span>
          <h2 className="font-display font-black text-2xl text-white tracking-tight">Database Schema Design</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            PostgreSQL structural models utilizing PostGIS. Explore tables, data types, keys, and relational fields mapping the ride logistics framework.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tables Index Navigation List - 4 Columns */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">DATABASE ENTITIES</span>
          <div className="space-y-2">
            {dbTables.map((tbl) => {
              const isSelected = expandedTable === tbl.id;
              return (
                <button
                  key={tbl.id}
                  onClick={() => setExpandedTable(tbl.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#7C3AED]/10 border-purple-500/50 ring-1 ring-purple-500/50 shadow-lg shadow-[#7C3AED]/5' 
                      : 'bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-slate-500'}`}>
                    <TableProperties size={16} />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-sans font-bold text-white leading-none mb-1">{tbl.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-normal font-light">{tbl.purpose}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Table Fields List Schema - 8 Columns */}
        <div className="lg:col-span-8">
          {dbTables.map((tbl) => {
            if (tbl.id !== expandedTable) return null;

            return (
              <div 
                key={tbl.id} 
                className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden animate-in fade-in duration-200"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />

                {/* Table Header block */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-purple-400 font-bold">
                      <Database size={13} />
                      TABLE SCHEMA
                    </div>
                    <h3 className="font-display font-extrabold text-white text-xl tracking-tight leading-none">
                      {tbl.name}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 border border-white/10 rounded-lg">
                    Storage: PostgreSQL (PostGIS)
                  </div>
                </div>

                {/* Info block */}
                <div className="flex gap-2.5 p-3.5 bg-white/5 border border-white/5 rounded-xl">
                  <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    <strong className="text-white">Table Purpose:</strong> {tbl.purpose}
                  </p>
                </div>

                {/* Schema fields table */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">COLUMN FIELD SPECS</span>
                  <div className="border border-white/5 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 bg-white/5 px-4 py-2.5 border-b border-white/5 font-mono text-[10px] text-slate-500 font-bold">
                      <div className="col-span-3">FIELD NAME</div>
                      <div className="col-span-3">SQL TYPE</div>
                      <div className="col-span-3">CONSTRAINT</div>
                      <div className="col-span-3 text-right sm:text-left">DESCRIPTION</div>
                    </div>

                    <div className="divide-y divide-white/5 bg-transparent">
                      {tbl.fields.map((f, fIdx) => (
                        <div key={fIdx} className="grid grid-cols-12 px-4 py-3 items-center text-xs">
                          <div className="col-span-3 font-mono font-bold text-white truncate flex items-center gap-1">
                            <CircleDot size={10} className="text-[#7C3AED]" />
                            {f.name}
                          </div>
                          <div className="col-span-3 font-mono text-purple-400 truncate">{f.type}</div>
                          <div className="col-span-3 font-mono text-amber-500 truncate text-[10px]">{f.constraint || 'None'}</div>
                          <div className="col-span-3 text-slate-400 text-left leading-normal font-light truncate hover:whitespace-normal cursor-help" title={f.desc}>
                            {f.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Relational connections */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
                    <GitMerge size={12} className="text-purple-400" />
                    RELATIONAL CONSTRAINTS (FOREIGN KEYS)
                  </span>
                  <div className="space-y-2">
                    {tbl.relationships.map((rel, rIdx) => (
                      <div 
                        key={rIdx} 
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl font-mono text-xs text-slate-400"
                      >
                        <Link2 size={12} className="text-[#7C3AED]" />
                        <span>{rel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
