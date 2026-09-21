import React, { useState } from 'react';
import { useCache } from '../../context/CacheContext';
import { Layers, Search, Circle } from 'lucide-react';

export const LiveCacheGrid: React.FC = () => {
  const { engine, activeSetIndex, activeWayIndex } = useCache();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const ways = engine.config.ways;
  const pageSize = 12;
  const totalSets = engine.sets.length;

  // Filter sets by search term if provided
  const filteredSetIndices = engine.sets
    .map((_, idx) => idx)
    .filter(idx => {
      if (!searchTerm) return true;
      const hex = idx.toString(16).toUpperCase().padStart(2, '0');
      const dec = idx.toString();
      return hex.includes(searchTerm.toUpperCase()) || dec.includes(searchTerm);
    });

  const totalPages = Math.ceil(filteredSetIndices.length / pageSize);
  const currentSetIndices = filteredSetIndices.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono-code backdrop-blur-sm flex flex-col h-[380px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Live Cache State Table ({totalSets} Sets × {ways} Ways)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search set */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Set (e.g. 0A)..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="px-2.5 py-1 pl-7 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36 sm:w-44"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-40"
            >
              ◄
            </button>
            <span>
              {page + 1} / {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-40"
            >
              ►
            </button>
          </div>
        </div>
      </div>

      {/* Cache Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="p-2 w-16 text-cyan-300">SET</th>
              {Array.from({ length: ways }).map((_, wIdx) => (
                <th key={wIdx} className="p-2">
                  WAY {wIdx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-slate-950/40 font-mono text-[11px]">
            {currentSetIndices.map(setIdx => {
              const set = engine.sets[setIdx];
              const isSetAccessed = setIdx === activeSetIndex;

              return (
                <tr
                  key={setIdx}
                  className={`transition-colors ${
                    isSetAccessed ? 'bg-cyan-950/50' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="p-2 font-bold text-slate-300">
                    <span className="text-cyan-400">
                      0x{setIdx.toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                  </td>

                  {set.lines.map((line, wIdx) => {
                    const isLineAccessed = isSetAccessed && wIdx === activeWayIndex;

                    return (
                      <td
                        key={wIdx}
                        className={`p-2 transition-all duration-300 ${
                          isLineAccessed
                            ? 'bg-cyan-500/20 text-cyan-200 border-y border-cyan-400/60 font-bold shadow-[inset_0_0_10px_rgba(6,182,212,0.3)]'
                            : ''
                        }`}
                      >
                        {line.valid ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-400 font-bold text-[10px]">VALID</span>
                              <span className="text-slate-300 text-[10px]">
                                [0x{line.tag.toString(16).toUpperCase().padStart(4, '0')}]
                              </span>
                              {line.isPrefetched && (
                                <span className="text-[9px] px-1 bg-purple-950/80 text-purple-300 rounded border border-purple-500/30">
                                  PF
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-400">
                              Data: {line.dataHex}
                            </span>
                          </div>
                        ) : (
                          <div className="text-slate-500 flex items-center gap-1">
                            <Circle className="w-2.5 h-2.5 text-slate-700" />
                            <span className="text-[10px]">EMPTY</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Active Replacement Policy: {engine.config.replacementPolicy}</span>
        <span className="text-cyan-400">
          Showing sets {page * pageSize} to {Math.min(totalSets, (page + 1) * pageSize) - 1}
        </span>
      </div>
    </div>
  );
};
