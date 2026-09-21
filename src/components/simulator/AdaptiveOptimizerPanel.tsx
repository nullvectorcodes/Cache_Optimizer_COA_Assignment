import { useCache } from '../../context/CacheContext';
import { Sliders, Zap } from 'lucide-react';

export const AdaptiveOptimizerPanel: React.FC = () => {
  const { patternMetrics, optimizerDecision, workload } = useCache();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl font-mono-code backdrop-blur-sm">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Adaptive Optimizer Controller</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 border border-amber-500/40 text-amber-300">
            {optimizerDecision.cacheMode}
          </span>
        </div>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {/* Pattern */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Pattern
          </span>
          <span className="text-sm font-bold text-cyan-300 block">
            {patternMetrics.detectedPattern}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 block capitalize">
            Workload: {workload.replace('_', ' ')}
          </span>
        </div>

        {/* Confidence */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Confidence
          </span>
          <span className="text-sm font-bold text-emerald-400 block">
            {patternMetrics.confidence}%
          </span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${patternMetrics.confidence}%` }}
            />
          </div>
        </div>

        {/* Replacement */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Replacement
          </span>
          <span className="text-sm font-bold text-amber-300 block">
            {optimizerDecision.replacement}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 block">
            Adaptive Policy
          </span>
        </div>

        {/* Prefetch */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Prefetch
          </span>
          <span
            className={`text-sm font-bold block ${
              optimizerDecision.prefetch !== 'DISABLED' ? 'text-purple-300' : 'text-slate-400'
            }`}
          >
            {optimizerDecision.prefetch !== 'DISABLED' ? 'ENABLED' : 'DISABLED'}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 block">
            {optimizerDecision.prefetch}
          </span>
        </div>

        {/* Prefetch Distance */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Prefetch Distance
          </span>
          <span className="text-sm font-bold text-purple-400 block">
            {optimizerDecision.prefetchDistance} blocks
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 block">
            Lookahead Depth
          </span>
        </div>

        {/* Current Decision */}
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-cyan-400 block uppercase tracking-wider mb-1">
            Current Decision
          </span>
          <span className="text-xs font-bold text-white block truncate">
            {optimizerDecision.decisionAction}
          </span>
          <span className="text-[9px] text-cyan-300/80 mt-0.5 block">
            Active HW Trigger
          </span>
        </div>
      </div>

      {/* Explanatory telemetry bar */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">
            <strong className="text-amber-300 mr-1.5">Optimizer Rationale:</strong>
            {optimizerDecision.reason}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
          <span>Telemetry Window: 32 FIFO</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">Low Overhead (&lt;0.2%)</span>
        </div>
      </div>
    </div>
  );
};
