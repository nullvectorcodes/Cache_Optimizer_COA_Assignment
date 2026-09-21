import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Target, Zap, Shield, Database } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const { metrics, baselineMetrics } = useCache();

  const hitGain = Number((metrics.hitRate - baselineMetrics.hitRate).toFixed(1));
  const amatReduction =
    baselineMetrics.amatNs > 0
      ? Math.max(0, Math.round(((baselineMetrics.amatNs - metrics.amatNs) / baselineMetrics.amatNs) * 100))
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono-code">
      {/* 1. HIT RATE */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1 text-slate-400">
          <span className="text-[10px] uppercase tracking-wider font-bold">Cache Hit Rate</span>
          <Target className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-400">
          {metrics.hitRate.toFixed(1)}%
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Baseline LRU: {baselineMetrics.hitRate.toFixed(1)}%</span>
          {hitGain > 0 && (
            <span className="text-emerald-400 font-semibold">+{hitGain}%</span>
          )}
        </div>
      </div>

      {/* 2. AMAT LATENCY */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1 text-slate-400">
          <span className="text-[10px] uppercase tracking-wider font-bold">Avg Latency (AMAT)</span>
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold text-cyan-300">
          {metrics.amatNs.toFixed(2)}{' '}
          <span className="text-xs font-normal text-cyan-400/70">ns</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Baseline: {baselineMetrics.amatNs.toFixed(1)} ns</span>
          {amatReduction > 0 && (
            <span className="text-cyan-400 font-semibold">-{amatReduction}%</span>
          )}
        </div>
      </div>

      {/* 3. MEMORY TRAFFIC SAVED */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1 text-slate-400">
          <span className="text-[10px] uppercase tracking-wider font-bold">Bus Traffic Saved</span>
          <Shield className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-amber-400">
          {metrics.memoryTrafficReductionPercent}%
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>Bytes Saved:</span>
          <span className="text-amber-300 font-semibold">
            {(metrics.memoryTrafficSavedBytes / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>

      {/* 4. TRANSACTIONS & HITS/MISSES */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1 text-slate-400">
          <span className="text-[10px] uppercase tracking-wider font-bold">Total Accesses</span>
          <Database className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-100">
          {metrics.totalAccesses.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span className="text-emerald-400">{metrics.hits} Hits</span>
          <span className="text-slate-600">/</span>
          <span className="text-rose-400">{metrics.misses} Misses</span>
          <span className="text-slate-600">/</span>
          <span className="text-purple-300">{metrics.prefetchHits} PF</span>
        </div>
      </div>
    </div>
  );
};
