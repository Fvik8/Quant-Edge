/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StatsHeader } from './components/StatsHeader';
import { OrderBook } from './components/OrderBook';
import { TradingChart } from './components/TradingChart';
import { DepthChart } from './components/DepthChart';
import { TradeHistory } from './components/TradeHistory';
import { ControlPanel } from './components/ControlPanel';
import { useTerminalData } from './hooks/useTerminalData';

export default function App() {
  const { ticker, orderBook, history, candles, selectedAsset, setSelectedAsset, assets } = useTerminalData();
  const [activeTimeframe, setActiveTimeframe] = useState('1M');

  return (
    <div className="h-screen bg-terminal-bg flex flex-col selection:bg-terminal-green selection:text-black overflow-hidden">
      {/* Top Navigation */}
      <StatsHeader 
        ticker={ticker} 
        assets={assets}
        selectedAsset={selectedAsset}
        onAssetChange={setSelectedAsset}
      />

      {/* Main Terminal Grid */}
      <main className="flex-1 grid grid-cols-12 gap-px bg-terminal-border overflow-hidden">
        
3        {/* Left: Order Book */}
        <section className="col-span-3 bg-black flex flex-col overflow-hidden">
          <div className="p-3 border-b border-terminal-border flex justify-between items-center bg-black">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live Order Book</h2>
            <span className="text-[10px] font-mono text-zinc-600">{selectedAsset}/USD.X</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
          </div>
        </section>

        {/* Center: Chart & Positions */}
        <section className="col-span-6 bg-black flex flex-col overflow-hidden">
          {/* Market Summary Header */}
          <div className="p-4 flex justify-between items-start bg-black border-b border-terminal-border">
            <div>
              <div className="text-xl font-bold font-mono text-white">{selectedAsset}/USD <span className="text-zinc-600 text-xs font-normal">BINANCE</span></div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Volume (24h): {ticker.volume.toLocaleString()} {ticker.symbol}</div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold font-mono ${ticker.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">H: {ticker.high.toLocaleString()} / L: {ticker.low.toLocaleString()}</div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="flex-1 relative bg-black flex flex-col">
            <div className="flex-1 relative">
              <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
                {['1M', '5M', '15M', '1H', '4H', '1D'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTimeframe(t)}
                    className={`px-3 py-1.5 min-w-[44px] text-[10px] font-bold rounded-sm border transition-colors ${t === activeTimeframe ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <TradingChart data={candles} />
            </div>
            
            {/* Depth Chart Integration */}
            <div className="h-24 border-t border-terminal-border">
               <DepthChart bids={orderBook.bids} asks={orderBook.asks} />
            </div>
          </div>

          {/* Positions Table */}
          <div className="h-60 border-t border-terminal-border p-4 bg-black">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Positions</h3>
              <div className="flex gap-4 font-mono text-[10px]">
                <div className="flex gap-2">
                  <span className="text-zinc-600">Total PnL:</span>
                  <span className="text-terminal-green">+$4,124.50</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-zinc-600">Margin Level:</span>
                  <span className="text-white">1,245%</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="text-zinc-600 border-b border-terminal-border">
                    <th className="pb-2 font-normal">Asset</th>
                    <th className="pb-2 font-normal">Type</th>
                    <th className="pb-2 font-normal">Size</th>
                    <th className="pb-2 font-normal">Entry</th>
                    <th className="pb-2 font-normal">Mark</th>
                    <th className="pb-2 font-normal text-right">PnL (u)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-terminal-border">
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white font-bold">BTC/USD</td>
                    <td className="py-3 text-terminal-green font-bold">LONG 10x</td>
                    <td className="py-3 text-zinc-300">0.452</td>
                    <td className="py-3 text-zinc-500">63,850.00</td>
                    <td className="py-3 text-zinc-500">64,240.20</td>
                    <td className="py-3 text-right">
                      <span className="bg-terminal-green/10 text-terminal-green px-2 py-1 rounded border border-terminal-green/20 font-bold">
                        +$412.50
                      </span>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white font-bold">ETH/USD</td>
                    <td className="py-3 text-terminal-red font-bold">SHORT 5x</td>
                    <td className="py-3 text-zinc-300">12.00</td>
                    <td className="py-3 text-zinc-500">3,120.40</td>
                    <td className="py-3 text-zinc-500">3,124.10</td>
                    <td className="py-3 text-right">
                      <span className="bg-terminal-red/10 text-terminal-red px-2 py-1 rounded border border-terminal-red/20 font-bold">
                        -$120.60
                      </span>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white font-bold">SOL/USD</td>
                    <td className="py-3 text-terminal-green font-bold">LONG 20x</td>
                    <td className="py-3 text-zinc-300">1,250</td>
                    <td className="py-3 text-zinc-500">142.10</td>
                    <td className="py-3 text-zinc-500">145.65</td>
                    <td className="py-3 text-right">
                      <span className="bg-terminal-green/10 text-terminal-green px-2 py-1 rounded border border-terminal-green/20 font-bold">
                        +$3,832.60
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right: History & Execution */}
        <section className="col-span-3 bg-black flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <ControlPanel selectedAsset={selectedAsset} price={ticker.price} />
          </div>
          
          <div className="h-[280px] border-t border-terminal-border flex flex-col bg-black">
            <div className="p-3 border-b border-terminal-border">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Recent Trades</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <TradeHistory history={history} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-6 bg-terminal-green text-black flex items-center px-4 justify-between text-[9px] font-black uppercase tracking-widest shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)]"></div>
            Session: Active (v4.2.1-STB)
          </span>
          <span>Node: US-EAST-CLOUDRUN</span>
        </div>
        <div className="flex gap-6">
          <span>Real-time Stream: 12.4kb/s</span>
          <span className="flex items-center gap-1">
             Sync Integrity: <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
          </span>
        </div>
      </footer>
    </div>
  );
}

// Internal icon import for footer
import { ShieldCheck } from 'lucide-react';


