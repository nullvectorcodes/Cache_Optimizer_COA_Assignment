import React from 'react';
import { useCache } from '../../context/CacheContext';
import {
  Cpu,
  Binary,
  Layers,
  CheckCircle2,
  XCircle,
  Database,
  RefreshCw,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const {
    engine,
    patternMetrics,
    optimizerDecision,
    isDemoRunning,
    demoStep,
    demoNarrative,
    activePacketColor,
    setSelectedNode,
    presentationMode,
  } = useCache();

  // Determine active highlight from demoStep or last access
  const isDemo = isDemoRunning && demoStep > 0;
  const lastRecord = engine.accessHistory[0];
  const isHit = lastRecord ? lastRecord.result === 'HIT' || lastRecord.result === 'PREFETCH_HIT' : false;

  // Active step helper
  const isNodeActive = (nodeKey: string) => {
    if (isDemo) {
      if (nodeKey === 'cpu' && (demoStep === 1 || demoStep === 8)) return true;
      if (nodeKey === 'decoder' && demoStep === 2) return true;
      if (nodeKey === 'cache' && (demoStep === 3 || demoStep === 5 || demoStep === 9)) return true;
      if (nodeKey === 'miss' && demoStep === 3) return true;
      if (nodeKey === 'memory' && demoStep === 4) return true;
      if (nodeKey === 'cache_fill' && demoStep === 5) return true;
      if (nodeKey === 'adaptive' && (demoStep === 6 || demoStep === 7)) return true;
      if (nodeKey === 'optimization' && demoStep === 7) return true;
      if (nodeKey === 'hit' && demoStep === 9) return true;
      return false;
    }
    return false;
  };

  const getBorderColor = (nodeKey: string) => {
    if (isNodeActive(nodeKey)) {
      if (activePacketColor === 'green') return 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.35)] bg-slate-900';
      if (activePacketColor === 'red') return 'border-rose-400 ring-2 ring-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.35)] bg-slate-900';
      if (activePacketColor === 'yellow') return 'border-amber-400 ring-2 ring-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.35)] bg-slate-900';
      if (activePacketColor === 'purple') return 'border-purple-400 ring-2 ring-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.35)] bg-slate-900';
      return 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] bg-slate-900';
    }
    return 'border-slate-800 bg-[#0c1220] hover:border-slate-700';
  };

  return (
    <div className={`w-full rounded-3xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl backdrop-blur-md relative font-mono-code select-none transition-all ${
      presentationMode ? 'p-6 sm:p-10' : 'p-5 sm:p-8'
    }`}>
      {/* Educational Demo Banner (Active during demo) */}
      {isDemoRunning && (
        <div className="mb-6 p-3.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${
              activePacketColor === 'green' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
              activePacketColor === 'red' ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]' :
              activePacketColor === 'yellow' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' :
              activePacketColor === 'purple' ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' :
              'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
            }`} />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {demoNarrative}
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-cyan-800">
            Step {demoStep}/9
          </span>
        </div>
      )}

      {/* Main Large Centered Architecture Flow */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* 1. CPU */}
        <div
          onClick={() => setSelectedNode('cpu')}
          className={`cursor-pointer transition-all duration-300 w-72 p-4 rounded-2xl border text-center ${getBorderColor('cpu')}`}
        >
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-sm mb-1">
            <Cpu className="w-5 h-5" />
            <span className="tracking-wider">CPU Core</span>
          </div>
          <p className="text-xs text-slate-300">
            Memory Request:{' '}
            <strong className="text-cyan-300 font-mono">
              {engine.currentPendingAddress
                ? `0x${engine.currentPendingAddress.toString(16).toUpperCase().padStart(4, '0')}`
                : '0x1000'}
            </strong>
          </p>
        </div>

        {/* Arrow ↓ */}
        <div className="flex flex-col items-center py-2">
          <div className={`w-0.5 h-4 ${isNodeActive('decoder') || (isDemo && demoStep >= 1) ? 'bg-cyan-400' : 'bg-slate-700'}`} />
          <ArrowDown className={`w-4 h-4 -my-0.5 ${isNodeActive('decoder') || (isDemo && demoStep >= 1) ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>

        {/* 2. Address Decoder */}
        <div
          onClick={() => setSelectedNode('decoder')}
          className={`cursor-pointer transition-all duration-300 w-80 p-3.5 rounded-2xl border text-center ${getBorderColor('decoder')}`}
        >
          <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-xs mb-1.5 uppercase tracking-wider">
            <Binary className="w-4 h-4" />
            <span>Address Decoder</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            <div className="p-1 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-300">
              <span className="text-[9px] text-blue-400 block font-normal">TAG</span>
              <span>20 Bits</span>
            </div>
            <div className="p-1 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-cyan-300">
              <span className="text-[9px] text-cyan-400 block font-normal">INDEX</span>
              <span>6 Bits</span>
            </div>
            <div className="p-1 rounded-lg bg-purple-950/50 border border-purple-800/40 text-purple-300">
              <span className="text-[9px] text-purple-400 block font-normal">OFFSET</span>
              <span>6 Bits</span>
            </div>
          </div>
        </div>

        {/* Arrow ↓ */}
        <div className="flex flex-col items-center py-2">
          <div className={`w-0.5 h-4 ${isNodeActive('cache') || (isDemo && demoStep >= 2) ? 'bg-cyan-400' : 'bg-slate-700'}`} />
          <ArrowDown className={`w-4 h-4 -my-0.5 ${isNodeActive('cache') || (isDemo && demoStep >= 2) ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>

        {/* 3. L1 Cache */}
        <div
          onClick={() => setSelectedNode('cache')}
          className={`cursor-pointer transition-all duration-300 w-88 p-4 rounded-2xl border text-center ${getBorderColor('cache')}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>L1 CACHE (16 KB)</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              4-Way Associative
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-4 mt-2">
            <span>Tag Store</span>
            <span>•</span>
            <span>Data Store</span>
            <span>•</span>
            <span className="text-cyan-300 font-semibold">Tag Comparator</span>
          </div>
        </div>

        {/* 4. HIT / MISS Branch */}
        <div className="w-full max-w-lg py-2">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-3 bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-8 relative px-4">
            <div className="absolute left-1/4 right-1/4 top-0 h-0.5 bg-slate-700 -mt-px" />

            {/* Left: HIT Branch */}
            <div className="flex flex-col items-center pt-2">
              <div
                onClick={() => setSelectedNode('hit')}
                className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 border ${
                  isNodeActive('hit') || (isHit && !isDemo)
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-emerald-400 hover:border-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CACHE HIT</span>
              </div>

              <div className="flex flex-col items-center py-1">
                <div className={`w-0.5 h-3 ${isNodeActive('hit') || (isHit && !isDemo) ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                <ArrowDown className={`w-3.5 h-3.5 -my-0.5 ${isNodeActive('hit') || (isHit && !isDemo) ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>

              <div
                onClick={() => setSelectedNode('cpu')}
                className="w-40 p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-center hover:border-emerald-400 transition cursor-pointer"
              >
                <span className="text-xs text-emerald-400 font-bold block uppercase">
                  Return Data → CPU
                </span>
                <span className="text-[10px] text-slate-400">Fast 1 ns Access</span>
              </div>
            </div>

            {/* Right: MISS Branch */}
            <div className="flex flex-col items-center pt-2">
              <div
                onClick={() => setSelectedNode('miss')}
                className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 border ${
                  isNodeActive('miss') || (!isHit && !isDemo && engine.metrics.totalAccesses > 0)
                    ? 'bg-rose-950 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-rose-400 hover:border-rose-700'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>CACHE MISS</span>
              </div>

              <div className="flex flex-col items-center py-1">
                <div className={`w-0.5 h-3 ${isNodeActive('memory') ? 'bg-rose-400' : 'bg-slate-700'}`} />
                <ArrowDown className={`w-3.5 h-3.5 -my-0.5 ${isNodeActive('memory') ? 'text-rose-400' : 'text-slate-600'}`} />
              </div>

              {/* Main Memory */}
              <div
                onClick={() => setSelectedNode('ram')}
                className={`w-40 p-2.5 rounded-xl border text-center transition cursor-pointer ${getBorderColor('memory')}`}
              >
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-xs mb-0.5">
                  <Database className="w-4 h-4" />
                  <span>Main Memory</span>
                </div>
                <span className="text-[10px] text-slate-400">80 ns DRAM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Cache Fill */}
        <div className="flex flex-col items-center py-1">
          <div className={`w-0.5 h-3.5 ${isNodeActive('cache_fill') ? 'bg-cyan-400' : 'bg-slate-700'}`} />
          <ArrowDown className={`w-3.5 h-3.5 -my-0.5 ${isNodeActive('cache_fill') ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>

        <div
          onClick={() => setSelectedNode('cache_update')}
          className={`cursor-pointer transition-all duration-300 w-72 p-2.5 rounded-xl border text-center text-xs ${getBorderColor('cache_fill')}`}
        >
          <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cache Fill & Line Update</span>
          </div>
        </div>

        {/* Arrow ↓ to Adaptive Engine */}
        <div className="flex flex-col items-center py-2">
          <div className={`w-0.5 h-4 ${isNodeActive('adaptive') ? 'bg-amber-400' : 'bg-slate-700'}`} />
          <ArrowDown className={`w-4 h-4 -my-0.5 ${isNodeActive('adaptive') ? 'text-amber-400' : 'text-slate-600'}`} />
        </div>

        {/* ========================================================
            6. ADAPTIVE ENGINE — THE STAR OF THE PROJECT
           ======================================================== */}
        <div
          onClick={() => setSelectedNode('controller')}
          className={`cursor-pointer transition-all duration-300 w-full max-w-xl p-5 sm:p-6 rounded-3xl border text-left shadow-xl ${
            isNodeActive('adaptive')
              ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.35)] bg-slate-900/95'
              : 'border-amber-500/40 bg-gradient-to-b from-[#111726] to-[#0c1220] hover:border-amber-400/70'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Adaptive Engine</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
              Active Mode: {optimizerDecision.cacheMode}
            </span>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Detected Pattern</span>
              <span className="text-base font-bold text-cyan-300">{patternMetrics.detectedPattern}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Confidence Score</span>
              <span className="text-base font-bold text-emerald-400">{patternMetrics.confidence}%</span>
            </div>
          </div>

          {/* Pattern Decision Logic Flow */}
          <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2">
              Workload Classification Logic:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 rounded-lg border transition ${
                patternMetrics.detectedPattern === 'SEQUENTIAL' || patternMetrics.detectedPattern === 'STRIDED'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span>Sequential</span>
                <span className="block text-[9px] font-normal text-cyan-400 mt-0.5">Prefetch Mode</span>
              </div>
              <div className={`p-2 rounded-lg border transition ${
                patternMetrics.detectedPattern === 'RANDOM'
                  ? 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span>Random</span>
                <span className="block text-[9px] font-normal text-rose-400 mt-0.5">No Pollution</span>
              </div>
              <div className={`p-2 rounded-lg border transition ${
                patternMetrics.detectedPattern === 'TEMPORAL_REUSE'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span>Reuse Loop</span>
                <span className="block text-[9px] font-normal text-emerald-400 mt-0.5">Protect LFU</span>
              </div>
            </div>
          </div>

          {/* Active Decisions Checklist */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Prefetch: <strong className="text-purple-300">{optimizerDecision.prefetch}</strong> (Dist: {optimizerDecision.prefetchDistance} blocks)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Replacement: <strong className="text-amber-300">{optimizerDecision.replacement}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Current Action: <strong className="text-cyan-300">{optimizerDecision.decisionAction}</strong></span>
            </div>
          </div>
        </div>

        {/* 7. Optimization Feedback Loop -> Cache */}
        <div className="flex flex-col items-center py-2">
          <div className={`w-0.5 h-4 ${isNodeActive('optimization') ? 'bg-purple-400' : 'bg-slate-700'}`} />
          <ArrowDown className={`w-4 h-4 -my-0.5 ${isNodeActive('optimization') ? 'text-purple-400' : 'text-slate-600'}`} />
        </div>

        <div className="w-full max-w-md p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/40 text-center text-xs text-purple-300 shadow-md">
          <span className="font-bold text-white block mb-0.5">OPTIMIZATION APPLIED</span>
          <span>Dynamically reconfigures Cache Prefetcher & Replacement Policy</span>
        </div>
      </div>
    </div>
  );
};
