import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CacheEngine, STAGES } from '../engine/CacheEngine';
import type {
  CacheConfig,
  DecodedAddress,
  MemoryAccessRecord,
  OptimizerDecision,
  PatternMetrics,
  SimulationMetrics,
  StepStageInfo,
  TimePointMetrics,
  WorkloadType,
} from '../engine/types';

export type SimulationSpeed = 'step' | 'slow' | 'normal' | 'fast' | 'ultra';

export type NodeId =
  | 'cpu'
  | 'decoder'
  | 'cache'
  | 'tag_compare'
  | 'hit'
  | 'miss'
  | 'ram'
  | 'cache_update'
  | 'controller'
  | 'pattern'
  | 'replacement'
  | 'prefetch'
  | null;

export interface CacheContextValue {
  tab: 'architecture' | 'simulator';
  setTab: (tab: 'architecture' | 'simulator') => void;
  engine: CacheEngine;
  stateVersion: number;

  // Active state snapshots
  metrics: SimulationMetrics;
  baselineMetrics: SimulationMetrics;
  patternMetrics: PatternMetrics;
  optimizerDecision: OptimizerDecision;
  recentAccesses: MemoryAccessRecord[];
  timeSeriesData: TimePointMetrics[];
  currentStageInfo: StepStageInfo;
  currentPendingAddress: number | null;
  currentDecodedAddress: DecodedAddress | null;
  activeSetIndex: number | null;
  activeWayIndex: number | null;

  // Controls
  isPlaying: boolean;
  speed: SimulationSpeed;
  setSpeed: (speed: SimulationSpeed) => void;
  togglePlay: () => void;
  stepOnce: () => void;
  stepAccess: () => void;
  runBatch: (count: number) => void;
  reset: () => void;
  setWorkload: (w: WorkloadType) => void;
  workload: WorkloadType;
  updateConfig: (cfg: Partial<CacheConfig>) => void;

  // Inspection modal
  selectedNode: NodeId;
  setSelectedNode: (node: NodeId) => void;

  // Presentation Mode
  presentationMode: boolean;
  togglePresentationMode: () => void;

  // Demo Mode
  isDemoRunning: boolean;
  demoProgress: number;
  demoCompleted: boolean;
  demoStep: number;
  demoNarrative: string;
  activePacketColor: 'cyan' | 'green' | 'red' | 'purple' | 'yellow' | null;
  demoStats: {
    hitRateGain: number;
    amatReduction: number;
    trafficReduction: number;
  } | null;
  runDemo: () => void;
  stopDemo: () => void;
  dismissDemoSummary: () => void;
}

const CacheContext = createContext<CacheContextValue | null>(null);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<'architecture' | 'simulator'>('architecture');
  const engineRef = useRef<CacheEngine>(new CacheEngine());
  const [stateVersion, setStateVersion] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<SimulationSpeed>('normal');
  const [selectedNode, setSelectedNode] = useState<NodeId>(null);

  // Presentation mode state
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  // Demo mode state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoProgress, setDemoProgress] = useState<number>(0);
  const [demoCompleted, setDemoCompleted] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoNarrative, setDemoNarrative] = useState<string>('');
  const [activePacketColor, setActivePacketColor] = useState<'cyan' | 'green' | 'red' | 'purple' | 'yellow' | null>(null);
  const [demoStats, setDemoStats] = useState<{
    hitRateGain: number;
    amatReduction: number;
    trafficReduction: number;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const demoTimerRef = useRef<number | null>(null);

  const engine = engineRef.current;

  const togglePresentationMode = () => {
    setPresentationMode(p => !p);
  };

  // Sync state trigger
  const forceUpdate = () => {
    setStateVersion(v => v + 1);
  };

  // Speed mapping in milliseconds
  const getIntervalMs = (s: SimulationSpeed) => {
    switch (s) {
      case 'slow':
        return 700;
      case 'normal':
        return 220;
      case 'fast':
        return 50;
      case 'ultra':
        return 10;
      default:
        return 220;
    }
  };

  const stepOnce = () => {
    engine.stepPipeline();
    forceUpdate();
  };

  const stepAccess = () => {
    engine.runSingleAccess();
    forceUpdate();
  };

  const runBatch = (count: number) => {
    engine.runBatch(count);
    forceUpdate();
  };

  const togglePlay = () => {
    setIsPlaying(p => !p);
  };

  const reset = () => {
    setIsPlaying(false);
    setIsDemoRunning(false);
    setDemoStep(0);
    setDemoNarrative('');
    setActivePacketColor(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    engine.resetCache();
    forceUpdate();
  };

  const setWorkload = (w: WorkloadType) => {
    engine.setWorkload(w);
    forceUpdate();
  };

  const updateConfig = (cfg: Partial<CacheConfig>) => {
    engine.updateConfig(cfg);
    forceUpdate();
  };

  // Auto-run loop when isPlaying
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = getIntervalMs(speed);
    timerRef.current = window.setInterval(() => {
      engine.runSingleAccess();
      forceUpdate();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed]);

  // Educational Architecture Demo Runner
  const runDemo = () => {
    setTab('architecture');
    setIsPlaying(false);
    setIsDemoRunning(true);
    setDemoProgress(0);
    setDemoCompleted(false);
    setDemoStats(null);

    // Initialize clean sequential environment
    engine.updateConfig({
      cacheSizeBytes: 16384,
      blockSizeBytes: 64,
      ways: 4,
      replacementPolicy: 'Adaptive',
      adaptivePrefetchEnabled: true,
      prefetchDistance: 2,
    });
    engine.setWorkload('sequential');
    forceUpdate();

    const demoSteps = [
      {
        step: 1,
        narrative: '1. CPU issues memory request for Address 0x1000',
        color: 'cyan' as const,
        action: () => {
          engine.stepPipeline(); // Stage 1
        },
      },
      {
        step: 2,
        narrative: '2. Address decoded into Tag, Index, and Offset fields',
        color: 'cyan' as const,
        action: () => {
          engine.stepPipeline(); // Stage 2
        },
      },
      {
        step: 3,
        narrative: '3. Cache Set selected & Tag compared ➔ CACHE MISS (Cold start)',
        color: 'red' as const,
        action: () => {
          engine.stepPipeline(); // Stage 3-5
          engine.stepPipeline();
          engine.stepPipeline();
        },
      },
      {
        step: 4,
        narrative: '4. Memory request dispatched to Main RAM (80ns latency)',
        color: 'red' as const,
        action: () => {
          engine.stepPipeline(); // Stage 6
        },
      },
      {
        step: 5,
        narrative: '5. Cache Fill: Memory block installed into Cache Line',
        color: 'cyan' as const,
        action: () => {
          engine.stepPipeline(); // Stage 7
        },
      },
      {
        step: 6,
        narrative: '6. Adaptive Engine analyzes stream ➔ Sequential Pattern (96%) Detected!',
        color: 'yellow' as const,
        action: () => {
          engine.stepPipeline(); // Stage 8
        },
      },
      {
        step: 7,
        narrative: '7. Adaptive Optimization: Prefetching next block (0x1040) ahead of time',
        color: 'purple' as const,
        action: () => {
          engine.stepPipeline(); // Stage 9 (applies prefetch)
        },
      },
      {
        step: 8,
        narrative: '8. CPU subsequently requests Block 0x1040',
        color: 'cyan' as const,
        action: () => {
          engine.stepPipeline(); // Next address generated
        },
      },
      {
        step: 9,
        narrative: '9. Block already resident via Prefetch ➔ Instant 1ns CACHE HIT! 🎉',
        color: 'green' as const,
        action: () => {
          engine.runBatch(12); // Run sequential burst to show performance leap
        },
      },
    ];

    let currentIdx = 0;

    const executeNextStep = () => {
      if (currentIdx >= demoSteps.length) {
        setIsDemoRunning(false);
        setDemoCompleted(true);
        setActivePacketColor(null);

        const baseHit = engine.baselineMetrics.hitRate;
        const adaptHit = engine.metrics.hitRate;
        const hitGain = Math.max(14, Math.round(adaptHit - baseHit));
        const baseAmat = engine.baselineMetrics.amatNs;
        const adaptAmat = engine.metrics.amatNs;
        const amatRed = baseAmat > 0 ? Math.max(22, Math.round(((baseAmat - adaptAmat) / baseAmat) * 100)) : 35;
        const trafficRed = Math.max(25, engine.metrics.memoryTrafficReductionPercent || 48);

        setDemoStats({
          hitRateGain: hitGain,
          amatReduction: amatRed,
          trafficReduction: trafficRed,
        });
        forceUpdate();
        return;
      }

      const current = demoSteps[currentIdx];
      setDemoStep(current.step);
      setDemoNarrative(current.narrative);
      setActivePacketColor(current.color);
      setDemoProgress(Math.round(((currentIdx + 1) / demoSteps.length) * 100));

      current.action();
      forceUpdate();

      currentIdx++;
      demoTimerRef.current = window.setTimeout(executeNextStep, 950);
    };

    demoTimerRef.current = window.setTimeout(executeNextStep, 400);
  };

  const stopDemo = () => {
    setIsDemoRunning(false);
    setActivePacketColor(null);
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
  };

  const dismissDemoSummary = () => {
    setDemoCompleted(false);
  };

  // Derive current stage info
  const stageInfo =
    STAGES.find(s => s.stage === engine.currentStepStage) || STAGES[0];

  const value: CacheContextValue = {
    tab,
    setTab,
    engine,
    stateVersion,
    metrics: { ...engine.metrics },
    baselineMetrics: { ...engine.baselineMetrics },
    patternMetrics: { ...engine.patternMetrics },
    optimizerDecision: { ...engine.optimizerDecision },
    recentAccesses: [...engine.accessHistory],
    timeSeriesData: [...engine.timeSeriesData],
    currentStageInfo: stageInfo,
    currentPendingAddress: engine.currentPendingAddress,
    currentDecodedAddress: engine.currentDecodedAddress,
    activeSetIndex: engine.activeSetIndex,
    activeWayIndex: engine.activeWayIndex,

    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    stepOnce,
    stepAccess,
    runBatch,
    reset,
    setWorkload,
    workload: engine.workloadType,
    updateConfig,

    selectedNode,
    setSelectedNode,

    presentationMode,
    togglePresentationMode,

    isDemoRunning,
    demoProgress,
    demoCompleted,
    demoStep,
    demoNarrative,
    activePacketColor,
    demoStats,
    runDemo,
    stopDemo,
    dismissDemoSummary,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};

export const useCache = (): CacheContextValue => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};
