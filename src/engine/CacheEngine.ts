import type {
  AccessResult,
  CacheConfig,
  CacheSet,
  DecodedAddress,
  MemoryAccessRecord,
  OptimizerDecision,
  PatternMetrics,
  SimulationMetrics,
  StepStageInfo,
  StepStageNumber,
  TimePointMetrics,
  WorkloadType,
} from './types';
import { createWorkloadGenerator } from './workloads';
import type { WorkloadGenerator } from './workloads';

export const STAGES: StepStageInfo[] = [
  {
    stage: 1,
    title: '1. CPU Generates Address',
    description: 'The CPU execution core issues a 32-bit virtual/physical memory request to the cache hierarchy.',
    activeComponent: 'cpu',
    packetColor: 'cyan',
  },
  {
    stage: 2,
    title: '2. Address is Decoded',
    description: 'The address bits are partitioned into TAG, SET INDEX, and BYTE OFFSET fields based on cache geometry.',
    activeComponent: 'decoder',
    packetColor: 'cyan',
  },
  {
    stage: 3,
    title: '3. Cache Set Selected',
    description: 'The decoded INDEX bits activate the corresponding Set within the multi-way associative cache.',
    activeComponent: 'cache',
    packetColor: 'cyan',
  },
  {
    stage: 4,
    title: '4. Tag Compared Across Ways',
    description: 'The requested TAG is compared simultaneously against the tags stored in all ways of the active set.',
    activeComponent: 'tag_compare',
    packetColor: 'cyan',
  },
  {
    stage: 5,
    title: '5. HIT / MISS Evaluated',
    description: 'Comparator checks for valid bit = 1 and tag match. Determines if data is directly present.',
    activeComponent: 'hit_miss',
    packetColor: 'green',
  },
  {
    stage: 6,
    title: '6. Main RAM Access',
    description: 'On a cache miss, a memory transaction is dispatched to Main Memory (DRAM) over the system interconnect.',
    activeComponent: 'ram',
    packetColor: 'red',
  },
  {
    stage: 7,
    title: '7. Cache Line Updated / Replaced',
    description: 'The returned memory block is installed into the cache set, evicting an existing line according to the policy.',
    activeComponent: 'cache_update',
    packetColor: 'cyan',
  },
  {
    stage: 8,
    title: '8. Adaptive Controller Evaluates Pattern',
    description: 'Heuristic pattern detector analyzes sliding window for sequentiality, temporal reuse, and stride metrics.',
    activeComponent: 'adaptive_eval',
    packetColor: 'yellow',
  },
  {
    stage: 9,
    title: '9. Optimization Decision Applied',
    description: 'Controller optimizes prefetch triggers and dynamically configures replacement strategy.',
    activeComponent: 'optimizer_decision',
    packetColor: 'purple',
  },
];

export class CacheEngine {
  public config: CacheConfig;
  public sets: CacheSet[] = [];
  public baselineSets: CacheSet[] = [];
  
  // Workload generator
  public workloadType: WorkloadType = 'sequential';
  private workloadGen: WorkloadGenerator;

  // Geometry calculations
  public offsetBits: number = 6; // log2(64) = 6
  public numSets: number = 64;   // 16384 / (64 * 4) = 64
  public indexBits: number = 6;  // log2(64) = 6
  public tagBits: number = 20;   // 32 - 6 - 6 = 20

  // Metrics
  public accessHistory: MemoryAccessRecord[] = [];
  public metrics: SimulationMetrics;
  public baselineMetrics: SimulationMetrics;
  public timeSeriesData: TimePointMetrics[] = [];

  // Adaptive controller state
  public recentAddresses: number[] = [];
  public patternMetrics: PatternMetrics;
  public optimizerDecision: OptimizerDecision;

  // Step-mode execution state
  public currentStepStage: StepStageNumber = 1;
  public currentPendingAddress: number | null = null;
  public currentDecodedAddress: DecodedAddress | null = null;
  public currentAccessRecord: MemoryAccessRecord | null = null;
  public activeSetIndex: number | null = null;
  public activeWayIndex: number | null = null;
  public pendingPrefetchAddress: number | null = null;

  private logicalClock: number = 0;

  constructor(customConfig?: Partial<CacheConfig>) {
    this.config = {
      cacheSizeBytes: 16384, // 16 KB default
      blockSizeBytes: 64,    // 64 B default
      ways: 4,               // 4-way default
      hitLatencyNs: 1,
      missLatencyNs: 80,
      replacementPolicy: 'Adaptive',
      adaptivePrefetchEnabled: true,
      prefetchDistance: 2,
      ...customConfig,
    };

    this.metrics = this.createInitialMetrics();
    this.baselineMetrics = this.createInitialMetrics();
    this.patternMetrics = {
      sequentiality: 96,
      temporalLocality: 81,
      randomness: 4,
      stride: 64,
      detectedPattern: 'SEQUENTIAL',
      confidence: 94,
    };
    this.optimizerDecision = {
      replacement: 'LRU',
      prefetch: 'NEXT-LINE',
      prefetchDistance: 2,
      cacheMode: 'PERFORMANCE',
      decisionAction: 'FETCH NEXT BLOCK',
      reason: 'Strong sequential stream detected (96%). Prefetching block n+1 and n+2 ahead of time.',
    };

    this.workloadGen = createWorkloadGenerator(this.workloadType, this.config.blockSizeBytes);
    this.calculateGeometry();
    this.resetCache();
  }

  private createInitialMetrics(): SimulationMetrics {
    return {
      totalAccesses: 0,
      hits: 0,
      misses: 0,
      prefetchHits: 0,
      prefetchesIssued: 0,
      hitRate: 0,
      missRate: 0,
      amatNs: this.config.hitLatencyNs,
      memoryTrafficSavedBytes: 0,
      memoryTrafficReductionPercent: 0,
    };
  }

  public updateConfig(newConfig: Partial<CacheConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.calculateGeometry();
    this.resetCache();
  }

  public setWorkload(workload: WorkloadType) {
    this.workloadType = workload;
    this.workloadGen = createWorkloadGenerator(workload, this.config.blockSizeBytes);
    this.resetCache();
  }

  public calculateGeometry() {
    this.offsetBits = Math.round(Math.log2(this.config.blockSizeBytes));
    this.numSets = Math.max(1, Math.floor(this.config.cacheSizeBytes / (this.config.blockSizeBytes * this.config.ways)));
    this.indexBits = Math.round(Math.log2(this.numSets));
    this.tagBits = Math.max(1, 32 - this.indexBits - this.offsetBits);
  }

  public resetCache() {
    this.logicalClock = 0;
    this.currentStepStage = 1;
    this.currentPendingAddress = null;
    this.currentDecodedAddress = null;
    this.currentAccessRecord = null;
    this.activeSetIndex = null;
    this.activeWayIndex = null;
    this.pendingPrefetchAddress = null;

    this.accessHistory = [];
    this.recentAddresses = [];
    this.timeSeriesData = [];
    this.metrics = this.createInitialMetrics();
    this.baselineMetrics = this.createInitialMetrics();

    // Initialize cache sets
    this.sets = Array.from({ length: this.numSets }, () => ({
      lines: Array.from({ length: this.config.ways }, () => ({
        valid: false,
        tag: 0,
        dataHex: '0x0000',
        lastAccessTime: 0,
        accessCount: 0,
        fifoOrder: 0,
        address: 0,
        isPrefetched: false,
      })),
    }));

    // Baseline cache sets (always standard LRU, no prefetch)
    this.baselineSets = Array.from({ length: this.numSets }, () => ({
      lines: Array.from({ length: this.config.ways }, () => ({
        valid: false,
        tag: 0,
        dataHex: '0x0000',
        lastAccessTime: 0,
        accessCount: 0,
        fifoOrder: 0,
        address: 0,
      })),
    }));

    this.workloadGen.reset();
  }

  public decodeAddress(address: number): DecodedAddress {
    const unsignedAddr = address >>> 0;
    const offsetMask = (1 << this.offsetBits) - 1;
    const offset = unsignedAddr & offsetMask;

    const indexMask = (1 << this.indexBits) - 1;
    const index = (unsignedAddr >>> this.offsetBits) & indexMask;

    const tag = (unsignedAddr >>> (this.offsetBits + this.indexBits)) >>> 0;

    const binary32 = unsignedAddr.toString(2).padStart(32, '0');
    const tagBinary = binary32.slice(0, this.tagBits);
    const indexBinary = binary32.slice(this.tagBits, this.tagBits + this.indexBits);
    const offsetBinary = binary32.slice(this.tagBits + this.indexBits);

    return {
      address: unsignedAddr,
      binaryString: binary32,
      tag,
      tagBinary,
      tagBits: this.tagBits,
      index,
      indexBinary,
      indexBits: this.indexBits,
      offset,
      offsetBinary,
      offsetBits: this.offsetBits,
    };
  }

  // --- Step Pipeline execution ---
  public stepPipeline(): StepStageInfo {
    this.logicalClock++;

    // Prepare address if at stage 1
    if (this.currentStepStage === 1 || this.currentPendingAddress === null) {
      this.currentPendingAddress = this.workloadGen.nextAddress();
      this.currentDecodedAddress = this.decodeAddress(this.currentPendingAddress);
      this.activeSetIndex = this.currentDecodedAddress.index;
      this.currentStepStage = 1;
    }

    const currentStage = STAGES.find(s => s.stage === this.currentStepStage)!;

    switch (this.currentStepStage) {
      case 1: {
        // CPU generates address
        this.currentStepStage = 2;
        break;
      }
      case 2: {
        // Address decoded
        this.currentStepStage = 3;
        break;
      }
      case 3: {
        // Set selected
        this.currentStepStage = 4;
        break;
      }
      case 4: {
        // Tag compared
        this.currentStepStage = 5;
        break;
      }
      case 5: {
        // HIT / MISS evaluated
        const decoded = this.currentDecodedAddress!;
        const set = this.sets[decoded.index];
        let foundWay = -1;
        let isPrefetchHit = false;

        for (let w = 0; w < set.lines.length; w++) {
          if (set.lines[w].valid && set.lines[w].tag === decoded.tag) {
            foundWay = w;
            if (set.lines[w].isPrefetched) {
              isPrefetchHit = true;
            }
            break;
          }
        }

        this.activeWayIndex = foundWay >= 0 ? foundWay : null;

        const isHit = foundWay >= 0;
        const result: AccessResult = isHit ? (isPrefetchHit ? 'PREFETCH_HIT' : 'HIT') : 'MISS';

        // Also run in baseline cache for comparison
        this.processBaselineAccess(decoded.address);

        if (isHit) {
          // HIT: update access metrics
          set.lines[foundWay].lastAccessTime = this.logicalClock;
          set.lines[foundWay].accessCount++;
          set.lines[foundWay].isPrefetched = false;

          this.metrics.hits++;
          if (isPrefetchHit) {
            this.metrics.prefetchHits++;
          }
          this.metrics.totalAccesses++;

          this.currentAccessRecord = {
            id: this.metrics.totalAccesses,
            address: decoded.address,
            addressHex: `0x${decoded.address.toString(16).toUpperCase().padStart(4, '0')}`,
            result,
            setIndex: decoded.index,
            tag: decoded.tag,
            wayIndex: foundWay,
            isPrefetch: false,
            timestamp: Date.now(),
            stageMessage: `Cache HIT at Set 0x${decoded.index.toString(16).toUpperCase()} Way ${foundWay}`,
          };

          this.finishAccessMetrics();

          // On HIT, skip RAM access (Stage 6) and line allocation (Stage 7), jump directly to adaptive eval (Stage 8)
          this.currentStepStage = 8;
        } else {
          // MISS: will proceed to RAM access (Stage 6)
          this.metrics.misses++;
          this.metrics.totalAccesses++;

          this.currentAccessRecord = {
            id: this.metrics.totalAccesses,
            address: decoded.address,
            addressHex: `0x${decoded.address.toString(16).toUpperCase().padStart(4, '0')}`,
            result: 'MISS',
            setIndex: decoded.index,
            tag: decoded.tag,
            wayIndex: -1,
            isPrefetch: false,
            timestamp: Date.now(),
            stageMessage: `Cache MISS at Set 0x${decoded.index.toString(16).toUpperCase()}`,
          };

          this.finishAccessMetrics();
          this.currentStepStage = 6;
        }
        break;
      }
      case 6: {
        // RAM accessed
        this.currentStepStage = 7;
        break;
      }
      case 7: {
        // Cache line updated / replaced
        const decoded = this.currentDecodedAddress!;
        const wayInstalled = this.installLineInSet(
          this.sets[decoded.index],
          decoded.tag,
          decoded.address,
          false
        );
        this.activeWayIndex = wayInstalled;
        if (this.currentAccessRecord) {
          this.currentAccessRecord.wayIndex = wayInstalled;
        }
        this.currentStepStage = 8;
        break;
      }
      case 8: {
        // Adaptive controller evaluates pattern
        if (this.currentPendingAddress !== null) {
          this.updateAdaptiveAnalysis(this.currentPendingAddress);
        }
        this.currentStepStage = 9;
        break;
      }
      case 9: {
        // Optimization decision applied & Prefetch execution
        this.applyOptimizationDecision();

        // If prefetch is triggered, execute prefetch block load
        if (this.optimizerDecision.prefetch !== 'DISABLED' && this.pendingPrefetchAddress !== null) {
          this.executePrefetch(this.pendingPrefetchAddress);
        }

        // Ready for next address
        this.currentStepStage = 1;
        this.currentPendingAddress = null;
        break;
      }
    }

    return currentStage;
  }

  // Complete a single access in one go (for batch/fast run)
  public runSingleAccess(): MemoryAccessRecord {
    const address = this.workloadGen.nextAddress();
    const decoded = this.decodeAddress(address);
    this.logicalClock++;
    this.currentPendingAddress = address;
    this.currentDecodedAddress = decoded;
    this.activeSetIndex = decoded.index;

    // Check hit/miss
    const set = this.sets[decoded.index];
    let foundWay = -1;
    let isPrefetchHit = false;

    for (let w = 0; w < set.lines.length; w++) {
      if (set.lines[w].valid && set.lines[w].tag === decoded.tag) {
        foundWay = w;
        if (set.lines[w].isPrefetched) {
          isPrefetchHit = true;
        }
        break;
      }
    }

    const isHit = foundWay >= 0;
    const result: AccessResult = isHit ? (isPrefetchHit ? 'PREFETCH_HIT' : 'HIT') : 'MISS';

    this.processBaselineAccess(address);

    if (isHit) {
      set.lines[foundWay].lastAccessTime = this.logicalClock;
      set.lines[foundWay].accessCount++;
      set.lines[foundWay].isPrefetched = false;

      this.metrics.hits++;
      if (isPrefetchHit) {
        this.metrics.prefetchHits++;
      }
      this.activeWayIndex = foundWay;
    } else {
      this.metrics.misses++;
      const installedWay = this.installLineInSet(set, decoded.tag, address, false);
      this.activeWayIndex = installedWay;
      foundWay = installedWay;
    }

    this.metrics.totalAccesses++;
    this.finishAccessMetrics();

    // Update adaptive controller
    this.updateAdaptiveAnalysis(address);
    this.applyOptimizationDecision();

    // Perform prefetch if indicated
    if (this.optimizerDecision.prefetch !== 'DISABLED' && this.pendingPrefetchAddress !== null) {
      this.executePrefetch(this.pendingPrefetchAddress);
    }

    const record: MemoryAccessRecord = {
      id: this.metrics.totalAccesses,
      address,
      addressHex: `0x${address.toString(16).toUpperCase().padStart(4, '0')}`,
      result,
      setIndex: decoded.index,
      tag: decoded.tag,
      wayIndex: foundWay,
      isPrefetch: false,
      prefetchedAddressHex: this.pendingPrefetchAddress
        ? `0x${this.pendingPrefetchAddress.toString(16).toUpperCase().padStart(4, '0')}`
        : undefined,
      timestamp: Date.now(),
    };

    this.currentAccessRecord = record;
    this.accessHistory.unshift(record);
    if (this.accessHistory.length > 200) {
      this.accessHistory.pop();
    }

    // Save timepoint metrics periodically
    if (this.metrics.totalAccesses % 5 === 0 || this.metrics.totalAccesses < 30) {
      this.recordTimePointMetrics();
    }

    return record;
  }

  // Run a batch of accesses quickly (e.g. 50 or 500)
  public runBatch(count: number) {
    for (let i = 0; i < count; i++) {
      this.runSingleAccess();
    }
  }

  private installLineInSet(
    set: CacheSet,
    tag: number,
    address: number,
    isPrefetch: boolean
  ): number {
    // 1. Check for empty/invalid line
    for (let w = 0; w < set.lines.length; w++) {
      if (!set.lines[w].valid) {
        set.lines[w] = {
          valid: true,
          tag,
          dataHex: `0x${(address & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`,
          lastAccessTime: this.logicalClock,
          accessCount: 1,
          fifoOrder: this.logicalClock,
          address,
          isPrefetched: isPrefetch,
        };
        return w;
      }
    }

    // 2. Set is full: Select victim based on replacement policy
    const policy = this.optimizerDecision ? this.optimizerDecision.replacement : this.config.replacementPolicy;
    let victimWay = 0;

    switch (policy) {
      case 'LFU': {
        let minCount = Infinity;
        for (let w = 0; w < set.lines.length; w++) {
          if (set.lines[w].accessCount < minCount) {
            minCount = set.lines[w].accessCount;
            victimWay = w;
          }
        }
        break;
      }
      case 'FIFO': {
        let minOrder = Infinity;
        for (let w = 0; w < set.lines.length; w++) {
          if (set.lines[w].fifoOrder < minOrder) {
            minOrder = set.lines[w].fifoOrder;
            victimWay = w;
          }
        }
        break;
      }
      case 'Random': {
        victimWay = Math.floor(Math.random() * set.lines.length);
        break;
      }
      case 'LRU':
      default: {
        let oldestTime = Infinity;
        for (let w = 0; w < set.lines.length; w++) {
          if (set.lines[w].lastAccessTime < oldestTime) {
            oldestTime = set.lines[w].lastAccessTime;
            victimWay = w;
          }
        }
        break;
      }
    }

    // Replace victim line
    set.lines[victimWay] = {
      valid: true,
      tag,
      dataHex: `0x${(address & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`,
      lastAccessTime: this.logicalClock,
      accessCount: 1,
      fifoOrder: this.logicalClock,
      address,
      isPrefetched: isPrefetch,
    };

    return victimWay;
  }

  private processBaselineAccess(address: number) {
    const decoded = this.decodeAddress(address);
    const set = this.baselineSets[decoded.index];
    let hit = false;
    let foundWay = -1;

    for (let w = 0; w < set.lines.length; w++) {
      if (set.lines[w].valid && set.lines[w].tag === decoded.tag) {
        hit = true;
        foundWay = w;
        break;
      }
    }

    this.baselineMetrics.totalAccesses++;
    if (hit) {
      this.baselineMetrics.hits++;
      set.lines[foundWay].lastAccessTime = this.logicalClock;
    } else {
      this.baselineMetrics.misses++;
      // Standard LRU replacement in baseline
      let oldest = Infinity;
      let victim = 0;
      for (let w = 0; w < set.lines.length; w++) {
        if (!set.lines[w].valid) {
          victim = w;
          break;
        }
        if (set.lines[w].lastAccessTime < oldest) {
          oldest = set.lines[w].lastAccessTime;
          victim = w;
        }
      }
      set.lines[victim] = {
        valid: true,
        tag: decoded.tag,
        dataHex: `0x${(address & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`,
        lastAccessTime: this.logicalClock,
        accessCount: 1,
        fifoOrder: this.logicalClock,
        address,
      };
    }

    const total = this.baselineMetrics.totalAccesses;
    this.baselineMetrics.hitRate = total > 0 ? (this.baselineMetrics.hits / total) * 100 : 0;
    this.baselineMetrics.missRate = total > 0 ? (this.baselineMetrics.misses / total) * 100 : 0;
    this.baselineMetrics.amatNs =
      this.config.hitLatencyNs + (this.baselineMetrics.missRate / 100) * this.config.missLatencyNs;
  }

  private finishAccessMetrics() {
    const total = this.metrics.totalAccesses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;
    this.metrics.missRate = total > 0 ? (this.metrics.misses / total) * 100 : 0;
    this.metrics.amatNs =
      this.config.hitLatencyNs + (this.metrics.missRate / 100) * this.config.missLatencyNs;

    // Traffic saved vs baseline misses
    const baselineMisses = this.baselineMetrics.misses;
    const adaptiveMisses = this.metrics.misses;
    const savedMisses = Math.max(0, baselineMisses - adaptiveMisses);
    this.metrics.memoryTrafficSavedBytes = savedMisses * this.config.blockSizeBytes;
    this.metrics.memoryTrafficReductionPercent =
      baselineMisses > 0 ? Math.min(100, Math.round((savedMisses / baselineMisses) * 100)) : 0;
  }

  private updateAdaptiveAnalysis(address: number) {
    this.recentAddresses.push(address);
    if (this.recentAddresses.length > 32) {
      this.recentAddresses.shift();
    }

    if (this.recentAddresses.length < 3) {
      return;
    }

    const windowSize = this.recentAddresses.length;
    let sequentialMatches = 0;
    let strideMatches = 0;
    const strideStep = this.config.blockSizeBytes * 4;
    const addressCounts: Record<number, number> = {};

    for (let i = 1; i < windowSize; i++) {
      const delta = this.recentAddresses[i] - this.recentAddresses[i - 1];
      if (delta === this.config.blockSizeBytes) {
        sequentialMatches++;
      } else if (delta === strideStep) {
        strideMatches++;
      }
      addressCounts[this.recentAddresses[i]] = (addressCounts[this.recentAddresses[i]] || 0) + 1;
    }

    let repeatCount = 0;
    Object.values(addressCounts).forEach(c => {
      if (c > 1) repeatCount += c;
    });

    const sequentiality = Math.round((sequentialMatches / (windowSize - 1)) * 100);
    const stridedness = Math.round((strideMatches / (windowSize - 1)) * 100);
    const temporalLocality = Math.round((repeatCount / windowSize) * 100);
    const randomness = Math.max(0, 100 - Math.max(sequentiality, stridedness, temporalLocality));

    let detected: 'SEQUENTIAL' | 'TEMPORAL_REUSE' | 'STRIDED' | 'RANDOM' = 'RANDOM';
    let confidence = 70;

    if (sequentiality >= 55) {
      detected = 'SEQUENTIAL';
      confidence = Math.min(98, sequentiality + 10);
    } else if (stridedness >= 50) {
      detected = 'STRIDED';
      confidence = Math.min(95, stridedness + 10);
    } else if (temporalLocality >= 45) {
      detected = 'TEMPORAL_REUSE';
      confidence = Math.min(95, temporalLocality + 15);
    } else {
      detected = 'RANDOM';
      confidence = Math.min(92, randomness + 10);
    }

    this.patternMetrics = {
      sequentiality,
      temporalLocality,
      randomness,
      stride: this.config.blockSizeBytes,
      detectedPattern: detected,
      confidence,
    };
  }

  private applyOptimizationDecision() {
    const pattern = this.patternMetrics.detectedPattern;
    const lastAddr = this.recentAddresses[this.recentAddresses.length - 1] || 0x1000;

    switch (pattern) {
      case 'SEQUENTIAL': {
        this.optimizerDecision = {
          replacement: 'LRU',
          prefetch: 'NEXT-LINE',
          prefetchDistance: this.config.prefetchDistance || 2,
          cacheMode: 'PERFORMANCE',
          decisionAction: `PREFETCH 0x${(lastAddr + this.config.blockSizeBytes).toString(16).toUpperCase()}`,
          reason: `Sequential pattern confirmed (${this.patternMetrics.sequentiality}%). Issuing next-line prefetch to eliminate upcoming cold misses.`,
        };
        this.pendingPrefetchAddress = lastAddr + this.config.blockSizeBytes;
        break;
      }

      case 'STRIDED': {
        const strideDelta = this.config.blockSizeBytes * 4;
        this.optimizerDecision = {
          replacement: 'LRU',
          prefetch: 'STRIDE',
          prefetchDistance: 2,
          cacheMode: 'PERFORMANCE',
          decisionAction: `STRIDE PREFETCH +${strideDelta}B`,
          reason: `Regular stride detected. Prefetching subsequent matrix elements along the stride vector.`,
        };
        this.pendingPrefetchAddress = lastAddr + strideDelta;
        break;
      }

      case 'TEMPORAL_REUSE': {
        this.optimizerDecision = {
          replacement: 'LFU',
          prefetch: 'CONSERVATIVE',
          prefetchDistance: 1,
          cacheMode: 'BALANCED',
          decisionAction: 'SWITCH TO LFU & PROTECT WORKING SET',
          reason: `High temporal reuse detected (${this.patternMetrics.temporalLocality}%). Prioritizing high-frequency lines to prevent thrashing.`,
        };
        this.pendingPrefetchAddress = null;
        break;
      }

      case 'RANDOM':
      default: {
        this.optimizerDecision = {
          replacement: 'LRU',
          prefetch: 'DISABLED',
          prefetchDistance: 0,
          cacheMode: 'CONSERVATIVE',
          decisionAction: 'DISABLE PREFETCH & PRESERVE BUS BANDWIDTH',
          reason: `Uncorrelated random accesses (${this.patternMetrics.randomness}%). Disabling prefetcher to prevent cache pollution and memory bus saturation.`,
        };
        this.pendingPrefetchAddress = null;
        break;
      }
    }
  }

  private executePrefetch(address: number) {
    const decoded = this.decodeAddress(address);
    const set = this.sets[decoded.index];

    // Don't prefetch if already in cache
    for (let w = 0; w < set.lines.length; w++) {
      if (set.lines[w].valid && set.lines[w].tag === decoded.tag) {
        return; // already resident
      }
    }

    // Install prefetch line marked as isPrefetched = true
    this.installLineInSet(set, decoded.tag, address, true);
    this.metrics.prefetchesIssued++;
  }

  private recordTimePointMetrics() {
    this.timeSeriesData.push({
      step: this.timeSeriesData.length + 1,
      accessId: this.metrics.totalAccesses,
      adaptiveHitRate: Number(this.metrics.hitRate.toFixed(1)),
      baselineHitRate: Number(this.baselineMetrics.hitRate.toFixed(1)),
      adaptiveMissRate: Number(this.metrics.missRate.toFixed(1)),
      baselineMissRate: Number(this.baselineMetrics.missRate.toFixed(1)),
      adaptiveAmat: Number(this.metrics.amatNs.toFixed(2)),
      baselineAmat: Number(this.baselineMetrics.amatNs.toFixed(2)),
    });

    if (this.timeSeriesData.length > 50) {
      this.timeSeriesData.shift();
    }
  }
}
