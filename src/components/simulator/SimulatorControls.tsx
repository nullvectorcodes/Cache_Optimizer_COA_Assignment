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
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm font-mono-code">
      {/* Primary Clean Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
        {/* Workload */}
        <div className="col-span-2 sm:col-span-2">
          <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase tracking-wider font-semibold">
            Workload
          </label>
          <select
            value={workload}
            onChange={e => setWorkload(e.target.value as WorkloadType)}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-950 font-bold focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs shadow-sm"
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
          <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase tracking-wider font-semibold">
            Cache Size
          </label>
          <select
            value={engine.config.cacheSizeBytes}
            onChange={e => updateConfig({ cacheSizeBytes: Number(e.target.value) })}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs shadow-sm"
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
          <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase tracking-wider font-semibold">
            Associativity
          </label>
          <select
            value={engine.config.ways}
            onChange={e => updateConfig({ ways: Number(e.target.value) })}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs shadow-sm"
          >
            <option value={1}>Direct Mapped</option>
            <option value={2}>2-Way</option>
            <option value={4}>4-Way</option>
            <option value={8}>8-Way</option>
          </select>
        </div>

        {/* Replacement */}
        <div>
          <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase tracking-wider font-semibold">
            Replacement
          </label>
          <select
            value={engine.config.replacementPolicy}
            onChange={e => updateConfig({ replacementPolicy: e.target.value as ReplacementPolicyType })}
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs shadow-sm"
          >
            <option value="Adaptive">Adaptive</option>
            <option value="LRU">LRU</option>
            <option value="LFU">LFU</option>
            <option value="FIFO">FIFO</option>
            <option value="Random">Random</option>
          </select>
        </div>

        {/* Action Buttons: [ RUN ] [ STEP ] [ RESET ] */}
        <div className="col-span-2 flex items-center gap-2">
          <button
            id="sim-run-btn"
            onClick={togglePlay}
            disabled={isDemoRunning}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition active:scale-95 disabled:opacity-50 shadow-sm ${
              isPlaying
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-950'
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
                <span>Run</span>
              </>
            )}
          </button>

          <button
            id="sim-step-access-btn"
            onClick={stepAccess}
            disabled={isPlaying || isDemoRunning}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 rounded-lg text-xs font-semibold transition active:scale-95 disabled:opacity-40 shadow-sm"
            title="Execute 1 Memory Access"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            id="sim-reset-btn"
            onClick={reset}
            className="p-2 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-300 rounded-lg text-xs transition active:scale-95 shadow-sm"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Configuration Toggle */}
      <div className="mt-4 pt-3.5 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-1.5 hover:text-zinc-950 font-medium transition"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Advanced Configuration</span>
        </button>

        <span className="text-xs text-zinc-500 font-mono">
          Hardware Simulation Ready
        </span>
      </div>

      {/* Collapsible Advanced Configuration */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-fadeIn">
          <div>
            <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase font-medium">Block Size</label>
            <select
              value={engine.config.blockSizeBytes}
              onChange={e => updateConfig({ blockSizeBytes: Number(e.target.value) })}
              className="w-full bg-white border border-zinc-300 rounded-lg p-2 text-xs text-zinc-900 font-medium focus:outline-none focus:border-zinc-950"
            >
              <option value={32}>32 Bytes</option>
              <option value={64}>64 Bytes</option>
              <option value={128}>128 Bytes</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase font-medium">Simulation Speed</label>
            <select
              value={speed}
              onChange={e => setSpeed(e.target.value as any)}
              className="w-full bg-white border border-zinc-300 rounded-lg p-2 text-xs text-zinc-900 font-medium focus:outline-none focus:border-zinc-950"
            >
              <option value="slow">Slow (1x)</option>
              <option value="normal">Normal (5x)</option>
              <option value="fast">Fast (20x)</option>
              <option value="ultra">Max Speed</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase font-medium">Hit Latency</label>
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold">
              {engine.config.hitLatencyNs} ns (L1)
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-600 block mb-1.5 uppercase font-medium">Miss Latency</label>
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold">
              {engine.config.missLatencyNs} ns (DRAM)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
