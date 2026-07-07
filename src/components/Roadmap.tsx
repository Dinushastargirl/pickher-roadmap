import React from 'react';
import { Phase, Week, Day } from '../types';
import { 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Play,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoadmapProps {
  phases: Phase[];
  completedTasks: string[];
  onSelectDay: (day: Day) => void;
  onSelectTab: (tabId: string) => void;
}

export default function Roadmap({ phases, completedTasks, onSelectDay, onSelectTab }: RoadmapProps) {
  const [expandedPhases, setExpandedPhases] = React.useState<Record<string, boolean>>({ 'phase-1': true });
  const [expandedWeeks, setExpandedWeeks] = React.useState<Record<string, boolean>>({ 'week-1': true });

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWeek = (id: string) => {
    setExpandedWeeks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isDayCompleted = (day: Day) => {
    if (day.tasks.length === 0) return false;
    return day.tasks.every(task => completedTasks.includes(task.id));
  };

  const completedTasksInWeekCount = (week: Week) => {
    let completed = 0;
    week.days.forEach(day => {
      day.tasks.forEach(task => {
        if (completedTasks.includes(task.id)) completed++;
      });
    });
    return completed;
  };

  const totalTasksInWeekCount = (week: Week) => {
    let total = 0;
    week.days.forEach(day => {
      total += day.tasks.length;
    });
    return total;
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Roadmap Intro Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">INTERACTIVE PIPELINE</span>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">Development Timeline</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Drill down from high-level product strategy phases into operational week targets, daily standup cards, and technical commands.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl font-mono">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Active Phase
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-700" /> Upcoming
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Stack */}
      <div className="space-y-6 relative before:absolute before:left-6 md:before:left-8 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#7C3AED] before:via-white/10 before:to-transparent">
        {phases.map((phase, pIdx) => {
          const isPhaseOpen = expandedPhases[phase.id];
          const isActive = phase.status === 'Active';
          const isLocked = phase.status === 'Locked';
          const isUpcoming = phase.status === 'Upcoming';

          return (
            <div key={phase.id} className="relative pl-14 md:pl-20 group">
              {/* Timeline Connector Indicator Node */}
              <div 
                onClick={() => !isLocked && togglePhase(phase.id)}
                className={`absolute left-3 md:left-5 top-1.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg shadow-[#7C3AED]/20 ring-4 ring-[#7C3AED]/15' 
                    : isUpcoming
                      ? 'bg-white/5 text-amber-400 border border-white/10'
                      : 'bg-white/5 text-slate-500 border border-white/5'
                }`}
              >
                {isLocked ? (
                  <Lock size={12} />
                ) : (
                  <span className="text-xs font-mono font-bold">{pIdx + 1}</span>
                )}
              </div>

              {/* Phase Box */}
              <div className={`bg-white/5 border rounded-2xl p-5 ${
                isActive 
                  ? 'border-purple-500/30 shadow-xl shadow-[#7C3AED]/2' 
                  : 'border-white/5'
              }`}>
                {/* Phase Header */}
                <div 
                  onClick={() => !isLocked && togglePhase(phase.id)}
                  className={`flex items-center justify-between gap-4 cursor-pointer ${isLocked ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">PHASE {phase.phaseNum}</span>
                      <span className="text-xs font-mono text-slate-400 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md">
                        {phase.dateRange}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                      {phase.title}
                    </h3>
                  </div>

                  {!isLocked && (
                    <button className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                      {isPhaseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>

                {/* Expanded Content (Weeks -> Days -> Tasks) */}
                <AnimatePresence>
                  {isPhaseOpen && phase.weeks && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-5 pt-5 border-t border-white/5 space-y-5"
                    >
                      {phase.weeks.map((week) => {
                        const isWeekOpen = expandedWeeks[week.id];
                        const completedCount = completedTasksInWeekCount(week);
                        const totalCount = totalTasksInWeekCount(week);

                        return (
                          <div key={week.id} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-4">
                            {/* Week Accordion Header */}
                            <div 
                                onClick={() => toggleWeek(week.id)}
                                className="flex items-center justify-between gap-4 cursor-pointer hover:opacity-95 transition-opacity"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-purple-400 font-mono font-semibold">WEEK {week.weekNum}</span>
                                  <span className="text-xs text-slate-500 font-sans font-medium">{week.goal}</span>
                                </div>
                                <h4 className="font-sans font-bold text-white text-base">{week.title}</h4>
                              </div>

                              <div className="flex items-center gap-3">
                                {totalCount > 0 && (
                                  <span className="text-[10px] font-mono font-medium text-slate-400 px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                                    {completedCount}/{totalCount} Tasks
                                  </span>
                                )}
                                <button className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                  {isWeekOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              </div>
                            </div>

                            {/* Week Milestones Summary Checklist */}
                            {isWeekOpen && week.milestones && (
                              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3 bg-white/5 border border-white/5 rounded-xl">
                                {week.milestones.map((ms, msIdx) => (
                                  <div 
                                    key={msIdx} 
                                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs font-mono truncate ${
                                      ms.completed 
                                        ? 'bg-[#7C3AED]/10 border-purple-500/25 text-purple-400' 
                                        : 'bg-white/5 border border-white/5 text-slate-500'
                                    }`}
                                  >
                                    <div className="shrink-0">
                                      {ms.completed ? (
                                        <CheckCircle2 size={12} className="text-purple-400" />
                                      ) : (
                                        <Circle size={12} className="text-slate-600" />
                                      )}
                                    </div>
                                    <span>{ms.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Days Drawer */}
                            {isWeekOpen && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {week.days.map((day) => {
                                  const completed = isDayCompleted(day);
                                  const totalDayTasks = day.tasks.length;
                                  const doneDayTasks = day.tasks.filter(t => completedTasks.includes(t.id)).length;

                                  return (
                                    <div
                                      key={day.id}
                                      onClick={() => {
                                        onSelectDay(day);
                                        onSelectTab('dashboard'); // Redirect to dashboard or view details
                                        // Scroll to view
                                        setTimeout(() => {
                                          document.getElementById('day-detail-panel')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                      }}
                                      className={`group/day p-4 rounded-xl border text-left transition-all duration-300 relative cursor-pointer ${
                                        completed
                                          ? 'bg-gradient-to-tr from-white/5 to-[#7C3AED]/10 border-purple-500/30'
                                          : 'bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 rounded border border-white/10 text-purple-400">
                                          DAY {day.dayNum}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                          <Clock size={10} /> {day.estimatedTime}
                                        </span>
                                      </div>

                                      <h5 className="font-sans font-bold text-white text-sm group-hover/day:text-purple-400 transition-colors line-clamp-1">
                                        {day.title}
                                      </h5>
                                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1.5 font-light">
                                        {day.objective}
                                      </p>

                                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                                        <span className={`text-[10px] font-mono font-semibold uppercase ${
                                          day.difficulty === 'Beginner' ? 'text-emerald-400' :
                                          day.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'
                                        }`}>
                                          {day.difficulty}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                                          <span>{doneDayTasks}/{totalDayTasks} Tasks</span>
                                          <ArrowRight size={10} className="text-slate-500 group-hover/day:translate-x-1 transition-transform" />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
