import React from 'react';
import { JournalEntry } from '../types';
import { BookOpen, Plus, Calendar, CheckSquare, ShieldAlert, Sparkles, Footprints, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DevJournalProps {
  entries: JournalEntry[];
  onUpdateJournal: (updatedJournal: JournalEntry[]) => void;
}

export default function DevJournal({ entries, onUpdateJournal }: DevJournalProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [completed, setCompleted] = React.useState('');
  const [challenges, setChallenges] = React.useState('');
  const [solutions, setSolutions] = React.useState('');
  const [nextSteps, setNextSteps] = React.useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completed.trim()) return;

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date,
      completed,
      challenges,
      solutions,
      nextSteps
    };

    onUpdateJournal([newEntry, ...entries]);
    setCompleted('');
    setChallenges('');
    setSolutions('');
    setNextSteps('');
    setShowForm(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    onUpdateJournal(entries.filter(e => e.id !== entryId));
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Intro Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">DAILY ENGINEERING STANDUPS</span>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">Development Journal</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Document daily completions, roadblocks, architectural choices, and upcoming sprints to maintain a permanent audit log of the PickHer startup lifecycle.
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-200 text-black font-sans text-sm font-bold rounded-xl transition-all cursor-pointer shadow-lg"
          >
            <Plus size={16} />
            NEW JOURNAL LOG
          </button>
        </div>
      </div>

      {/* Journal Entry Form */}
      {showForm && (
        <form 
          onSubmit={handleAddEntry}
          className="bg-[#09090B]/95 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              New Standup Log Entry
            </h3>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">STANDUP DATE</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white px-4 py-2.5"
              />
            </div>

            <div className="md:col-span-8 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">WHAT WAS COMPLETED TODAY?</label>
              <input
                type="text"
                required
                placeholder="e.g. Completed central user schemas, configured Dockerfiles and ran JWT benchmarks."
                value={completed}
                onChange={(e) => setCompleted(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white px-4 py-2.5 placeholder-slate-600"
              />
            </div>

            <div className="md:col-span-6 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <ShieldAlert size={11} className="text-rose-400" /> CHALLENGES / HURDLES
              </label>
              <textarea
                rows={2}
                placeholder="List any technical bottlenecks, dependency errors, or database timeout triggers..."
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white p-3 placeholder-slate-600"
              />
            </div>

            <div className="md:col-span-6 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <Sparkles size={11} className="text-emerald-400" /> APPLIED SOLUTIONS
              </label>
              <textarea
                rows={2}
                placeholder="How did you break through? (e.g. Added caching layers, optimized Knex queries, etc.)"
                value={solutions}
                onChange={(e) => setSolutions(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white p-3 placeholder-slate-600"
              />
            </div>

            <div className="md:col-span-12 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <Footprints size={11} className="text-purple-400" /> NEXT STEPS
              </label>
              <input
                type="text"
                placeholder="e.g. Integrate core matching buffers, write socket.io room handshakes."
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-sm text-white px-4 py-2.5 placeholder-slate-600"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-bold text-sm rounded-xl shadow-lg shadow-[#7C3AED]/10 transition-all cursor-pointer"
              >
                PUBLISH LOG
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Journal entries timeline */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#7C3AED] before:to-white/10">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 space-y-2 border border-dashed border-white/5 rounded-2xl bg-white/5">
            <BookOpen size={40} />
            <span className="text-sm font-sans">No journal entries. Publish your first daily standup log!</span>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="relative pl-14 group">
              {/* Timeline dot */}
              <div className="absolute left-3.5 top-2.5 w-5 h-5 rounded-full bg-[#09090B] border-2 border-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </div>

              {/* Entry card */}
              <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-4 transition-colors relative">
                
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 size={14} />
                </button>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono font-bold uppercase">
                  <Calendar size={13} />
                  {entry.date}
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-white/5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-1">
                      <CheckSquare size={11} className="text-purple-400" /> Completed
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">{entry.completed}</p>
                  </div>

                  {entry.nextSteps && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-1">
                        <Footprints size={11} className="text-amber-400" /> Next Steps
                      </span>
                      <p className="text-sm text-slate-400 leading-relaxed font-sans">{entry.nextSteps}</p>
                    </div>
                  )}

                  {entry.challenges && (
                    <div className="space-y-1.5 md:col-span-2 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <span className="text-[10px] font-mono text-rose-400 tracking-widest uppercase flex items-center gap-1 font-semibold">
                        <ShieldAlert size={11} /> Roadblocks & Challenges
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">{entry.challenges}</p>
                    </div>
                  )}

                  {entry.solutions && (
                    <div className="space-y-1.5 md:col-span-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase flex items-center gap-1 font-semibold">
                        <Sparkles size={11} /> Breakthroughs & Solutions
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">{entry.solutions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
