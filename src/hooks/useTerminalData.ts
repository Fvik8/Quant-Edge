```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  LayoutDashboard, 
  History, 
  Settings, 
  User,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

// Дефиниране на типове за активите
interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
}

export default function TradingTerminal() {
  // Състояние за активите и демо сметката
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: 2.4, volume: '32.1B' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.25, change24h: -1.2, volume: '15.4B' },
    { id: '3', symbol: 'SOL', name: 'Solana', price: 145.10, change24h: 5.8, volume: '4.2B' },
    { id: '4', symbol: 'BNB', name: 'Binance Coin', price: 580.40, change24h: 0.5, volume: '1.8B' },
    { id: '5', symbol: 'XRP', name: 'Ripple', price: 0.52, change24h: -0.8, volume: '1.2B' },
  ]);

  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets);
  const [demoBalance, setDemoBalance] = useState<number>(100000.00); 
  const [isDemo, setIsDemo] = useState<boolean>(true);

  // Симулация на обновяване на цените всяка секунда (WebSocket Logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          const volatility = 0.0005; // 0.05% вариация за реализъм
          const change = (Math.random() - 0.5) * (asset.price * volatility);
          const newPrice = asset.price + change;
          return {
            ...asset,
            price: Number(newPrice.toFixed(2)),
            change24h: Number((asset.change24h + (Math.random() - 0.5) * 0.02).toFixed(2))
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Синхронизиране на избрания актив при обновяване на цените
  useEffect(() => {
    const updated = assets.find(a => a.id === selectedAsset.id);
    if (updated) setSelectedAsset(updated);
  }, [assets]);

  return (
    <div className="h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 overflow-hidden select-none">
      {/* Premium Header - Apple Design Principles: Hierarchy & Harmony */}
      <header className="h-14 border-b border-zinc-800/50 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <TrendingUp className="text-black w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase italic">Nova<span className="text-emerald-500">Trade</span></span>
          </div>
          
          <div className="h-6 w-px bg-zinc-800"></div>
          
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold text-zinc-400">
            <button className="text-white bg-zinc-800/50 px-3 py-1 rounded-md flex items-center gap-2 transition-all">
              <LayoutDashboard size={14} className="text-emerald-500" /> Терминал
            </button>
            <button className="hover:text-zinc-200 flex items-center gap-2 transition-colors">
              <History size={14} /> Портфолио
            </button>
            <button className="hover:text-zinc-200 flex items-center gap-2 transition-colors">
              <Wallet size={14} /> Депозит
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Account Indicator */}
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-1 gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-tighter leading-none">Демо Сметка</span>
              <span className="text-sm font-mono font-bold text-emerald-400 tracking-tight">
                ${demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button 
              onClick={() => setIsDemo(!isDemo)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-2 py-1 rounded text-[10px] font-black uppercase transition-all shadow-lg"
            >
              Real
            </button>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 rounded-lg border border-zinc-800/50">
              <Settings size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-emerald-500/50 transition-all overflow-hidden group">
              <User size={18} className="text-zinc-400 group-hover:text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Terminal Grid System */}
      <main className="flex-1 grid grid-cols-12 gap-1 p-1 overflow-hidden bg-[#0A0A0A]">
        
        {/* Left Sidebar: Assets & Markets */}
        <aside className="col-span-12 lg:col-span-3 bg-black/40 rounded-xl border border-zinc-800/30 flex flex-col overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-zinc-800/50 flex flex-col gap-4 bg-gradient-to-b from-zinc-900/20 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Пазарни Котировки</h2>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Live</span>
              </div>
            </div>
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Търси актив (BTC, ETH...)" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`w-full p-4 flex items-center justify-between border-b border-zinc-900/30 transition-all hover:bg-zinc-900/30 group ${
                  selectedAsset.id === asset.id ? 'bg-zinc-900/60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-[11px] border transition-all ${
                    asset.change24h >= 0 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500/20' 
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500 group-hover:bg-rose-500/20'
                  }`}>
                    {asset.symbol.substring(0, 3)}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{asset.symbol}/USD</div>
                    <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-zinc-100 tracking-tight">
                    {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${
                    asset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {asset.change24h >= 0 ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                    {Math.abs(asset.change24h).toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Trading Canvas Placeholder for Part 2 */}
        <section id="terminal-center" className="col-span-12 lg:col-span-6 flex flex-col gap-1 overflow-hidden">
          {/* Контейнер за графиката */}
        </section>

        {/* Right: Order Execution Placeholder for Part 2 */}
        <aside id="terminal-right" className="col-span-12 lg:col-span-3 flex flex-col gap-1 overflow-hidden">
          {/* Контейнер за поръчките */}
        </aside>

      </main>
    </div>
  );
}
```
