import React from 'react';
import { Day, Task } from '../types';
import { 
  Clock, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  FileEdit, 
  Circle,
  TrendingUp,
  Brain
} from 'lucide-react';

interface DayDetailProps {
  day: Day;
  completedTasks: string[];
  taskNotes: Record<string, string>;
  onToggleTask: (taskId: string) => void;
  onSaveTaskNote: (taskId: string, note: string) => void;
}

export default function DayDetail({ 
  day, 
  completedTasks, 
  taskNotes, 
  onToggleTask, 
  onSaveTaskNote 
}: DayDetailProps) {
  const [activeTaskNotes, setActiveTaskNotes] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setActiveTaskNotes(taskNotes);
  }, [taskNotes]);

  const handleNoteChange = (taskId: string, val: string) => {
    setActiveTaskNotes(prev => ({
      ...prev,
      [taskId]: val
    }));
  };

  const handleNoteBlur = (taskId: string) => {
    onSaveTaskNote(taskId, activeTaskNotes[taskId] || '');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Intermediate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Advanced': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-white bg-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Overview Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7C3AED]/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#7C3AED]/20 text-purple-400 border border-[#7C3AED]/30 rounded-lg font-mono font-bold text-xs uppercase">
              DAY {day.dayNum}
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">{day.title}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-mono text-slate-400 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md">
              <Clock size={12} className="text-purple-400" />
              {day.estimatedTime}
            </span>
            <span className={`text-xs font-mono px-2.5 py-1 border rounded-md font-semibold uppercase ${getDifficultyColor(day.difficulty)}`}>
              {day.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono tracking-wider font-semibold">
              <Sparkles size={13} />
              OBJECTIVE
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-light">{day.objective}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono tracking-wider font-semibold">
              <Brain size={13} />
              WHY THIS MATTERS
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">{day.whyMatters}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono tracking-wider font-semibold">
              <TrendingUp size={13} />
              EXPECTED OUTCOME
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">{day.expectedOutcome}</p>
          </div>
        </div>
      </div>

      {/* Daily Tasks List */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-white text-lg">Engineering Tasks</h3>

        {day.tasks.map((task, idx) => {
          const isCompleted = completedTasks.includes(task.id);
          return (
            <div 
              key={task.id} 
              className={`bg-white/5 border rounded-2xl p-5 transition-all duration-300 relative group ${
                isCompleted 
                  ? 'border-purple-500/30 bg-purple-500/10' 
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              {/* Task Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    className="mt-1 flex-shrink-0 cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} className="text-purple-400 fill-purple-500/10" />
                    ) : (
                      <Circle size={22} className="text-slate-600 hover:text-purple-400 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Task {idx + 1}</span>
                      {task.duration && (
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                          {task.duration}
                        </span>
                      )}
                    </div>
                    <h4 className={`font-sans font-bold text-base ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Commands Section */}
              {task.commands && task.commands.length > 0 && (
                <div className="mt-4 pl-9 space-y-3">
                  <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <Terminal size={11} />
                        TERMINAL INSTRUCTION
                      </div>
                      <span className="text-[10px] font-mono text-purple-400">bash</span>
                    </div>
                    <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 space-y-1.5">
                      {task.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className="flex gap-2">
                          <span className="text-[#7C3AED] select-none">$</span>
                          <span>{cmd}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {task.expectedResult && (
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-mono text-[11px] text-slate-400 leading-relaxed">
                      <span className="text-purple-400 font-bold">Expected Output:</span> {task.expectedResult}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Form */}
              <div className="mt-4 pl-9 pt-4 border-t border-white/5 flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <FileEdit size={12} />
                  DEVELOPER NOTES
                </label>
                <textarea
                  placeholder="Type any completion findings, debugging thoughts, or technical hurdles..."
                  value={activeTaskNotes[task.id] || ''}
                  onChange={(e) => handleNoteChange(task.id, e.target.value)}
                  onBlur={() => handleNoteBlur(task.id)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#7C3AED] focus:outline-none rounded-xl text-xs text-white p-3 leading-relaxed transition-all resize-none placeholder-slate-600"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
