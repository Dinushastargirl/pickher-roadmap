import React from 'react';
import { ChecklistItem } from '../types';
import { Check, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyChecklistProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onReset?: () => void;
}

export default function DailyChecklist({ checklist, onToggleItem, onReset }: DailyChecklistProps) {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
      {/* Subtle purple background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full filter blur-xl transition-all duration-300 group-hover:bg-[#7C3AED]/10 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">Foundation Tasks</span>
          <h3 className="font-display font-bold text-white text-lg mt-0.5">Daily Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-white px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
            {completedCount}/{totalCount}
          </span>
          {onReset && (
            <button 
              onClick={onReset}
              title="Reset Checklist"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-500">Completion Rate</span>
          <span className="text-purple-400 font-bold">{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#7C3AED] to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {checklist.map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                item.completed
                  ? 'bg-purple-500/10 border-purple-500/20 text-slate-300'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:bg-white/10'
              }`}
            >
              <div className="shrink-0">
                {item.completed ? (
                  <div className="w-4 h-4 rounded-md bg-[#7C3AED] flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-md border border-white/20 flex items-center justify-center bg-transparent" />
                )}
              </div>
              <span className={`text-xs font-sans truncate ${item.completed ? 'line-through text-slate-500' : ''}`}>
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
