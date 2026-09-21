import React from 'react';
import { useCache } from '../../context/CacheContext';
import { STAGES } from '../../engine/CacheEngine';
import { Layers, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const StepStagePipeline: React.FC = () => {
  const {
    currentStageInfo,
    engine,
    optimizerDecision,
    stepOnce,
    isPlaying,
  } = useCache();

  const currentStageNum = currentStageInfo.stage;
  const lastRecord = engine.accessHistory[0];
  const pendingAddr = engine.currentPendingAddress;
  const addrHex = pendingAddr
    ? `0x${pendingAddr.toString(16).toUpperCase().padStart(4, '0')}`
    : lastRecord
    ? lastRecord.addressHex
    : '0x1000';

  const isHit = lastRecord ? lastRecord.result === 'HIT' || lastRecord.result === 'PREFETCH_HIT' : false;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-lg font-mono-code backdrop-blur-sm space-y-4">
      {/* Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Hardware Execution Pipeline
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            Stage {currentStageNum} of 9
          </span>
        </div>

        {/* Current Operation Summary */}
        <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase">Addr:</span>
            <span className="text-cyan-300 font-bold">{addrHex}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase">Result:</span>
            {lastRecord ? (
              <span
                className={`font-bold flex items-center gap-1 ${
                  isHit ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isHit ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {lastRecord.result}
              </span>
            ) : (
              <span className="text-slate-400">WAITING</span>
            )}
          </div>
        </div>
      </div>

      {/* Modern 9-Segment Progress Track */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-9 gap-1.5">
          {STAGES.map(s => {
            const isActive = s.stage === currentStageNum;
            const isPassed = s.stage < currentStageNum;

            return (
              <div
                key={s.stage}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    : isPassed
                    ? 'bg-slate-700'
                    : 'bg-slate-800/60'
                }`}
                title={s.title}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
          <span>1. CPU Fetch</span>
          <span className="hidden sm:inline">3. Set Select</span>
          <span>5. Hit / Miss</span>
          <span className="hidden sm:inline">7. Cache Fill</span>
          <span>9. Optimize</span>
        </div>
      </div>

      {/* Active Stage Detail & Step Button */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-300 text-sm">
              {currentStageInfo.title}
            </span>
            <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {currentStageInfo.activeComponent}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl">
            {currentStageInfo.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-slate-500 uppercase block">Adaptive Action</span>
            <span className="text-amber-300 font-bold text-xs truncate max-w-[180px] block">
              {optimizerDecision.decisionAction}
            </span>
          </div>

          {!isPlaying && (
            <button
              onClick={stepOnce}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
            >
              <span>Step Stage</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
