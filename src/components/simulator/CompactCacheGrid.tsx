import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Layers } from 'lucide-react';

export const CompactCacheGrid: React.FC = () => {
  const { engine, activeSetIndex, activeWayIndex } = useCache();

  const ways = engine.config.ways; // 1, 2, 4, or 8
  const displayedSets = Math.min(8, engine.sets.length);

  // Calculate actual cache occupancy
  let totalLines = 0;
  let validLines = 0;
  engine.sets.forEach(set => {
    set.lines.forEach(line => {
      totalLines++;
      if (line.valid) validLines++;
    });
  });
  const occupancyPercent = totalLines > 0 ? Math.round((validLines / totalLines) * 100) : 0;

  return (
    <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-5 shadow-lg font-mono-code backdrop-blur-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Cache Memory Blocks</span>
        </div>
        <div className="text-xs text-slate-300">
          Occupancy: <strong className="text-cyan-300">{occupancyPercent}%</strong>
        </div>
      </div>

      {/* Visual Compact Grid (Rows = Sets, Cols = Ways) */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${ways}, minmax(0, 1fr))` }}>
          {engine.sets.slice(0, displayedSets).map((set, sIdx) =>
            set.lines.map((line, wIdx) => {
              const isAccessed = sIdx === (activeSetIndex ?? -1) && wIdx === (activeWayIndex ?? -1);

              return (
                <div
                  key={`${sIdx}-${wIdx}`}
                  className={`h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isAccessed
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-105'
                      : line.valid
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-700'
                  }`}
                  title={`Set 0x${sIdx.toString(16).toUpperCase()} Way ${wIdx}: ${line.valid ? `Valid (Tag 0x${line.tag.toString(16).toUpperCase()})` : 'Empty'}`}
                >
                  {line.valid ? '✓' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Occupancy Summary Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Valid Block</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span>Empty</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Accessed</span>
          </span>
        </div>
        <span className="text-[10px] text-slate-500">
          Showing Sample Sets (4-Way)
        </span>
      </div>
    </div>
  );
};
