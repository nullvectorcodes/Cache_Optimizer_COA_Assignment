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
      <div className="min-h-screen flex flex-col bg-[#070a10] text-slate-200 clean-dark-bg selection:bg-cyan-500/20 selection:text-cyan-200">
        {/* Navigation & Status Header */}
        <Header />

        {/* Dynamic Primary Workspace */}
        <MainContent />

        {/* Futuristic Semiconductor Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-4 lg:px-8 mt-12 text-xs font-mono-code text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-400 font-bold">
                Adaptive Cache Optimizer
              </span>
              <span>•</span>
              <span className="text-slate-500">
                COA High-Performance Processor Research Platform
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                L1 Data / Dynamic Prefetch
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
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
