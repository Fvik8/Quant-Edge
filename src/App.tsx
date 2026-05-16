/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Globe } from 'lucide-react';
import { StatsHeader } from './components/StatsHeader';
import { OrderBook } from './components/OrderBook';
import { TradingChart } from './components/TradingChart';
import { DepthChart } from './components/DepthChart';
import { TradeHistory } from './components/TradeHistory';
import { ControlPanel } from './components/ControlPanel';
import { Markets } from './components/Markets';
import { StatsDashboard } from './components/StatsDashboard';
import { useTerminalData } from './hooks/useTerminalData';

export default function App() {
  const { 
    ticker, 
    orderBook, 
    history, 
    candles, 
    selectedAsset, 
    setSelectedAsset, 
    assets, 
    balance, 
    positions, 
    addPosition, 
    removePosition,
    isDemoMode,
    setIsDemoMode,
    resetDemoBalance
  } = useTerminalData();
  const [activeTab, setActiveTab] = useState('Terminal');
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [centralView, setCentralView] = useState<'chart' | 'depth'>('chart');

  const handleTradeAsset = (symbol: string) => {
    setSelectedAsset(symbol);
    setActiveTab('Terminal');
  };

  return (
    <div className="h-screen bg-terminal-bg flex flex-col selection:bg-terminal-green selection:text-black overflow-hidden font-sans border border-terminal-border">
      {/* Top Navigation */}
      <StatsHeader 
        ticker={ticker} 
        assets={assets}
        selectedAsset={selectedAsset}
        onAssetChange={setSelectedAsset}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDemoMode={isDemoMode}
        onDemoModeToggle={setIsDemoMode}
      />

      {/* Main Terminal Grid */}
      <main className="flex-1 grid grid-cols-12 gap-px bg-terminal-border overflow-hidden">
        {activeTab === 'Terminal' && (
          <>
            {/* Left: Order Book */}
        <section className="col-span-3 bg-terminal-bg flex flex-col overflow-hidden">
          <div className="p-3 border-b border-terminal-border flex justify-between items-center bg-terminal-surface/20">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Order Book</h2>
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
          </div>
        </section>

        {/* Center: Chart & Positions */}
        <section className="col-span-6 bg-terminal-bg flex flex-col overflow-hidden">
          {/* Market Summary Header */}
          <div className="p-5 flex justify-between items-start bg-terminal-bg border-b border-terminal-border">
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-black font-mono text-white tracking-tighter">{selectedAsset}/USD</h1>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">PERPETUAL • QUANT-DEX</span>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">24h Vol: <span className="text-zinc-300 font-mono">{ticker.volume.toLocaleString()} {ticker.symbol}</span></div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black font-mono ${ticker.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'} tracking-tighter`}>
                {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%
              </div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">H: <span className="text-zinc-300 font-mono">{ticker.high.toLocaleString()}</span> / L: <span className="text-zinc-300 font-mono">{ticker.low.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="flex bg-terminal-surface/30 border-b border-terminal-border">
             <button 
              onClick={() => setCentralView('chart')}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-terminal-border relative ${centralView === 'chart' ? 'bg-terminal-bg text-white shadow-[0_-2px_10px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               Price Chart
               {centralView === 'chart' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-terminal-green" />}
             </button>
             <button 
              onClick={() => setCentralView('depth')}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-terminal-border relative ${centralView === 'depth' ? 'bg-terminal-bg text-white shadow-[0_-2px_10px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               Market Depth
               {centralView === 'depth' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-terminal-green" />}
             </button>
          </div>

          {/* Main Chart Area */}
          <div className="flex-1 relative bg-terminal-bg flex flex-col min-h-0">
            {centralView === 'chart' ? (
              <div className="flex-1 relative flex flex-col">
                <div className="flex items-center gap-1.5 p-3 border-b border-terminal-border/50">
                  {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setActiveTimeframe(t)}
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border transition-all ${t === activeTimeframe ? 'bg-white text-black border-white' : 'text-zinc-500 border-terminal-border hover:text-white hover:border-zinc-500 bg-terminal-surface'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex-1 relative">
                  <TradingChart data={candles} symbol={selectedAsset} />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <DepthChart bids={orderBook.bids} asks={orderBook.asks} />
              </div>
            )}
          </div>

          {/* Positions Table */}
          <div className="h-72 border-t border-terminal-border flex flex-col bg-terminal-bg">
            <div className="p-4 border-b border-terminal-border flex justify-between items-center bg-terminal-surface/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Positions</h3>
              <div className="flex gap-6 font-mono text-[10px]">
                <div className="flex gap-2 items-center">
                  <span className="text-zinc-600 uppercase font-bold tracking-widest">Net uPnL</span>
                  <span className="text-terminal-green font-black">+$4,124.50</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-zinc-600 uppercase font-bold tracking-widest">Equity</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    {isDemoMode && (
                      <button 
                        onClick={resetDemoBalance}
                        className="p-1 hover:bg-zinc-800 rounded-sm text-zinc-600 hover:text-yellow-500 transition-all group"
                        title="Reset Virtual Balance"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-active:rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-[#020205] z-10">
                  <tr className="text-zinc-600 border-b border-terminal-border">
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px]">Asset</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px]">Type</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px]">Size</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px]">Entry</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px]">Mark</th>
                    <th className="py-3 px-4 font-black uppercase tracking-widest text-[9px] text-right">PnL (u)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {positions.map((pos) => (
                    <tr key={pos.id} className="group hover:bg-white/[0.02] transition-colors tabular-nums">
                      <td className="py-4 px-4 text-white font-black">{pos.asset}/USD</td>
                      <td className={`py-4 px-4 font-bold text-[10px] ${pos.type === 'LONG' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {pos.type} {pos.leverage}x
                      </td>
                      <td className="py-4 px-4 text-zinc-300 font-mono">{pos.size.toFixed(3)}</td>
                      <td className="py-4 px-4 text-zinc-500 font-mono">{pos.entry.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-white/90 font-mono">{ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-right">
                         <div className="flex items-center justify-end gap-4">
                           {(() => {
                             const pnlVal = (ticker.price - pos.entry) * pos.size * (pos.type === 'LONG' ? 1 : -1);
                             const colorClass = pnlVal > 0 ? 'text-emerald-500' : pnlVal < 0 ? 'text-rose-500' : 'text-zinc-500';
                             return (
                               <span className={`font-black font-mono ${colorClass}`}>
                                 {pnlVal > 0 ? '+' : ''}${pnlVal.toFixed(2)}
                               </span>
                             );
                           })()}
                           <button 
                            onClick={() => removePosition(pos.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-sm bg-zinc-800 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-500 transition-all text-xs font-black"
                           >
                            ✕
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {positions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-2 transition-opacity">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Neutral Position</span>
                          <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-800 italic">No active exposure detected in current sector</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right: History & Execution */}
        <section className="col-span-3 bg-terminal-bg flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-terminal-border bg-terminal-surface/20">
               <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Order Execution</h2>
            </div>
            <ControlPanel 
              selectedAsset={selectedAsset} 
              price={ticker.price} 
              balance={balance} 
              onOrderPlace={addPosition}
              isDemoMode={isDemoMode}
              onResetBalance={resetDemoBalance}
            />
          </div>
          
          <div className="h-[340px] border-t border-terminal-border flex flex-col bg-terminal-bg overflow-hidden">
            <div className="p-3 border-b border-terminal-border bg-terminal-surface/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Global Tape</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <TradeHistory history={history} />
            </div>
          </div>
        </section>
          </>
        )}

        {activeTab === 'Markets' && (
          <div className="col-span-12 flex flex-col bg-terminal-bg h-full overflow-hidden">
            <Markets onTrade={handleTradeAsset} />
          </div>
        )}

        {activeTab === 'Stats' && (
          <div className="col-span-12 flex flex-col bg-terminal-bg h-full overflow-hidden">
            <StatsDashboard />
          </div>
        )}

        {activeTab === 'Portfolio' && (
          <section className="col-span-12 bg-terminal-bg flex flex-col items-center justify-center p-20 text-center overflow-y-auto">
             <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">
               Portfolio Overview
             </h2>
             <p className="text-zinc-500 font-bold max-w-md text-sm leading-relaxed mb-8">
               Your institutional grade portfolio summary is being compiled from across the Quant-Mesh. Secure access enabled.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
               {[
                 { label: 'Total Equity', value: `$${balance.toLocaleString()}` },
                 { label: 'Open Positions', value: positions.length },
                 { label: 'Unrealized PnL', value: '+$4,124.50' }
               ].map((stat, i) => (
                 <div key={i} className="p-6 border border-terminal-border bg-terminal-surface/20 rounded-sm">
                   <div className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-2">{stat.label}</div>
                   <div className="text-2xl font-black font-mono text-white tracking-tighter">{stat.value}</div>
                 </div>
               ))}
             </div>
             <button 
              onClick={() => setActiveTab('Terminal')}
              className="mt-12 px-8 py-3 border border-emerald-500 text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-black transition-all"
             >
               Return to Terminal
             </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="h-8 bg-terminal-bg border-t border-terminal-border text-zinc-500 flex items-center px-4 justify-between text-[9px] font-bold uppercase tracking-widest shrink-0">
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-terminal-green rounded-full shadow-[0_0_8px_rgba(0,255,65,0.6)] animate-pulse"></div>
            Network Status: <span className="text-zinc-300">Synchronized</span>
          </span>
          <span>Node: <span className="text-zinc-300">QE-EAST-PROD-014</span></span>
          <span className="hidden lg:inline">Ping: <span className="text-terminal-green">14.2ms</span></span>
        </div>
        <div className="flex gap-8">
          <span>Throughput: <span className="text-zinc-300">124.5 kb/s</span></span>
          <span className="flex items-center gap-1.5">
             Encryption: <ShieldCheck className="w-3 h-3 text-terminal-green" /> <span className="text-terminal-green">AES-256-GCM</span>
          </span>
          <span className="text-zinc-400 font-mono opacity-50">REL.2026.05.16_Q2</span>
        </div>
      </footer>
    </div>
  );
}
