import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';

export const TradePanel: React.FC = () => {
  const [amount, setAmount] = useState('1000');
  
  return (
    <div className="h-[45%] bg-black rounded-xl border border-zinc-800/30 p-4 flex flex-col gap-4 backdrop-blur-sm shadow-2xl shadow-emerald-500/5">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Изпълнение</h2>
        <Info size={14} className="text-zinc-700" />
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
        <button className="flex-1 py-2 rounded-md bg-emerald-500 text-black text-xs font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20">Купи</button>
        <button className="flex-1 py-2 rounded-md hover:bg-zinc-800 text-zinc-500 text-xs font-bold uppercase transition-all">Продай</button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Сума (USD)</label>
          <div className="relative group">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600">MAX</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['25%', '50%', '75%', '100%'].map(p => (
            <button key={p} className="py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">{p}</button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-4 border-t border-zinc-800/50">
        <div className="flex justify-between text-[11px] font-medium text-zinc-500">
          <span>Маржин баланс</span>
          <span className="text-zinc-200 font-mono font-bold">$100,000.00</span>
        </div>
        <div className="flex justify-between text-[11px] font-medium text-zinc-500">
          <span>Прогнозна такса</span>
          <span className="text-zinc-200 font-mono font-bold">$0.00</span>
        </div>
        
        <button className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/10">
          Отвори Позиция
        </button>
      </div>
    </div>
  );
};
