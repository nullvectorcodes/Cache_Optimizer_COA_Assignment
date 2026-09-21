import React from 'react';
import { useCache } from '../../context/CacheContext';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const CompactStepStatus: React.FC = () => {
  const { engine, optimizerDecision } = useCache();

  const history = engine.accessHistory;
  const current = history[0];

  const currentAddr = current ? current.addressHex : '0x1000';
  const isHit = current ? current.result === 'HIT' || current.result === 'PREFETCH_HIT' : true;
  const isPrefetchHit = current ? current.result === 'PREFETCH_HIT' : false;

  // Next predicted address based on adaptive prefetcher
  const nextAddr = optimizerDecision.prefetch !== 'DISABLED' && engine.currentPendingAddress
    ? `0x${(engine.currentPendingAddress + engine.config.blockSizeBytes).toString(16).toUpperCase().padStart(4, '0')}`
    : current
    ? `0x${(current.address + engine.config.blockSizeBytes).toString(16).toUpperCase().padStart(4, '0')}`
    : '0x1040';

  return (
    <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-5 shadow-lg font-mono-code backdrop-blur-sm">
      {/* Simple Progress Indicator: CPU → CACHE → MEMORY → ADAPTIVE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            CPU
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            CACHE
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
            MEMORY
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300">
            ADAPTIVE
          </span>
        </div>

        <span className="text-[10px] text-slate-400">
          Transactions Logged: <strong className="text-white">{engine.metrics.totalAccesses}</strong>
        </span>
      </div>

      {/* Operation Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Current Operation */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
              Current Operation
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Address:</span>
              <span className="font-bold text-white text-sm">{currentAddr}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
              Result
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs ${
                isHit
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isHit ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isPrefetchHit ? 'PREFETCH HIT' : isHit ? 'CACHE HIT' : 'CACHE MISS'}
            </span>
          </div>
        </div>

        {/* Next / Adaptive Action */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
              Next Lookahead Address
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Address:</span>
              <span className="font-bold text-cyan-300 text-sm">{nextAddr}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
              Controller Action
            </span>
            <span className="text-amber-300 font-bold text-xs">
              {optimizerDecision.prefetch !== 'DISABLED' ? 'PREFETCH NEXT' : 'NORMAL LOOKUP'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
