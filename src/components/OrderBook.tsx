```tsx
import React from 'react';

export const OrderBook: React.FC = () => {
  const asks = Array.from({ length: 12 }, (_, i) => ({ price: 64250 + i * 5, size: (Math.random() * 2).toFixed(3), total: (Math.random() * 10).toFixed(1) }));
  const bids = Array.from({ length: 12 }, (_, i) => ({ price: 64245 - i * 5, size: (Math.random() * 2).toFixed(3), total: (Math.random() * 10).toFixed(1) }));

  return (
    <div className="flex-1 bg-black rounded-xl border border-zinc-800/30 flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="p-3 border-b border-zinc-800/50 bg-zinc-900/20">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Книга с поръчки (Live)</h2>
      </div>
      
      <div className="flex-1 grid grid-rows-2 text-[11px] font-mono">
        {/* Asks (Sell Orders) */}
        <div className="flex flex-col-reverse overflow-hidden px-3">
          {asks.map((order, i) => (
            <div key={i} className="flex justify-between py-0.5 relative group">
              <div className="absolute inset-0 bg-rose-500/5 origin-right transition-all" style={{ width: `${Math.random() * 100}%` }}></div>
              <span className="text-rose-400 font-bold z-10">{order.price.toLocaleString()}</span>
              <span className="text-zinc-400 z-10">{order.size}</span>
              <span className="text-zinc-600 z-10">{order.total}</span>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="py-2 bg-zinc-900/40 border-y border-zinc-800/50 flex items-center justify-center gap-4">
          <span className="text-zinc-100 font-bold">64,247.50</span>
          <span className="text-[10px] text-zinc-500 font-medium">Spread: 2.50 (0.01%)</span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex flex-col overflow-hidden px-3">
          {bids.map((order, i) => (
            <div key={i} className="flex justify-between py-0.5 relative">
              <div className="absolute inset-0 bg-emerald-500/5 origin-left transition-all" style={{ width: `${Math.random() * 100}%` }}></div>
              <span className="text-emerald-400 font-bold z-10">{order.price.toLocaleString()}</span>
              <span className="text-zinc-400 z-10">{order.size}</span>
              <span className="text-zinc-600 z-10">{order.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```
