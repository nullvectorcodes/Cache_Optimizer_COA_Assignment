import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Cpu, Sparkles, Layers, Activity, Tv } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    tab,
    setTab,
    runDemo,
    isDemoRunning,
    presentationMode,
    togglePresentationMode,
  } = useCache();

  return (
    <header className="border-b border-slate-800 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-bold tracking-wider text-white uppercase font-mono-code leading-none">
              Adaptive Cache Optimizer
            </h1>
            <p className="text-xs text-slate-400 mt-1 tracking-tight">
              Adaptive Cache Architecture for Improving Memory Performance in Modern Processors
            </p>
          </div>
        </div>

        {/* ONLY TWO Primary Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
          <button
            id="tab-architecture-btn"
            onClick={() => setTab('architecture')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition uppercase font-mono-code ${
              tab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Architecture
          </button>
          <button
            id="tab-simulator-btn"
            onClick={() => setTab('simulator')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition uppercase font-mono-code ${
              tab === 'simulator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Simulator
          </button>
        </div>

        {/* System Status & Actions (No 1.8 GHz, Clean Presentation Mode toggle) */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono-code text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-semibold tracking-wider">SYSTEM READY</span>
          </div>

          {/* Presentation Mode Toggle */}
          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition border font-mono-code ${
              presentationMode
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Presentation Mode for Classroom Projector"
          >
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">{presentationMode ? 'Presentation ON' : 'Presentation Mode'}</span>
          </button>

          {/* Prominent Run Demo Button */}
          <button
            id="run-demo-btn"
            onClick={runDemo}
            disabled={isDemoRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md font-mono-code ${
              isDemoRunning
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800 cursor-wait'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-spin' : ''}`} />
            <span>{isDemoRunning ? 'Simulating...' : '▶ Run Demo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
