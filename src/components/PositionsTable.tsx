import React from 'react';
import { XCircle, ExternalLink } from 'lucide-react';

export const PositionsTable: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800/50">
              <th className="px-4 py-3 font-bold">Актив</th>
              <th className="px-4 py-3 font-bold">Тип</th>
              <th className="px-4 py-3 font-bold text-right">Размер</th>
              <th className="px-4 py-3 font-bold text-right">Входна цена</th>
              <th className="px-4 py-3 font-bold text-right">Маржин</th>
              <th className="px-4 py-3 font-bold text-right">PNL (USD)</th>
              <th className="px-4 py-3 font-bold text-center">Действие</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            <tr className="border-b border-zinc-900/50 group hover:bg-zinc-900/30">
              <td className="px-4 py-4 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                BTC/USD
              </td>
              <td className="px-4 py-4"><span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">LONG</span></td>
              <td className="px-4 py-4 text-right font-mono font-bold">0.1500</td>
              <td className="px-4 py-4 text-right font-mono text-zinc-400">63,120.00</td>
              <td className="px-4 py-4 text-right font-mono text-zinc-400">$450.00</td>
              <td className="px-4 py-4 text-right font-mono font-bold text-emerald-500">+$145.20</td>
              <td className="px-4 py-4 text-center">
                <button className="text-zinc-600 hover:text-rose-500 transition-colors">
                  <XCircle size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Празно състояние, ако няма позиции */}
      <div className="hidden flex-1 flex flex-col items-center justify-center opacity-20">
         <ExternalLink size={40} className="mb-2" />
         <p className="text-sm font-medium uppercase tracking-widest">Няма активни позиции</p>
      </div>
    </div>
  );
};
