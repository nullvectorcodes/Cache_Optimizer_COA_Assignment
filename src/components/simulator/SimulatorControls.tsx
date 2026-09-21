import React, { useState } from 'react';
import { useCache } from '../../context/CacheContext';
import type { ReplacementPolicyType, WorkloadType } from '../../engine/types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const SimulatorControls: React.FC = () => {
  const {
    engine,
    isPlaying,
    togglePlay,
    stepAccess,
    reset,
    speed,
    setSpeed,
    workload,
    setWorkload,
    updateConfig,
    isDemoRunning,
  } = useCache();

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-5 shadow-xl font-mono-code backdrop-blur-md">
      {/* Primary Clean Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
        {/* Workload */}
        <div className="col-span-2 sm:col-span-2">
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-bold">
            Workload
          </label>
          <select
            value={workload}
            onChange={e => setWorkload(e.target.value as WorkloadType)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 text-xs"
          >
            <option value="sequential">Sequential</option>
            <option value="random">Random</option>
            <option value="stride">Stride (256B)</option>
            <option value="loop_reuse">Reuse Loop</option>
            <option value="mixed">Mixed Benchmark</option>
          </select>
        </div>

        {/* Cache Size */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-bold">
            Cache Size
          </label>
          <select
            value={engine.config.cacheSizeBytes}
            onChange={e => updateConfig({ cacheSizeBytes: Number(e.target.value) })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-cyan-400 text-xs"
          >
            <option value={4096}>4 KB</option>
            <option value={8192}>8 KB</option>
            <option value={16384}>16 KB</option>
            <option value={32768}>32 KB</option>
            <option value={65536}>64 KB</option>
          </select>
        </div>

        {/* Associativity */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-bold">
            Associativity
          </label>
          <select
            value={engine.config.ways}
            onChange={e => updateConfig({ ways: Number(e.target.value) })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-cyan-400 text-xs"
          >
            <option value={1}>Direct Mapped</option>
            <option value={2}>2-Way</option>
            <option value={4}>4-Way</option>
            <option value={8}>8-Way</option>
          </select>
        </div>

        {/* Replacement */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-bold">
            Replacement
          </label>
          <select
            value={engine.config.replacementPolicy}
            onChange={e => updateConfig({ replacementPolicy: e.target.value as ReplacementPolicyType })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-semibold focus:outline-none focus:border-cyan-400 text-xs"
          >
            <option value="Adaptive">Adaptive</option>
            <option value="LRU">LRU</option>
            <option value="LFU">LFU</option>
            <option value="FIFO">FIFO</option>
            <option value="Random">Random</option>
          </select>
        </div>

        {/* Action Buttons: [ ▶ RUN ] [ STEP ] [ RESET ] */}
        <div className="col-span-2 flex items-center gap-2">
          <button
            id="sim-run-btn"
            onClick={togglePlay}
            disabled={isDemoRunning}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold tracking-wider uppercase transition active:scale-95 disabled:opacity-50 ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶ Run</span>
              </>
            )}
          </button>

          <button
            id="sim-step-access-btn"
            onClick={stepAccess}
            disabled={isPlaying || isDemoRunning}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-40"
            title="Execute 1 Memory Access"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            id="sim-reset-btn"
            onClick={reset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl text-xs transition active:scale-95"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Configuration Toggle */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-1.5 hover:text-cyan-300 transition"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Advanced Configuration</span>
        </button>

        <span className="text-[10px] text-slate-500">
          Hardware Simulation Ready
        </span>
      </div>

      {/* Collapsible Advanced Configuration */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase">Block Size</label>
            <select
              value={engine.config.blockSizeBytes}
              onChange={e => updateConfig({ blockSizeBytes: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
            >
              <option value={32}>32 Bytes</option>
              <option value={64}>64 Bytes</option>
              <option value={128}>128 Bytes</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase">Simulation Speed</label>
            <select
              value={speed}
              onChange={e => setSpeed(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
            >
              <option value="slow">Slow (1x)</option>
              <option value="normal">Normal (5x)</option>
              <option value="fast">Fast (20x)</option>
              <option value="ultra">Max Speed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase">Hit Latency</label>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs">
              {engine.config.hitLatencyNs} ns (L1)
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase">Miss Latency</label>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs">
              {engine.config.missLatencyNs} ns (DRAM)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
