import React from 'react';
import { CacheProvider, useCache } from './context/CacheContext';
import { Header } from './components/common/Header';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { SimulatorView } from './components/simulator/SimulatorView';
import { Cpu, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const { tab } = useCache();

  return (
    <main className="flex-1">
      {tab === 'architecture' ? <ArchitectureView /> : <SimulatorView />}
    </main>
  );
};

export function App() {
  return (
    <CacheProvider>
      <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
        {/* Navigation & Status Header */}
        <Header />

        {/* Dynamic Primary Workspace */}
        <MainContent />

        {/* Clean Professional Footer */}
        <footer className="border-t border-zinc-200 bg-white py-4 px-4 lg:px-8 mt-12 text-xs font-mono-code text-zinc-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 font-semibold">
                Adaptive Cache Optimizer
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500">
                COA High-Performance Processor Research Platform
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-zinc-700" />
                L1 Data / Dynamic Prefetch
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-700" />
                Dual-Engine Baseline Verifier
              </span>
            </div>
          </div>
        </footer>
      </div>
    </CacheProvider>
  );
}

export default App;
