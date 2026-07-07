import React from 'react';
import { Phase, ChecklistItem } from '../types';
import { 
  Milestone, 
  Target, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Layers, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  phases: Phase[];
  checklist: ChecklistItem[];
  completedTasks: string[];
  onSelectPhase: (phaseId: string) => void;
  activeSprintName?: string;
  todayFocusMessage?: string;
}

export default function Dashboard({ 
  phases, 
  checklist, 
  completedTasks, 
  onSelectPhase,
  activeSprintName = "Sprint 1 — Foundation Setup",
  todayFocusMessage = "Set up development environments, repositories, and backend foundation."
}: DashboardProps) {
  
  // Calculate total tasks in our database
  const totalTasksCount = phases.reduce((acc, phase) => {
    if (phase.weeks) {
      phase.weeks.forEach(week => {
        week.days.forEach(day => {
          acc += day.tasks.length;
        });
      });
    }
    return acc;
  }, 0);

  const completedTasksCount = completedTasks.length;
  // Calculate completion percentage
  const totalOverallProgress = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 26; // default fallback

  // Day countdown calculations
  // Today: July 7, 2026
  // Launch: July 31, 2026
  const targetDate = new Date('2026-07-31T23:59:59');
  const currentDate = new Date('2026-07-07T04:10:39');
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  // Circular SVG ring settings for header
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (totalOverallProgress / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Sleek Theme Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 bg-[#09090B]/50 py-6 backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">PickHer Development Roadmap</h1>
          <p className="text-sm text-slate-400 mt-1">From idea to launch — building the future of safe mobility.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Launch Target</div>
            <div className="text-lg font-bold text-white">July 31, 2026</div>
          </div>
          <div className="h-12 w-[1px] bg-white/10 hidden sm:block"></div>
          <div className="relative h-16 w-16">
            <svg className="h-full w-full rotate-[-90deg]">
              <circle 
                cx="32" 
                cy="32" 
                r={normalizedRadius} 
                stroke="currentColor" 
                strokeWidth={stroke} 
                fill="transparent" 
                className="text-white/10"
              />
              <motion.circle 
                cx="32" 
                cy="32" 
                r={normalizedRadius} 
                stroke="#7C3AED" 
                strokeWidth={stroke} 
                fill="transparent" 
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1 }}
                className="text-[#7C3AED]"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white">
              {totalOverallProgress}%
            </div>
          </div>
        </div>
      </header>

      {/* Sleek Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 font-mono">Current Stage</div>
          <div className="mt-1 text-lg font-black text-white font-display">PHASE 1</div>
          <div className="text-xs text-purple-400 font-mono">MVP Development</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 font-mono">Days Remaining</div>
          <div className="mt-1 text-lg font-black text-white font-mono">{daysRemaining} Days</div>
          <div className="text-xs text-emerald-400 font-mono">On Schedule</div>
        </div>
        <div className="col-span-1 sm:col-span-2 rounded-2xl border border-[#7C3AED]/30 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent p-4.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#7C3AED] font-mono">Today's Focus</div>
          <div className="mt-1 text-sm font-medium leading-relaxed text-slate-200">
            {todayFocusMessage}
          </div>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white">Project Lifecycles</h2>
          <span className="text-xs text-purple-400 hover:underline cursor-pointer flex items-center gap-1 font-mono">
            Explore active phase milestones &rarr;
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {phases.map((phase) => {
            const isActive = phase.status === 'Active';
            const isUpcoming = phase.status === 'Upcoming';
            const isLocked = phase.status === 'Locked';

            if (isActive) {
              return (
                <div
                  key={phase.id}
                  onClick={() => onSelectPhase(phase.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-500/50 bg-[#7C3AED]/10 p-5 ring-1 ring-[#7C3AED]/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col justify-between h-56"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded bg-[#7C3AED] px-2 py-0.5 text-[9px] font-bold text-white font-mono uppercase">
                      ACTIVE
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{phase.dateRange}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-display text-white">PHASE {phase.phaseNum}</h3>
                    <p className="text-sm text-slate-300 mt-1">{phase.title}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="mb-1 flex justify-between text-[9px] font-mono font-bold text-slate-400">
                      <span>PROGRESS</span>
                      <span>{totalOverallProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${totalOverallProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={phase.id}
                onClick={() => {
                  if (!isLocked) {
                    onSelectPhase(phase.id);
                  }
                }}
                className={`group relative rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-300 flex flex-col justify-between h-56 ${
                  isLocked ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer hover:border-white/15'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold font-mono uppercase ${
                    isUpcoming ? 'bg-amber-500/10 text-amber-400' : 'bg-white/10 text-slate-400'
                  }`}>
                    {isUpcoming ? 'Upcoming' : 'Locked'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{phase.dateRange}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black font-display text-slate-300">PHASE {phase.phaseNum}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{phase.title}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed line-clamp-2">
                    {phase.goal || 'Upcoming stage objective details.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
