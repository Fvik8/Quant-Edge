import React, { useMemo } from 'react';

export const TradeHistory: React.FC = () => {
  // Генериране на симулирани исторически данни
  const trades = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      price: (64240 + Math.random() * 20).toFixed(2),
      amount: (Math.random() * 0.5).toFixed(4),
      time: new Date(Date.now() - i * 3000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      side: Math.random() > 0.5 ? 'buy' : 'sell'
    }));
  }, []);

  return (
    <div className="flex-1 bg-black rounded-xl border border-zinc-800/30 flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="p-3 border-b border-zinc-800/50 bg-zinc-900/20">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">История на пазара</h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="text-zinc-600 text-left">
              <th className="pb-2 font-medium">Цена</th>
              <th className="pb-2 font-medium text-right">Размер</th>
              <th className="pb-2 font-medium text-right">Час</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="group hover:bg-zinc-900/40 transition-colors">
                <td className={`py-1 font-bold ${trade.side === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {Number(trade.price).toLocaleString()}
                </td>
                <td className="py-1 text-right text-zinc-300 font-medium">{trade.amount}</td>
                <td className="py-1 text-right text-zinc-600">{trade.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
