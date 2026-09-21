import React from 'react';
import { useCache } from '../../context/CacheContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const DemoCompleteOverlay: React.FC = () => {
  const {
    demoCompleted,
    dismissDemoSummary,
    demoStats,
    setTab,
  } = useCache();

  if (!demoCompleted || !demoStats) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-mono-code">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-center text-slate-100">
        {/* Glow halo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <CheckCircle2 className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-widest text-white uppercase mb-1">
          Optimization Complete
        </h3>
        <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
          The Adaptive Cache Controller analyzed the memory access stream, eliminated cold misses via dynamic prefetching, and maximized throughput.
        </p>

        {/* Metric Deltas Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Hit Rate Gain */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              Cache Hit Rate
            </span>
            <span className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-0.5">
              +{demoStats.hitRateGain}%
            </span>
            <span className="text-[9px] text-emerald-500/80 block mt-0.5">vs Baseline</span>
          </div>

          {/* AMAT Reduction */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              AMAT Latency
            </span>
            <span className="text-xl font-bold text-cyan-400 flex items-center justify-center gap-0.5">
              -{demoStats.amatReduction}%
            </span>
            <span className="text-[9px] text-cyan-500/80 block mt-0.5">Faster Memory</span>
          </div>

          {/* Memory Traffic Reduction */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              Memory Traffic
            </span>
            <span className="text-xl font-bold text-amber-400 flex items-center justify-center gap-0.5">
              -{demoStats.trafficReduction}%
            </span>
            <span className="text-[9px] text-amber-500/80 block mt-0.5">Bus Bandwidth</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              dismissDemoSummary();
              setTab('simulator');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
          >
            <span>Explore Simulator Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={dismissDemoSummary}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition"
          >
            Back to Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
