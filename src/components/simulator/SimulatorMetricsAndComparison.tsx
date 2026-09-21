import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Target, Activity, Zap, TrendingUp } from 'lucide-react';

export const SimulatorMetricsAndComparison: React.FC = () => {
  const { metrics, baselineMetrics } = useCache();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono-code">
      {/* 3 Main Live Metrics Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* HIT RATE */}
        <div className="p-4 rounded-3xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hit Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
            {metrics.hitRate.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Adaptive Mode</span>
        </div>

        {/* MISS RATE */}
        <div className="p-4 rounded-3xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Miss Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400">
            {metrics.missRate.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500 mt-1">DRAM Misses</span>
        </div>

        {/* AMAT */}
        <div className="p-4 rounded-3xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>AMAT</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300">
            {metrics.amatNs.toFixed(1)}{' '}
            <span className="text-xs font-normal text-cyan-400/80">ns</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Avg Memory Latency</span>
        </div>
      </div>

      {/* Clean Comparison Card: FIXED CACHE vs ADAPTIVE CACHE */}
      <div className="p-5 rounded-3xl bg-[#0b101c] border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Fixed Cache vs Adaptive Cache
          </span>
          <span className="text-[10px] text-slate-500">Live Empirical Comparison</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-800/80">
                <th className="pb-1.5 font-normal">Metric</th>
                <th className="pb-1.5 font-normal text-center text-slate-400">Fixed Baseline</th>
                <th className="pb-1.5 font-normal text-center text-cyan-300 font-bold">Adaptive Cache</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              <tr>
                <td className="py-2 text-slate-300 font-medium">Hit Rate</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.hitRate.toFixed(1)}%</td>
                <td className="py-2 text-center text-emerald-400 font-bold">{metrics.hitRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300 font-medium">Miss Rate</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.missRate.toFixed(1)}%</td>
                <td className="py-2 text-center text-rose-400 font-bold">{metrics.missRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300 font-medium">AMAT Latency</td>
                <td className="py-2 text-center text-slate-400">{baselineMetrics.amatNs.toFixed(1)} ns</td>
                <td className="py-2 text-center text-cyan-300 font-bold">{metrics.amatNs.toFixed(1)} ns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
