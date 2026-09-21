import React from 'react';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { MainThreeMetrics } from './MainThreeMetrics';
import { NodeInspectorModal } from './NodeInspectorModal';
import { DemoCompleteOverlay } from './DemoCompleteOverlay';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* 1. Only Three Main Metrics (Hit Rate, Miss Rate, AMAT) */}
      <MainThreeMetrics />

      {/* 2. One Large, Clean, Centered Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Modals & Inspectors */}
      <NodeInspectorModal />
      <DemoCompleteOverlay />
    </div>
  );
};
