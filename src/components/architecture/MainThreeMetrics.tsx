import React, { useState } from 'react';
import { useCache } from '../../context/CacheContext';
import { Target, Activity, Zap, SlidersHorizontal, X } from 'lucide-react';

export const MainThreeMetrics: React.FC = () => {
  const { metrics, baselineMetrics, engine } = useCache();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <>
      {/* 3 Main Executive Metrics Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-1 w-full">
          {/* 1. HIT RATE */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hit Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">
              {metrics.hitRate.toFixed(1)}%
            </div>
          </div>

          {/* 2. MISS RATE */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Miss Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-400">
              {metrics.missRate.toFixed(1)}%
            </div>
          </div>

          {/* 3. AMAT */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>AMAT</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-300">
              {metrics.amatNs.toFixed(1)} <span className="text-xs font-normal text-cyan-400/80">ns</span>
            </div>
          </div>
        </div>

        {/* Optional Advanced Details Drawer Button */}
        <button
          onClick={() => setShowAdvanced(true)}
          className="shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold transition"
          title="Inspect Deep Hardware Details"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Advanced Details</span>
        </button>
      </div>

      {/* Advanced Details Modal (Keeps full logic accessible without cluttering presentation) */}
      {showAdvanced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-mono-code">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Advanced Hardware & Telemetry Details
              </h3>
              <button
                onClick={() => setShowAdvanced(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* System Geometry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Cache Size</span>
                <span className="font-bold text-cyan-300">{engine.config.cacheSizeBytes / 1024} KB</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Block Size</span>
                <span className="font-bold text-slate-200">{engine.config.blockSizeBytes} Bytes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Associativity</span>
                <span className="font-bold text-blue-400">{engine.config.ways}-Way</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Total Sets</span>
                <span className="font-bold text-slate-200">{engine.numSets} Sets</span>
              </div>
            </div>

            {/* Counters */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Accesses:</span>
                <span className="font-bold text-white">{metrics.totalAccesses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cache Hits:</span>
                <span className="font-bold text-emerald-400">{metrics.hits} (Prefetch Hits: {metrics.prefetchHits})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cache Misses:</span>
                <span className="font-bold text-rose-400">{metrics.misses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fixed Baseline AMAT:</span>
                <span className="font-bold text-slate-300">{baselineMetrics.amatNs.toFixed(2)} ns</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memory Traffic Saved:</span>
                <span className="font-bold text-amber-400">{metrics.memoryTrafficReductionPercent}% ({(metrics.memoryTrafficSavedBytes / 1024).toFixed(1)} KB)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
