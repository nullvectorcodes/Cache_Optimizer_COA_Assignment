import type { WorkloadType } from './types';

export interface WorkloadGenerator {
  nextAddress: () => number;
  reset: () => void;
  name: string;
  description: string;
}

export function createWorkloadGenerator(type: WorkloadType, blockSize: number = 64): WorkloadGenerator {
  let seqCurrent = 0x1000;
  let strideCurrent = 0x2000;
  let strideStep = blockSize * 4; // 256 bytes stride
  let loopIndex = 0;
  const loopAddresses = Array.from({ length: 16 }, (_, i) => 0x4000 + i * blockSize);
  let mixedPhase = 0;
  let mixedCount = 0;

  return {
    name: type.toUpperCase(),
    description: getWorkloadDescription(type),
    reset: () => {
      seqCurrent = 0x1000;
      strideCurrent = 0x2000;
      loopIndex = 0;
      mixedPhase = 0;
      mixedCount = 0;
    },
    nextAddress: () => {
      switch (type) {
        case 'sequential': {
          const addr = seqCurrent;
          seqCurrent += blockSize;
          if (seqCurrent > 0x1000 + 1000 * blockSize) {
            seqCurrent = 0x1000;
          }
          return addr;
        }

        case 'stride': {
          const addr = strideCurrent;
          strideCurrent += strideStep;
          if (strideCurrent > 0x2000 + 400 * strideStep) {
            strideCurrent = 0x2000;
          }
          return addr;
        }

        case 'loop_reuse': {
          const addr = loopAddresses[loopIndex];
          loopIndex = (loopIndex + 1) % loopAddresses.length;
          return addr;
        }

        case 'random': {
          // Uniform random block-aligned addresses in 64KB range
          const blockNum = Math.floor(Math.random() * 512);
          return 0x8000 + blockNum * blockSize;
        }

        case 'mixed': {
          // Cycles between Sequential (40 accesses), Loop Reuse (30 accesses), and Random (20 accesses)
          mixedCount++;
          if (mixedPhase === 0) {
            // Sequential phase
            const addr = 0xa000 + mixedCount * blockSize;
            if (mixedCount >= 35) {
              mixedPhase = 1;
              mixedCount = 0;
            }
            return addr;
          } else if (mixedPhase === 1) {
            // Loop reuse phase
            const loopAddr = loopAddresses[mixedCount % 8];
            if (mixedCount >= 30) {
              mixedPhase = 2;
              mixedCount = 0;
            }
            return loopAddr;
          } else {
            // Random phase
            const blockNum = Math.floor(Math.random() * 256);
            const addr = 0xc000 + blockNum * blockSize;
            if (mixedCount >= 20) {
              mixedPhase = 0;
              mixedCount = 0;
            }
            return addr;
          }
        }
      }
    }
  };
}

function getWorkloadDescription(type: WorkloadType): string {
  switch (type) {
    case 'sequential':
      return 'Continuous stream of memory blocks (e.g. large vector operations, memcpy, array scan). High spatial locality.';
    case 'stride':
      return 'Regular strided memory jumps (e.g. matrix column-major iteration). Detectable delta.';
    case 'loop_reuse':
      return 'Tight loop traversing a small working set repeatedly. High temporal locality.';
    case 'random':
      return 'Uncorrelated addresses across a 64KB region (e.g. hash table probing, pointer chasing). Low locality.';
    case 'mixed':
      return 'Dynamic realistic benchmark interleaving sequential bursts, temporal reuse loops, and random lookups.';
  }
}
