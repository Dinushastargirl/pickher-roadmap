import React from 'react';
import { Phase } from '../types';
import { 
  ArrowRight, 
  Calendar, 
  Target, 
  X, 
  CheckCircle2, 
  Milestone 
} from 'lucide-react';

interface PhaseDetailProps {
  phase: Phase;
  onClose: () => void;
}

export default function PhaseDetail({ phase, onClose }: PhaseDetailProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Decorative Blur Background Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#7C3AED]/5 rounded-full filter blur-2xl pointer-events-none" />
      
      {/* Header Block */}
      <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/10 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase">
              Phase 0{phase.phaseNum} Overview
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar size={11} /> {phase.dateRange}
            </span>
          </div>
          <h2 className="font-display font-black text-white text-2xl tracking-tight leading-none mt-1">
            {phase.title}
          </h2>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Goals & Milestones Chain (8 Cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Mission Objective / Goal */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#7C3AED] font-bold">
              <Target size={13} />
              MISSION OBJECTIVE & GOAL
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans font-light">
              {phase.goal || 'No specified goal yet.'}
            </p>
          </div>

          {/* Sequential Milestones flow */}
          {phase.milestones && phase.milestones.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
                <Milestone size={12} className="text-[#7C3AED]" />
                CORE TRANSACTIONAL MILESTONE SEQUENCE
              </span>
              
              <div className="flex flex-wrap items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                {phase.milestones.map((ms, idx) => {
                  const isLast = idx === phase.milestones!.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-white">
                        <span className="w-5 h-5 rounded bg-[#7C3AED]/20 text-purple-400 border border-[#7C3AED]/30 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{ms}</span>
                      </div>
                      {!isLast && (
                        <ArrowRight size={14} className="text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Objectives checklists (4 Cols) */}
        <div className="md:col-span-4 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">DELIVERABLES</span>
          
          <div className="space-y-2">
            {phase.objectives.map((obj, oIdx) => (
              <div 
                key={oIdx} 
                className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl transition-all hover:bg-white/10 hover:border-white/10"
              >
                <div className="p-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                  <CheckCircle2 size={12} />
                </div>
                <p className="text-xs text-slate-300 leading-normal font-sans">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
