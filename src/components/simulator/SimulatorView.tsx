import React from 'react';
import { SimulatorControls } from './SimulatorControls';
import { CompactStepStatus } from './CompactStepStatus';
import { SimulatorMetricsAndComparison } from './SimulatorMetricsAndComparison';
import { CompactMemoryActivity } from './CompactMemoryActivity';
import { CompactCacheGrid } from './CompactCacheGrid';
import { PerformanceGraphs } from './PerformanceGraphs';

export const SimulatorView: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-5 animate-fadeIn font-mono-code">
      {/* 1. Simplified Simulator Controls */}
      <SimulatorControls />

      {/* 2. Compact Step Operation Progress Bar (CPU → CACHE → MEMORY → ADAPTIVE) */}
      <CompactStepStatus />

      {/* 3. Three Metrics + Fixed vs Adaptive Comparison Matrix */}
      <SimulatorMetricsAndComparison />

      {/* 4. Two Compact Panels: Memory Activity (5-8 rows) & Cache Occupancy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CompactMemoryActivity />
        <CompactCacheGrid />
      </div>

      {/* 5. Clean Analytics Performance Graphs */}
      <PerformanceGraphs />
    </div>
  );
};
