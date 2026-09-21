import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Settings, Cpu, Radio, Zap, Layers } from 'lucide-react';

export const ArchitectureSidePanel: React.FC = () => {
  const {
    engine,
    metrics,
    patternMetrics,
    optimizerDecision,
    currentStageInfo,
    activeSetIndex,
    activeWayIndex,
    stepOnce,
    stepAccess,
    isDemoRunning,
  } = useCache();

  const lastAccess = engine.accessHistory[0];
  const isHit = lastAccess ? lastAccess.result === 'HIT' || lastAccess.result === 'PREFETCH_HIT' : true;
  const isPrefetchOn = optimizerDecision.prefetch !== 'DISABLED';

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4 font-mono-code text-xs">
      {/* System Configuration Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wider uppercase text-[11px]">
            <Settings className="w-3.5 h-3.5" />
            <span>System Configuration</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            L1-DATA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Cache Size</span>
            <span className="text-slate-100 font-bold text-sm text-cyan-300">
              {engine.config.cacheSizeBytes / 1024} KB
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Block Size</span>
            <span className="text-slate-100 font-bold text-sm text-slate-200">
              {engine.config.blockSizeBytes} B
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Associativity</span>
            <span className="text-slate-100 font-bold text-sm text-blue-400">
              {engine.config.ways === 1 ? 'Direct Mapped' : `${engine.config.ways}-way Set Assoc`}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Sets Count</span>
            <span className="text-slate-100 font-bold text-sm text-slate-200">
              {engine.numSets} Sets
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Replacement</span>
            <span className="text-slate-100 font-bold text-sm text-amber-400">
              {engine.config.replacementPolicy}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Prefetch Policy</span>
            <span className="text-slate-100 font-bold text-sm text-purple-400">
              Dynamic Stream
            </span>
          </div>
          <div className="col-span-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Latency Profile</span>
              <span className="text-slate-200 font-bold">L1: {engine.config.hitLatencyNs}ns | RAM: {engine.config.missLatencyNs}ns</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Current State Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
            <Radio className="w-3.5 h-3.5" />
            <span>Current State</span>
          </div>
          <span className="text-[10px] text-slate-400">Stage {currentStageInfo.stage}/9</span>
        </div>

        <div className="space-y-2">
          {/* Cache Hit */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 text-xs">Cache Hit</span>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${
                isHit
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isHit ? '✓ HIT' : '× MISS'}
            </span>
          </div>

          {/* Prefetch status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 text-xs">Prefetch Engine</span>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                isPrefetchOn
                  ? 'bg-purple-950/70 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isPrefetchOn ? `ON (${optimizerDecision.prefetch})` : 'OFF'}
            </span>
          </div>

          {/* Pattern */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 text-xs">Pattern</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
              {patternMetrics.detectedPattern}
            </span>
          </div>

          {/* Optimizer status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 text-xs">Optimizer Status</span>
            <span className="text-xs text-amber-300 font-bold">
              Active ({optimizerDecision.cacheMode})
            </span>
          </div>

          {/* Active Set & Way */}
          {activeSetIndex !== null && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
              <span className="text-slate-400 text-xs">Accessed Location</span>
              <span className="text-xs font-bold text-slate-200">
                Set 0x{activeSetIndex.toString(16).toUpperCase().padStart(2, '0')}{' '}
                {activeWayIndex !== null ? `| Way ${activeWayIndex}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Pipeline Stepper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Execution Controls
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Step discrete clock cycles through the cache decoder, comparator, and adaptive controller.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={stepOnce}
            disabled={isDemoRunning}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-lg font-bold text-xs transition active:scale-95 disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            Step Stage
          </button>
          <button
            onClick={stepAccess}
            disabled={isDemoRunning}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 rounded-lg font-bold text-xs transition active:scale-95 disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            Next Access
          </button>
        </div>
      </div>

      {/* Live Telemetry Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-sm text-[11px] space-y-1.5">
        <div className="flex justify-between text-slate-400">
          <span>Hit Rate:</span>
          <span className="text-emerald-400 font-bold">{metrics.hitRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Miss Rate:</span>
          <span className="text-rose-400 font-bold">{metrics.missRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>AMAT:</span>
          <span className="text-cyan-300 font-bold">{metrics.amatNs.toFixed(2)} ns</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Prefetches Issued:</span>
          <span className="text-purple-300 font-bold">{metrics.prefetchesIssued}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Bus Traffic Saved:</span>
          <span className="text-amber-300 font-bold">{metrics.memoryTrafficReductionPercent}%</span>
        </div>
      </div>
    </aside>
  );
};
