import React from 'react';
import { 
  ChecklistItem, 
  Bug, 
  JournalEntry, 
  Day, 
  Phase, 
  DashboardState 
} from './types';
import { roadmapPhases } from './data/roadmapData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Architecture from './components/Architecture';
import DatabaseDesign from './components/DatabaseDesign';
import BugTracker from './components/BugTracker';
import DevJournal from './components/DevJournal';
import DailyChecklist from './components/DailyChecklist';
import DayDetail from './components/DayDetail';
import PhaseDetail from './components/PhaseDetail';
import { 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  Terminal, 
  CheckCircle, 
  HelpCircle,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [authPassword, setAuthPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('dashboard');

  // Database core States
  const [checklist, setChecklist] = React.useState<ChecklistItem[]>([]);
  const [bugs, setBugs] = React.useState<Bug[]>([]);
  const [journal, setJournal] = React.useState<JournalEntry[]>([]);
  const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);
  const [taskNotes, setTaskNotes] = React.useState<Record<string, string>>({});

  // Navigation Detail States
  const [selectedDay, setSelectedDay] = React.useState<Day | null>(null);
  const [selectedPhase, setSelectedPhase] = React.useState<Phase | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string>('');

  // Check auth and fetch state on load
  React.useEffect(() => {
    const isAuthed = localStorage.getItem('pickher_auth_token') === 'pickher-token-2026';
    if (isAuthed) {
      setAuthenticated(true);
    }
    fetchDatabaseState();
  }, []);

  const fetchDatabaseState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data.success && data.state) {
        setChecklist(data.state.checklist || []);
        setBugs(data.state.bugs || []);
        setJournal(data.state.journal || []);
        setCompletedTasks(data.state.completedTasks || []);
        setTaskNotes(data.state.taskNotes || {});

        // Set default selected day to Day 1
        if (roadmapPhases[0]?.weeks?.[0]?.days?.[0]) {
          setSelectedDay(roadmapPhases[0].weeks[0].days[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load database state from full-stack server API:', e);
    }
  };

  const saveDatabaseState = async (updates: Partial<DashboardState>) => {
    // Optimistic UI updating
    const mergedState = {
      checklist: updates.checklist !== undefined ? updates.checklist : checklist,
      bugs: updates.bugs !== undefined ? updates.bugs : bugs,
      journal: updates.journal !== undefined ? updates.journal : journal,
      completedTasks: updates.completedTasks !== undefined ? updates.completedTasks : completedTasks,
      taskNotes: updates.taskNotes !== undefined ? updates.taskNotes : taskNotes,
    };

    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedState)
      });
      const data = await res.json();
      if (data.success) {
        showStatusBanner('Database synced successfully');
      }
    } catch (e) {
      console.error('Failed to persist database state to server:', e);
      showStatusBanner('Offline mode - local cache saved');
    }
  };

  const showStatusBanner = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage('');
    }, 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('pickher_auth_token', data.token);
        setAuthenticated(true);
        setAuthPassword('');
      } else {
        setAuthError(data.error || 'Invalid passcode');
      }
    } catch (err) {
      setAuthError('Connection failure to validation endpoint.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pickher_auth_token');
    setAuthenticated(false);
  };

  // Checklist toggles
  const handleToggleChecklistItem = (id: string) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    saveDatabaseState({ checklist: updated });
  };

  const handleResetChecklist = () => {
    const updated = checklist.map(item => ({ ...item, completed: false }));
    setChecklist(updated);
    saveDatabaseState({ checklist: updated });
  };

  // Day detail task toggles
  const handleToggleTask = (taskId: string) => {
    const nextCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(nextCompleted);
    saveDatabaseState({ completedTasks: nextCompleted });
  };

  // Save specific notes associated with a task
  const handleSaveTaskNote = (taskId: string, note: string) => {
    const nextNotes = { ...taskNotes, [taskId]: note };
    setTaskNotes(nextNotes);
    saveDatabaseState({ taskNotes: nextNotes });
  };

  // Update lists of bugs
  const handleUpdateBugs = (updatedBugs: Bug[]) => {
    setBugs(updatedBugs);
    saveDatabaseState({ bugs: updatedBugs });
  };

  // Update list of standup journal entries
  const handleUpdateJournal = (updatedJournal: JournalEntry[]) => {
    setJournal(updatedJournal);
    saveDatabaseState({ journal: updatedJournal });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated backdrop grid circles */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#A78BFA]/5  rounded-full filter blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#121214]/60 border border-[#27272A]/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-[#7C3AED]/20">
              P
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#A78BFA] uppercase font-bold">PICKHER STARTUP</span>
              <h1 className="font-sans font-black text-white text-2xl tracking-tight mt-1">Mission Control</h1>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                Enter your security key credentials to synchronize development logs and unlock terminal panels.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#A1A1AA] tracking-wider uppercase flex items-center gap-1.5">
                <Lock size={12} className="text-[#7C3AED]" />
                STATION SECURITY PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="Hint: pickher2026"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] focus:border-[#7C3AED] focus:outline-none rounded-xl text-center text-white px-4 py-3 placeholder-[#52525B] tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-xs font-mono text-rose-400 text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-sans font-bold text-sm rounded-xl shadow-lg shadow-[#7C3AED]/20 hover:shadow-[#7C3AED]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              INITIALIZE GATEWAY
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#27272A]/40 text-center text-[10px] font-mono text-[#52525B] space-y-1">
            <p>SECURE SECRETS INJECTED v1.4.1</p>
            <p>© 2026 PICKHER MOBILE INC.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render main content based on tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Primary left panel column (8 cols) */}
            <div className="xl:col-span-8 space-y-6">
              <Dashboard 
                phases={roadmapPhases} 
                checklist={checklist}
                completedTasks={completedTasks}
                onSelectPhase={(phaseId) => {
                  const target = roadmapPhases.find(p => p.id === phaseId);
                  if (target) {
                    setSelectedPhase(target);
                  }
                }}
              />

              {/* Collapsed Active Phase detailed panel */}
              {selectedPhase && (
                <PhaseDetail 
                  phase={selectedPhase} 
                  onClose={() => setSelectedPhase(null)} 
                />
              )}

              {/* Selected Day Standup detail panel */}
              {selectedDay && (
                <div id="day-detail-panel">
                  <DayDetail 
                    day={selectedDay}
                    completedTasks={completedTasks}
                    taskNotes={taskNotes}
                    onToggleTask={handleToggleTask}
                    onSaveTaskNote={handleSaveTaskNote}
                  />
                </div>
              )}
            </div>

            {/* Sticky Right side panels (4 cols) */}
            <div className="xl:col-span-4 space-y-6 sticky top-6">
              <DailyChecklist 
                checklist={checklist} 
                onToggleItem={handleToggleChecklistItem}
                onReset={handleResetChecklist}
              />

              {/* Dev Info box */}
              <div className="bg-[#121214]/40 border border-[#27272A]/80 rounded-2xl p-5 font-mono text-xs text-[#71717A] space-y-3.5">
                <div className="flex items-center gap-2 text-[#A78BFA] font-bold">
                  <Activity size={14} />
                  <span>SYSTEM METRICS</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>HOST NODE:</span>
                    <span className="text-white">Cloud Run v2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PORT:</span>
                    <span className="text-white">3000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PERSISTENCE:</span>
                    <span className="text-emerald-400 font-bold">ACTIVE (db.json)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#18181B] rounded-xl border border-[#27272A]/50 text-[10px] leading-relaxed">
                  <span className="text-amber-300 font-bold">STATION MESSAGE:</span> Welcome back Commander. Progress checklists and daily standups completed in this dashboard sync directly to local disk on the server container.
                </div>
              </div>
            </div>
          </div>
        );
      case 'roadmap':
        return (
          <Roadmap 
            phases={roadmapPhases} 
            completedTasks={completedTasks} 
            onSelectDay={setSelectedDay}
            onSelectTab={setActiveTab}
          />
        );
      case 'architecture':
        return <Architecture />;
      case 'database':
        return <DatabaseDesign />;
      case 'bugs':
        return <BugTracker bugs={bugs} onUpdateBugs={handleUpdateBugs} />;
      case 'journal':
        return <DevJournal entries={journal} onUpdateJournal={handleUpdateJournal} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col md:flex-row font-sans text-white">
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main console content viewport container */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-h-screen">
        {/* Dynamic status save indicator bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#71717A] font-mono tracking-wider uppercase">PICKHER MISSION CONTROL TERMINAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <AnimatePresence>
            {statusMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5"
              >
                <CheckCircle size={10} />
                {statusMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
