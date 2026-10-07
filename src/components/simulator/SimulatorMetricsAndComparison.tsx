import React from 'react';
import { useCache } from '../../context/CacheContext';
import { Target, Activity, Zap, TrendingUp } from 'lucide-react';

export const SimulatorMetricsAndComparison: React.FC = () => {
  const { metrics, baselineMetrics } = useCache();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono-code">
      {/* 3 Main Live Metrics Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* HIT RATE */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs uppercase font-semibold tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-zinc-700" />
            <span>Hit Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {metrics.hitRate.toFixed(1)}%
          </div>
          <span className="text-xs text-zinc-500 mt-1">Adaptive Mode</span>
        </div>

        {/* MISS RATE */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs uppercase font-semibold tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-zinc-700" />
            <span>Miss Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {metrics.missRate.toFixed(1)}%
          </div>
          <span className="text-xs text-zinc-500 mt-1">DRAM Misses</span>
        </div>

        {/* AMAT */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between text-center">
          <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs uppercase font-semibold tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-zinc-700" />
            <span>AMAT</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {metrics.amatNs.toFixed(1)}{' '}
            <span className="text-xs font-normal text-zinc-500">ns</span>
          </div>
          <span className="text-xs text-zinc-500 mt-1">Avg Memory Latency</span>
        </div>
      </div>

      {/* Clean Comparison Card: FIXED CACHE vs ADAPTIVE CACHE */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
          <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-700" />
            Fixed Cache vs Adaptive Cache
          </span>
          <span className="text-xs text-zinc-500">Live Empirical Comparison</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] uppercase text-zinc-500 border-b border-zinc-200">
                <th className="pb-2 font-medium">Metric</th>
                <th className="pb-2 font-medium text-center text-zinc-600">Fixed Baseline</th>
                <th className="pb-2 font-bold text-center text-zinc-950">Adaptive Cache</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono">
              <tr>
                <td className="py-2.5 text-zinc-800 font-medium">Hit Rate</td>
                <td className="py-2.5 text-center text-zinc-600">{baselineMetrics.hitRate.toFixed(1)}%</td>
                <td className="py-2.5 text-center text-zinc-950 font-bold">{metrics.hitRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2.5 text-zinc-800 font-medium">Miss Rate</td>
                <td className="py-2.5 text-center text-zinc-600">{baselineMetrics.missRate.toFixed(1)}%</td>
                <td className="py-2.5 text-center text-zinc-950 font-bold">{metrics.missRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2.5 text-zinc-800 font-medium">AMAT Latency</td>
                <td className="py-2.5 text-center text-zinc-600">{baselineMetrics.amatNs.toFixed(1)} ns</td>
                <td className="py-2.5 text-center text-zinc-950 font-bold">{metrics.amatNs.toFixed(1)} ns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
