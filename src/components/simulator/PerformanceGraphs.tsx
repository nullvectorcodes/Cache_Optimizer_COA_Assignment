import React, { useState } from 'react';
import { useCache } from '../../context/CacheContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { LineChart as ChartIcon, BarChart3 } from 'lucide-react';

export const PerformanceGraphs: React.FC = () => {
  const { timeSeriesData, metrics, baselineMetrics } = useCache();
  const [activeChartTab, setActiveChartTab] = useState<'hit' | 'miss' | 'amat' | 'comparison'>('hit');

  // Comparison data for Bar Chart
  const comparisonData = [
    {
      metric: 'Hit Rate (%)',
      Fixed: Number(baselineMetrics.hitRate.toFixed(1)),
      Adaptive: Number(metrics.hitRate.toFixed(1)),
    },
    {
      metric: 'Miss Rate (%)',
      Fixed: Number(baselineMetrics.missRate.toFixed(1)),
      Adaptive: Number(metrics.missRate.toFixed(1)),
    },
    {
      metric: 'AMAT (ns)',
      Fixed: Number(baselineMetrics.amatNs.toFixed(1)),
      Adaptive: Number(metrics.amatNs.toFixed(1)),
    },
  ];

  // If timeSeriesData has fewer than 2 items, prepare dummy initial sample for clean chart appearance
  const chartData =
    timeSeriesData.length >= 2
      ? timeSeriesData
      : [
          {
            step: 1,
            accessId: 1,
            adaptiveHitRate: 0,
            baselineHitRate: 0,
            adaptiveMissRate: 100,
            baselineMissRate: 100,
            adaptiveAmat: 81,
            baselineAmat: 81,
          },
          {
            step: 2,
            accessId: 5,
            adaptiveHitRate: Number(metrics.hitRate.toFixed(1)),
            baselineHitRate: Number(baselineMetrics.hitRate.toFixed(1)),
            adaptiveMissRate: Number(metrics.missRate.toFixed(1)),
            baselineMissRate: Number(baselineMetrics.missRate.toFixed(1)),
            adaptiveAmat: Number(metrics.amatNs.toFixed(1)),
            baselineAmat: Number(baselineMetrics.amatNs.toFixed(1)),
          },
        ];

  // Hit rate delta
  const hitGain = Number((metrics.hitRate - baselineMetrics.hitRate).toFixed(1));
  const amatReduction =
    baselineMetrics.amatNs > 0
      ? Number((((baselineMetrics.amatNs - metrics.amatNs) / baselineMetrics.amatNs) * 100).toFixed(1))
      : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl font-mono-code backdrop-blur-sm space-y-4">
      {/* Header & Graph View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <ChartIcon className="w-4 h-4" />
          <span>Real-Time Performance Analytics & Benchmarks</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-xs">
          <button
            onClick={() => setActiveChartTab('hit')}
            className={`px-3 py-1.5 font-bold transition ${
              activeChartTab === 'hit'
                ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hit Rate
          </button>
          <button
            onClick={() => setActiveChartTab('miss')}
            className={`px-3 py-1.5 font-bold transition ${
              activeChartTab === 'miss'
                ? 'bg-rose-500/20 text-rose-400 border-b-2 border-rose-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Miss Rate
          </button>
          <button
            onClick={() => setActiveChartTab('amat')}
            className={`px-3 py-1.5 font-bold transition ${
              activeChartTab === 'amat'
                ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AMAT Latency
          </button>
          <button
            onClick={() => setActiveChartTab('comparison')}
            className={`px-3 py-1.5 font-bold transition ${
              activeChartTab === 'comparison'
                ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fixed vs Adaptive
          </button>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeChartTab === 'hit' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="adaptiveHitRate"
                name="Adaptive Optimizer (%)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="baselineHitRate"
                name="Fixed Baseline LRU (%)"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : activeChartTab === 'miss' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="adaptiveMissRate"
                name="Adaptive Miss Rate (%)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="baselineMissRate"
                name="Fixed Baseline Miss Rate (%)"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : activeChartTab === 'amat' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" domain={[0, 'auto']} tick={{ fontSize: 10 }} unit="ns" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="adaptiveAmat"
                name="Adaptive AMAT (ns)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="baselineAmat"
                name="Fixed Baseline AMAT (ns)"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : (
            /* Comparison Bar Chart */
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Fixed" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Adaptive" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Fixed vs Adaptive Comparison Matrix Card */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            Fixed vs Adaptive Architecture Evaluation
          </span>
          <span className="text-[10px] text-slate-400">
            Based on {metrics.totalAccesses.toLocaleString()} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800 pb-2">
              <tr>
                <th className="py-1">Metric</th>
                <th className="py-1 text-slate-400">Fixed Baseline</th>
                <th className="py-1 text-cyan-300 font-bold">Adaptive Optimizer</th>
                <th className="py-1 text-emerald-400 font-bold">Improvement Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2 text-slate-300">Hit Rate</td>
                <td className="py-2 text-slate-400">{baselineMetrics.hitRate.toFixed(2)}%</td>
                <td className="py-2 text-emerald-400 font-bold">{metrics.hitRate.toFixed(2)}%</td>
                <td className="py-2 text-emerald-400 font-bold">
                  {hitGain >= 0 ? `+${hitGain}%` : `${hitGain}%`}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300">Miss Rate</td>
                <td className="py-2 text-slate-400">{baselineMetrics.missRate.toFixed(2)}%</td>
                <td className="py-2 text-rose-400 font-bold">{metrics.missRate.toFixed(2)}%</td>
                <td className="py-2 text-cyan-300 font-bold">
                  -{Number((baselineMetrics.missRate - metrics.missRate).toFixed(2))}%
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300">AMAT Latency</td>
                <td className="py-2 text-slate-400">{baselineMetrics.amatNs.toFixed(2)} ns</td>
                <td className="py-2 text-cyan-300 font-bold">{metrics.amatNs.toFixed(2)} ns</td>
                <td className="py-2 text-emerald-400 font-bold">
                  {amatReduction > 0 ? `-${amatReduction}% latency` : '0%'}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300">Bus Bandwidth Saved</td>
                <td className="py-2 text-slate-400">0 MB</td>
                <td className="py-2 text-amber-300 font-bold">
                  {(metrics.memoryTrafficSavedBytes / 1024).toFixed(1)} KB
                </td>
                <td className="py-2 text-amber-400 font-bold">
                  {metrics.memoryTrafficReductionPercent}% less traffic
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
