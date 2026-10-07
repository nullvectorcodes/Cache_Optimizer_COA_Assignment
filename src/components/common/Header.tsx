import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Cpu, Play, Loader2, Layers, Activity, Maximize2 } from 'lucide-react';

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
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 text-white shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-950 uppercase font-mono-code leading-none">
              Adaptive Cache Optimizer
            </h1>
            <p className="text-xs text-zinc-500 mt-1 tracking-tight">
              Adaptive Cache Architecture for Improving Memory Performance in Modern Processors
            </p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center p-1 bg-zinc-100 border border-zinc-200 rounded-lg">
          <button
            id="tab-architecture-btn"
            onClick={() => setTab('architecture')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wider transition uppercase font-mono-code ${
              tab === 'architecture'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Architecture
          </button>
          <button
            id="tab-simulator-btn"
            onClick={() => setTab('simulator')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wider transition uppercase font-mono-code ${
              tab === 'simulator'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Simulator
          </button>
        </div>

        {/* System Status & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Status Badge - clean, no unnecessary dots */}
          <div className="hidden sm:flex items-center px-2.5 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono-code text-zinc-700">
            <span className="font-semibold tracking-wider">SYSTEM READY</span>
          </div>

          {/* Presentation Mode Toggle */}
          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition border font-mono-code ${
              presentationMode
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700'
            }`}
            title="Toggle Presentation Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{presentationMode ? 'Presentation ON' : 'Presentation'}</span>
          </button>

          {/* Clean Run Demo Button */}
          <button
            id="run-demo-btn"
            onClick={runDemo}
            disabled={isDemoRunning}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition font-mono-code shadow-sm ${
              isDemoRunning
                ? 'bg-zinc-200 text-zinc-500 border border-zinc-300 cursor-wait'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-950 active:scale-95'
            }`}
          >
            {isDemoRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isDemoRunning ? 'Simulating...' : 'Run Demo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
