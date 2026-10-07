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
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm font-mono-code">
      {/* Simple Progress Indicator: CPU → CACHE → MEMORY → ADAPTIVE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold uppercase tracking-wider">
          <span className="px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900">
            CPU
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900">
            CACHE
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900">
            MEMORY
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="px-3 py-1 rounded-md bg-zinc-900 text-white font-bold">
            ADAPTIVE
          </span>
        </div>

        <span className="text-xs text-zinc-500">
          Transactions Logged: <strong className="text-zinc-950 font-bold">{engine.metrics.totalAccesses}</strong>
        </span>
      </div>

      {/* Operation Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Current Operation */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase text-zinc-500 font-semibold block mb-1">
              Current Operation
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Address:</span>
              <span className="font-bold text-zinc-950 text-sm">{currentAddr}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase text-zinc-500 font-semibold block mb-1">
              Result
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-xs ${
                isHit
                  ? 'bg-zinc-900 text-white border border-zinc-900'
                  : 'bg-white text-zinc-800 border border-zinc-300'
              }`}
            >
              {isHit ? <CheckCircle2 className="w-3.5 h-3.5 text-zinc-200" /> : <XCircle className="w-3.5 h-3.5 text-zinc-600" />}
              {isPrefetchHit ? 'PREFETCH HIT' : isHit ? 'CACHE HIT' : 'CACHE MISS'}
            </span>
          </div>
        </div>

        {/* Next / Adaptive Action */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase text-zinc-500 font-semibold block mb-1">
              Next Lookahead Address
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Address:</span>
              <span className="font-bold text-zinc-950 text-sm">{nextAddr}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase text-zinc-500 font-semibold block mb-1">
              Controller Action
            </span>
            <span className="text-zinc-950 font-bold text-xs px-2.5 py-1 rounded-md bg-zinc-200/80 border border-zinc-300 inline-block">
              {optimizerDecision.prefetch !== 'DISABLED' ? 'PREFETCH NEXT' : 'NORMAL LOOKUP'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
