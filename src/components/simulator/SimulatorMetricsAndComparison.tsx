import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Target, Activity, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';

export const SimulatorMetricsAndComparison: React.FC = () => {
  const { metrics, baselineMetrics } = useCache();

  const hitGain = metrics.hitRate - baselineMetrics.hitRate;
  const speedup = metrics.amatNs > 0 && baselineMetrics.amatNs > 0
    ? (baselineMetrics.amatNs / metrics.amatNs)
    : 1.0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono-code">
      {/* 3 Main Live Metrics Cards (5 columns on desktop) */}
      <div className="lg:col-span-5 grid grid-cols-3 gap-3">
        {/* HIT RATE */}
        <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] uppercase font-semibold tracking-wider">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hit Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight my-1">
            {metrics.hitRate.toFixed(1)}%
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>{hitGain >= 0 ? `+${hitGain.toFixed(1)}%` : `${hitGain.toFixed(1)}%`}</span>
          </div>
        </div>

        {/* MISS RATE */}
        <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] uppercase font-semibold tracking-wider">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Miss Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 tracking-tight my-1">
            {metrics.missRate.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">DRAM Bus Misses</span>
        </div>

        {/* AMAT */}
        <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] uppercase font-semibold tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AMAT</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight my-1">
            {metrics.amatNs.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1">ns</span>
          </div>
          <span className="text-[10px] text-slate-500">Avg Access Latency</span>
        </div>
      </div>

      {/* Clean Comparison Card: FIXED CACHE vs ADAPTIVE CACHE (7 columns on desktop) */}
      <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Fixed Baseline vs Adaptive Model
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
            {speedup.toFixed(2)}x Speedup
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-800/80">
                <th className="pb-2 font-semibold">Architectural Metric</th>
                <th className="pb-2 font-semibold text-center text-slate-400">Fixed LRU Baseline</th>
                <th className="pb-2 font-bold text-center text-cyan-300">Adaptive Cache</th>
                <th className="pb-2 font-bold text-right text-emerald-400">Efficiency Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr>
                <td className="py-2 text-slate-300 font-medium">Hit Rate</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.hitRate.toFixed(1)}%</td>
                <td className="py-2 text-center text-cyan-300 font-bold">{metrics.hitRate.toFixed(1)}%</td>
                <td className="py-2 text-right text-emerald-400 font-bold">
                  {hitGain >= 0 ? `+${hitGain.toFixed(1)}%` : `${hitGain.toFixed(1)}%`}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300 font-medium">Miss Rate</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.missRate.toFixed(1)}%</td>
                <td className="py-2 text-center text-rose-300 font-bold">{metrics.missRate.toFixed(1)}%</td>
                <td className="py-2 text-right text-emerald-400 font-bold">
                  {(baselineMetrics.missRate - metrics.missRate) >= 0 ? `-${(baselineMetrics.missRate - metrics.missRate).toFixed(1)}%` : `+${(metrics.missRate - baselineMetrics.missRate).toFixed(1)}%`}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300 font-medium">AMAT Latency</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.amatNs.toFixed(1)} ns</td>
                <td className="py-2 text-center text-amber-300 font-bold">{metrics.amatNs.toFixed(1)} ns</td>
                <td className="py-2 text-right text-cyan-300 font-bold">
                  {speedup.toFixed(2)}x faster
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

