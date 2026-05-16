import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { TradingChart } from './components/TradingChart';
import { OrderBook } from './components/OrderBook';
import { TradePanel } from './components/TradePanel';
import { TradeHistory } from './components/TradeHistory';
import { PositionsTable } from './components/PositionsTable';

// Интерфейс за основния контейнер
export default function TradingTerminal() {
  const [selectedAsset, setSelectedAsset] = useState({
    id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: 2.4
  });

  return (
    <div className="h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Header - (Използвайте кода от Част 1 тук) */}
      
      <main className="flex-1 grid grid-cols-12 gap-1 p-1 overflow-hidden bg-[#0A0A0A]">
        
        {/* Left Sidebar: Assets & Market Depth (3 cols) */}
        <aside className="col-span-3 flex flex-col gap-1 overflow-hidden">
           {/* Assets List Component (От Част 1) */}
           <OrderBook />
        </aside>

        {/* Center: Main Canvas (6 cols) */}
        <section className="col-span-6 flex flex-col gap-1 overflow-hidden">
          <TradingChart asset={selectedAsset} />
          
          {/* Bottom Bento Box: Portfolio & Positions */}
          <div className="h-1/3 bg-black rounded-xl border border-zinc-800/30 overflow-hidden flex flex-col backdrop-blur-sm shadow-inner">
            <div className="px-4 py-2 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/10">
               <div className="flex gap-6">
                 <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b-2 border-emerald-500 pb-2 translate-y-[9px]">Позиции (1)</button>
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pb-2">Чакащи поръчки (0)</button>
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pb-2">Активи</button>
               </div>
            </div>
            <PositionsTable />
          </div>
        </section>

        {/* Right Sidebar: Trade & History (3 cols) */}
        <aside className="col-span-3 flex flex-col gap-1 overflow-hidden">
          <TradePanel />
          <TradeHistory />
        </aside>

      </main>

      {/* Footer / Status Bar */}
      <footer className="h-7 bg-black border-t border-zinc-800/50 px-4 flex items-center justify-between text-[10px] text-zinc-600 font-bold tracking-tighter uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="fill-emerald-500 text-emerald-500" />
            <span className="text-zinc-400">Свързаност:</span>
            <span className="text-emerald-500">Отлична (12ms)</span>
          </div>
          <div className="h-3 w-px bg-zinc-800"></div>
          <div>API Status: <span className="text-emerald-500">Online</span></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Криптирана Връзка (AES-256)</span>
          </div>
          <span>© 2026 NovaTrade Professional</span>
        </div>
      </footer>
    </div>
  );
}
