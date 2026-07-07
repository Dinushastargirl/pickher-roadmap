import React from 'react';
import { Bug } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft,
  Bug as BugIcon,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface BugTrackerProps {
  bugs: Bug[];
  onUpdateBugs: (updatedBugs: Bug[]) => void;
}

export default function BugTracker({ bugs, onUpdateBugs }: BugTrackerProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<'Low' | 'Medium' | 'High'>('Medium');

  const columns: { id: Bug['status']; label: string; bg: string; border: string; text: string }[] = [
    { id: 'Backlog', label: 'Backlog', bg: 'bg-white/5', border: 'border-white/5', text: 'text-slate-400' },
    { id: 'In Progress', label: 'In Progress', bg: 'bg-purple-500/5', border: 'border-purple-500/10', text: 'text-purple-400' },
    { id: 'Testing', label: 'Testing', bg: 'bg-amber-500/5', border: 'border-amber-500/10', text: 'text-amber-400' },
    { id: 'Completed', label: 'Completed', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', text: 'text-emerald-400' }
  ];

  const handleAddBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBug: Bug = {
      id: `bug-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'Backlog',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onUpdateBugs([newBug, ...bugs]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('Medium');
    setShowAddForm(false);
  };

  const handleDeleteBug = (bugId: string) => {
    onUpdateBugs(bugs.filter(b => b.id !== bugId));
  };

  const handleMoveBug = (bugId: string, direction: 'forward' | 'backward') => {
    const statuses: Bug['status'][] = ['Backlog', 'In Progress', 'Testing', 'Completed'];
    onUpdateBugs(bugs.map(bug => {
      if (bug.id !== bugId) return bug;
      const currentIdx = statuses.indexOf(bug.status);
      let newIdx = currentIdx;
      if (direction === 'forward' && currentIdx < statuses.length - 1) {
        newIdx = currentIdx + 1;
      } else if (direction === 'backward' && currentIdx > 0) {
        newIdx = currentIdx - 1;
      }
      return { ...bug, status: statuses[newIdx] };
    }));
  };

  const getPriorityColor = (priority: Bug['priority']) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-white bg-white/10';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Intro Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">KANBAN swimlanes</span>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">Active Bug Tracker</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Track, priority-sort, and triage system bugs across Backlog, In Progress, Testing, and Completed columns.
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans text-sm font-semibold rounded-xl shadow-lg shadow-[#7C3AED]/20 hover:shadow-[#7C3AED]/40 transition-all cursor-pointer"
          >
            <Plus size={16} />
            REPORT BUG
          </button>
        </div>
      </div>

      {/* Add Bug Form Modal-drawer */}
      {showAddForm && (
        <form 
          onSubmit={handleAddBug}
          className="bg-[#09090B]/95 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert size={18} className="text-purple-400" />
              New Bug Log Entry
            </h3>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">BUG SUMMARY / TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. Mapbox markers flickering on orientation change"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white px-4 py-2.5 placeholder-slate-600"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">TRIAGE PRIORITY</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white px-3 py-2.5"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-white hover:bg-slate-200 text-black font-sans font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                COMMIT TO BACKLOG
              </button>
            </div>

            <div className="md:col-span-12 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">DETAILED BUG DESCRIPTION</label>
              <textarea
                rows={2}
                placeholder="Describe what error is thrown, expected behaviors, and step-by-step instructions to reproduce the crash..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white p-3 placeholder-slate-600"
              />
            </div>
          </div>
        </form>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colBugs = bugs.filter(b => b.status === col.id);

          return (
            <div 
              key={col.id} 
              className={`${col.bg} border ${col.border} rounded-2xl p-4 flex flex-col space-y-4`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-sans font-extrabold ${col.text}`}>
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                    {colBugs.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 min-h-[450px] max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {colBugs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600 space-y-2 border border-dashed border-white/5 rounded-xl">
                    <BugIcon size={24} />
                    <span className="text-xs font-mono">No bugs reported</span>
                  </div>
                ) : (
                  colBugs.map((bug) => (
                    <div
                      key={bug.id}
                      className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4.5 space-y-3 relative group/item transition-all duration-200"
                    >
                      {/* Priority Tag & Actions */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getPriorityColor(bug.priority)}`}>
                          {bug.priority}
                        </span>

                        <button
                          onClick={() => handleDeleteBug(bug.id)}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                          title="Delete Bug"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-white text-sm leading-snug">
                          {bug.title}
                        </h4>
                        {bug.description && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {bug.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom Date / Swimlane Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-[9px] font-mono text-slate-600 flex items-center gap-1">
                          <Calendar size={10} /> {bug.createdAt}
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id !== 'Backlog' && (
                            <button
                              onClick={() => handleMoveBug(bug.id, 'backward')}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                              title="Move Left"
                            >
                              <ChevronLeft size={10} />
                            </button>
                          )}
                          {col.id !== 'Completed' && (
                            <button
                              onClick={() => handleMoveBug(bug.id, 'forward')}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                              title="Move Right"
                            >
                              <ChevronRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
