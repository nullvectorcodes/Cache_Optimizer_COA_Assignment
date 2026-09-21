import { useCache } from '../../context/CacheContext';
import { Terminal, CheckCircle2, XCircle } from 'lucide-react';

export const LiveAccessStream: React.FC = () => {
  const { recentAccesses } = useCache();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono-code backdrop-blur-sm flex flex-col h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Live Memory Access Stream</span>
        </div>
        <div className="text-[10px] text-slate-400">
          <span>Buffered: {recentAccesses.length}</span>
        </div>
      </div>

      {/* Stream Terminal Window */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs select-text">
        {recentAccesses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic">
            <span>No memory transactions recorded yet.</span>
            <span className="text-[10px] mt-1">Press "STEP" or "RUN" above to begin dispatching memory requests.</span>
          </div>
        ) : (
          recentAccesses.slice(0, 50).map((record, index) => {
            const isLatest = index === 0;
            const isHit = record.result === 'HIT' || record.result === 'PREFETCH_HIT';
            const isPrefetchHit = record.result === 'PREFETCH_HIT';

            return (
              <div
                key={record.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                  isLatest
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {/* ID & Address */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-bold text-[10px]">
                    #{String(record.id).padStart(4, '0')}
                  </span>
                  <span className="font-bold text-cyan-300">
                    {record.addressHex}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Set: 0x{record.setIndex.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {record.isPrefetch && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                      PREFETCH
                    </span>
                  )}

                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isHit
                        ? isPrefetchHit
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {isHit ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isPrefetchHit ? 'PREFETCH HIT' : 'HIT'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>MISS</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Latency: Hit = 1ns • Miss = 80ns</span>
        <span className="text-cyan-400">Target Line: 64 Bytes</span>
      </div>
    </div>
  );
};
