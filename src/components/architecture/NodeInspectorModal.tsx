import React, { useState } from 'react';
import { useCache } from '../../context/CacheContext';
import {
  X,
  Binary,
  Layers,
  Sliders,
  TrendingUp,
  RotateCw,
  CheckCircle2,
  XCircle,
  ArrowDown,
} from 'lucide-react';

export const NodeInspectorModal: React.FC = () => {
  const {
    selectedNode,
    setSelectedNode,
    engine,
    patternMetrics,
    optimizerDecision,
    activeSetIndex,
    activeWayIndex,
    currentDecodedAddress,
  } = useCache();

  // Decoder custom input state
  const [customAddrHex, setCustomAddrHex] = useState<string>('0x10A4');
  const [customDecoded, setCustomDecoded] = useState(() => {
    return engine.decodeAddress(0x10a4);
  });

  if (!selectedNode) return null;

  const handleCustomAddrChange = (val: string) => {
    setCustomAddrHex(val);
    const cleaned = val.startsWith('0x') || val.startsWith('0X') ? val.slice(2) : val;
    const parsed = parseInt(cleaned, 16);
    if (!isNaN(parsed)) {
      setCustomDecoded(engine.decodeAddress(parsed));
    }
  };

  const lastAccess = engine.accessHistory[0];
  const activeDecoded = currentDecodedAddress || customDecoded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono-code text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-cyan-300">
              Hardware Component Telemetry: {selectedNode.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* ================= 1. ADDRESS DECODER INSPECTOR ================= */}
          {selectedNode === 'decoder' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Binary className="w-4 h-4 text-cyan-400" />
                    Bit Partitioning & Address Decoder
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deconstructs virtual or physical memory references into hardware set indices and tag bits.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Test Address:</span>
                  <input
                    type="text"
                    value={customAddrHex}
                    onChange={e => handleCustomAddrChange(e.target.value)}
                    className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                    placeholder="0x10A4"
                  />
                </div>
              </div>

              {/* 32-bit Memory Address Display */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                  Full 32-bit Memory Address
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-100 tracking-widest break-all font-mono">
                  {customDecoded.binaryString.match(/.{1,4}/g)?.join(' ')}
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-4">
                  <span>Hex: <strong className="text-cyan-300">0x{customDecoded.address.toString(16).toUpperCase().padStart(4, '0')}</strong></span>
                  <span>Decimal: <strong className="text-slate-200">{customDecoded.address}</strong></span>
                </div>
              </div>

              {/* Splitting Diagram */}
              <div className="flex flex-col items-center">
                <ArrowDown className="w-5 h-5 text-cyan-400 animate-bounce my-1" />
                <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider mb-2">
                  Hardware Bit Field Splitting
                </div>

                {/* 3 Boxes: Tag, Index, Offset */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  {/* TAG */}
                  <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                      TAG ({customDecoded.tagBits} bits)
                    </span>
                    <div className="text-xs font-bold text-blue-200 bg-slate-950 px-2 py-1 rounded border border-blue-800/60 w-full truncate">
                      {customDecoded.tagBinary}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-300">
                      Hex: <strong className="text-blue-300">0x{customDecoded.tag.toString(16).toUpperCase()}</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Used for associative tag comparison against lines in set
                    </span>
                  </div>

                  {/* INDEX */}
                  <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
                      INDEX ({customDecoded.indexBits} bits)
                    </span>
                    <div className="text-xs font-bold text-cyan-200 bg-slate-950 px-2 py-1 rounded border border-cyan-800/60 w-full truncate">
                      {customDecoded.indexBinary}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-300">
                      Set: <strong className="text-cyan-300">0x{customDecoded.index.toString(16).toUpperCase()} (Dec: {customDecoded.index})</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Selects 1 of {engine.numSets} hardware sets directly
                    </span>
                  </div>

                  {/* OFFSET */}
                  <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
                      OFFSET ({customDecoded.offsetBits} bits)
                    </span>
                    <div className="text-xs font-bold text-purple-200 bg-slate-950 px-2 py-1 rounded border border-purple-800/60 w-full truncate">
                      {customDecoded.offsetBinary}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-300">
                      Byte: <strong className="text-purple-300">{customDecoded.offset} (in {engine.config.blockSizeBytes}B block)</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Indexes target byte within the cache data line
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. CACHE NODE INSPECTOR ================= */}
          {selectedNode === 'cache' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    L1 Data Cache Internal Organization
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {engine.config.cacheSizeBytes / 1024} KB Capacity • {engine.config.ways}-Way Set Associative • {engine.numSets} Sets
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Active Set: <span className="text-cyan-300 font-bold">0x{(activeSetIndex || 0).toString(16).toUpperCase()}</span>
                </div>
              </div>

              {/* Tag Comparison Visualization */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Parallel Tag Comparator Hardware
                </span>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-center">
                    <span className="text-slate-400 block text-[10px] uppercase">Requested Tag</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      0x{activeDecoded.tag.toString(16).toUpperCase().padStart(4, '0')}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-center">
                    <span className="text-slate-400 block text-[10px] uppercase">Stored Set Tag</span>
                    <span className="text-slate-200 font-bold text-sm">
                      {activeWayIndex !== null && engine.sets[activeSetIndex || 0]?.lines[activeWayIndex]?.valid
                        ? `0x${engine.sets[activeSetIndex || 0].lines[activeWayIndex].tag.toString(16).toUpperCase().padStart(4, '0')}`
                        : '0x----'}
                    </span>
                  </div>
                </div>

                <ArrowDown className="w-4 h-4 text-cyan-400 my-1.5" />

                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    lastAccess && (lastAccess.result === 'HIT' || lastAccess.result === 'PREFETCH_HIT')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-[0_0_15px_#10b981]'
                      : 'bg-rose-950 text-rose-300 border border-rose-500 shadow-[0_0_15px_#f43f5e]'
                  }`}
                >
                  {lastAccess && (lastAccess.result === 'HIT' || lastAccess.result === 'PREFETCH_HIT') ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>TAG MATCH ➔ CACHE HIT</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>TAG MISMATCH ➔ CACHE MISS</span>
                    </>
                  )}
                </div>
              </div>

              {/* Set & Way Table (subset preview) */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Sample Cache Lines (Set 0x00 to 0x07):
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Set</th>
                        <th className="p-2.5">Valid</th>
                        <th className="p-2.5">Tag</th>
                        <th className="p-2.5">Data Word</th>
                        <th className="p-2.5">Prefetched?</th>
                        <th className="p-2.5">Accesses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                      {engine.sets.slice(0, 8).map((set, sIdx) => {
                        const line = set.lines[0]; // Way 0 preview
                        const isCurrentSet = sIdx === (activeSetIndex || 0);
                        return (
                          <tr
                            key={sIdx}
                            className={`transition ${
                              isCurrentSet ? 'bg-cyan-950/40 text-cyan-200 font-bold' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="p-2.5 font-bold text-slate-300">
                              0x{sIdx.toString(16).toUpperCase().padStart(2, '0')}
                              {isCurrentSet && <span className="ml-1.5 text-cyan-400">◄ ACCESS</span>}
                            </td>
                            <td className="p-2.5">
                              {line.valid ? (
                                <span className="text-emerald-400">✓ VALID</span>
                              ) : (
                                <span className="text-slate-500">× EMPTY</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-300 font-mono">
                              {line.valid ? `0x${line.tag.toString(16).toUpperCase().padStart(4, '0')}` : '----'}
                            </td>
                            <td className="p-2.5 text-slate-400 font-mono">{line.valid ? line.dataHex : '--------'}</td>
                            <td className="p-2.5">
                              {line.isPrefetched ? (
                                <span className="text-purple-300 font-bold">YES</span>
                              ) : (
                                <span className="text-slate-500">NO</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-400">{line.accessCount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. ADAPTIVE CONTROLLER INSPECTOR ================= */}
          {selectedNode === 'controller' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Adaptive Controller Telemetry
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzes dynamic memory stream characteristics to steer prefetch and replacement algorithms.
                  </p>
                </div>
                <span className="px-2 py-1 bg-amber-950/70 border border-amber-500/40 rounded text-amber-300 text-xs font-bold">
                  MODE: {optimizerDecision.cacheMode}
                </span>
              </div>

              {/* Recent Access Stream */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block mb-2 uppercase">
                  Sliding History Window (Last 8 Accesses):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {engine.recentAddresses.slice(-8).map((addr, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300 font-mono"
                    >
                      0x{addr.toString(16).toUpperCase().padStart(4, '0')}
                    </div>
                  ))}
                  {engine.recentAddresses.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No access records yet. Step simulation to begin.</span>
                  )}
                </div>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-400 text-xs block mb-1">Sequentiality Metric</span>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-cyan-400 font-bold text-lg">{patternMetrics.sequentiality}%</span>
                    <span className="text-[10px] text-slate-500">Threshold: 55%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${patternMetrics.sequentiality}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-400 text-xs block mb-1">Temporal Locality</span>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-emerald-400 font-bold text-lg">{patternMetrics.temporalLocality}%</span>
                    <span className="text-[10px] text-slate-500">Threshold: 45%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${patternMetrics.temporalLocality}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-400 text-xs block mb-1">Access Randomness</span>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-rose-400 font-bold text-lg">{patternMetrics.randomness}%</span>
                    <span className="text-[10px] text-slate-500">Entropy</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${patternMetrics.randomness}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Detected Pattern & Optimization Decision */}
              <div className="bg-gradient-to-r from-cyan-950/40 to-amber-950/40 border border-amber-500/30 p-4 rounded-xl">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block mb-2">
                  Optimization Decision Applied
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>
                      Prefetch Engine:{' '}
                      <strong className="text-purple-300">{optimizerDecision.prefetch}</strong> (Distance:{' '}
                      {optimizerDecision.prefetchDistance} blocks)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>
                      Replacement Policy:{' '}
                      <strong className="text-amber-300">{optimizerDecision.replacement}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>
                      Action: <strong className="text-cyan-300">{optimizerDecision.decisionAction}</strong>
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-slate-800/60 italic">
                  "{optimizerDecision.reason}"
                </p>
              </div>
            </div>
          )}

          {/* ================= 4. PATTERN DETECTOR INSPECTOR ================= */}
          {selectedNode === 'pattern' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-blue-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Pattern Detection Decision Tree
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic branch routing based on observed spatial and temporal address correlations.
                </p>
              </div>

              {/* Branching Tree Diagram */}
              <div className="flex flex-col items-center p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-bold">
                  Memory Access Stream
                </div>
                <ArrowDown className="w-4 h-4 text-slate-600 my-1" />
                <div className="px-4 py-2 rounded-xl bg-blue-950/60 border border-blue-500/40 text-xs text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  Pattern Detection Classifier
                </div>

                {/* Branches */}
                <div className="grid grid-cols-3 gap-3 w-full mt-4">
                  {/* Branch 1: Random */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                      patternMetrics.detectedPattern === 'RANDOM'
                        ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_15px_#f43f5e]'
                        : 'bg-slate-900 border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-bold text-rose-300 uppercase mb-1">Random</span>
                    <ArrowDown className="w-3.5 h-3.5 text-rose-400 my-1" />
                    <span className="text-[10px] text-slate-300 font-bold">Normal Mode</span>
                    <span className="text-[9px] text-slate-400 mt-1">Prefetch Disabled (Zero Pollution)</span>
                  </div>

                  {/* Branch 2: Sequential */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                      patternMetrics.detectedPattern === 'SEQUENTIAL' || patternMetrics.detectedPattern === 'STRIDED'
                        ? 'bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_#06b6d4]'
                        : 'bg-slate-900 border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-bold text-cyan-300 uppercase mb-1">Sequential</span>
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-400 my-1" />
                    <span className="text-[10px] text-cyan-300 font-bold">Prefetch Mode</span>
                    <span className="text-[9px] text-slate-400 mt-1">Next-Line Lookahead (Eliminate Misses)</span>
                  </div>

                  {/* Branch 3: Temporal Reuse */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                      patternMetrics.detectedPattern === 'TEMPORAL_REUSE'
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_#10b981]'
                        : 'bg-slate-900 border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-bold text-emerald-300 uppercase mb-1">Reuse Loop</span>
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-400 my-1" />
                    <span className="text-[10px] text-emerald-300 font-bold">LFU / MRU Mode</span>
                    <span className="text-[9px] text-slate-400 mt-1">Lock Working Set (Prevent Thrashing)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. REPLACEMENT & PREFETCH INSPECTORS ================= */}
          {(selectedNode === 'replacement' || selectedNode === 'prefetch') && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  {selectedNode === 'replacement' ? 'Dynamic Replacement Engine' : 'Stream Lookahead Prefetcher'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fine-grained algorithmic control operating in hardware response cycles.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Algorithm:</span>
                  <span className="text-amber-400 font-bold">{optimizerDecision.replacement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prefetch Distance:</span>
                  <span className="text-purple-300 font-bold">{optimizerDecision.prefetchDistance} cache blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reasoning Engine:</span>
                  <span className="text-slate-200">{optimizerDecision.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. CPU & RAM NODES ================= */}
          {(selectedNode === 'cpu' || selectedNode === 'ram' || selectedNode === 'hit' || selectedNode === 'miss' || selectedNode === 'cache_update') && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-cyan-300 uppercase">
                  {selectedNode.replace('_', ' ')} Subsystem
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {selectedNode === 'cpu' && 'Executes instructions and initiates memory loads/stores at 1.8GHz. Coordinates load-to-use latencies with L1 cache hit ports.'}
                  {selectedNode === 'ram' && 'High-capacity off-chip DRAM. Incurs ~80ns memory penalty for misses. Cache prefetching mitigates these penalties.'}
                  {selectedNode === 'hit' && 'L1 cache tag matched! Data is forwarded directly into CPU registers in 1 ns without stalling processor pipelines.'}
                  {selectedNode === 'miss' && 'Cache line not found. Memory controller initiates DRAM fetch and updates replacement metadata.'}
                  {selectedNode === 'cache_update' && 'Allocates incoming memory block into the designated associative set, evicting the victim line chosen by the adaptive policy.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">Live Hardware Emulator Active</span>
          <button
            onClick={() => setSelectedNode(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
