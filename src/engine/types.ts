export type ReplacementPolicyType = 'LRU' | 'FIFO' | 'LFU' | 'Random' | 'Adaptive';

export type WorkloadType = 'sequential' | 'random' | 'stride' | 'loop_reuse' | 'mixed';

export type AccessResult = 'HIT' | 'MISS' | 'PREFETCH_HIT' | 'PREFETCH_MISS';

export interface CacheConfig {
  cacheSizeBytes: number; // e.g. 16384 (16KB)
  blockSizeBytes: number; // e.g. 64 (64B)
  ways: number;           // e.g. 4 (4-way associative)
  hitLatencyNs: number;   // e.g. 1 ns
  missLatencyNs: number;  // e.g. 80 ns
  replacementPolicy: ReplacementPolicyType;
  adaptivePrefetchEnabled: boolean;
  prefetchDistance: number; // e.g. 1, 2, 4
}

export interface CacheLine {
  valid: boolean;
  tag: number;
  dataHex: string;
  lastAccessTime: number;
  accessCount: number;
  fifoOrder: number;
  address: number;
  isPrefetched?: boolean;
}

export interface CacheSet {
  lines: CacheLine[];
}

export interface DecodedAddress {
  address: number;
  binaryString: string;
  tag: number;
  tagBinary: string;
  tagBits: number;
  index: number;
  indexBinary: string;
  indexBits: number;
  offset: number;
  offsetBinary: string;
  offsetBits: number;
}

export interface MemoryAccessRecord {
  id: number;
  address: number;
  addressHex: string;
  result: AccessResult;
  setIndex: number;
  tag: number;
  wayIndex: number;
  isPrefetch: boolean;
  prefetchedAddressHex?: string;
  timestamp: number;
  stageMessage?: string;
}

export interface PatternMetrics {
  sequentiality: number;      // 0 - 100%
  temporalLocality: number;   // 0 - 100%
  randomness: number;         // 0 - 100%
  stride: number;             // detected stride step
  detectedPattern: 'SEQUENTIAL' | 'TEMPORAL_REUSE' | 'STRIDED' | 'RANDOM' | 'ANALYZING';
  confidence: number;         // 0 - 100%
}

export interface OptimizerDecision {
  replacement: 'LRU' | 'LFU' | 'MRU' | 'FIFO';
  prefetch: 'DISABLED' | 'NEXT-LINE' | 'STRIDE' | 'CONSERVATIVE';
  prefetchDistance: number;
  cacheMode: 'PERFORMANCE' | 'CONSERVATIVE' | 'BALANCED' | 'THROTTLE';
  decisionAction: string;
  reason: string;
}

export type StepStageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface StepStageInfo {
  stage: StepStageNumber;
  title: string;
  description: string;
  activeComponent: 'cpu' | 'decoder' | 'cache' | 'tag_compare' | 'hit_miss' | 'ram' | 'cache_update' | 'adaptive_eval' | 'optimizer_decision';
  packetColor?: 'cyan' | 'green' | 'red' | 'purple' | 'yellow';
}

export interface SimulationMetrics {
  totalAccesses: number;
  hits: number;
  misses: number;
  prefetchHits: number;
  prefetchesIssued: number;
  hitRate: number;        // 0 - 100%
  missRate: number;       // 0 - 100%
  amatNs: number;         // Average Memory Access Time in nanoseconds
  memoryTrafficSavedBytes: number;
  memoryTrafficReductionPercent: number;
}

export interface TimePointMetrics {
  step: number;
  accessId: number;
  adaptiveHitRate: number;
  baselineHitRate: number;
  adaptiveMissRate: number;
  baselineMissRate: number;
  adaptiveAmat: number;
  baselineAmat: number;
}
