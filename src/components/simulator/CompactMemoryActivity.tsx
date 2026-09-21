import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Activity } from 'lucide-react';

export const CompactMemoryActivity: React.FC = () => {
  const { recentAccesses } = useCache();

  // Show only most recent 6 operations as requested
  const items = recentAccesses.slice(0, 6);

  return (
    <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-5 shadow-lg font-mono-code backdrop-blur-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Memory Activity</span>
        </div>
        <span className="text-[10px] text-slate-500">Recent Transactions</span>
      </div>

      {/* 5-8 Recent Operations List */}
      <div className="space-y-1.5 flex-1">
        {items.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs text-slate-500 italic">
            Press "Step" or "Run" to view memory activity.
          </div>
        ) : (
          items.map((item, idx) => {
            const isHit = item.result === 'HIT' || item.result === 'PREFETCH_HIT';
            const isPrefetch = item.result === 'PREFETCH_HIT';

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                  idx === 0
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${
                      isPrefetch
                        ? 'text-purple-400'
                        : isHit
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {isPrefetch ? '⚡' : isHit ? '✓' : '✕'}
                  </span>
                  <span className="font-mono font-semibold text-slate-200">{item.addressHex}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isPrefetch
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                        : isHit
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {isPrefetch ? 'PREFETCH HIT' : item.result}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Hardware Bus Status: Online</span>
        <span className="text-cyan-400">Buffered History</span>
      </div>
    </div>
  );
};
