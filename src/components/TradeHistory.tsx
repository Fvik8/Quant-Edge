import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TradeHistoryProps {
  history: any[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ history }) => {
  return (
    <div className="flex flex-col h-full bg-terminal-bg font-mono text-[11px] select-none tabular-nums">
      <div className="grid grid-cols-3 px-3 py-2 text-zinc-500 uppercase text-[9px] font-bold border-b border-terminal-border bg-terminal-surface/10">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      <div className="flex-1 overflow-y-auto px-1 py-1 scrollbar-hide">
        <AnimatePresence initial={false}>
          {history.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 p-1.5 hover:bg-terminal-surface/40 transition-colors border-b border-white/[0.02]"
            >
              <span className={cn(
                "font-black tracking-tight font-mono",
                trade.type === 'buy' ? "text-terminal-green" : "text-terminal-red"
              )}>
                {trade.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              </span>
              <span className="text-right text-zinc-300 font-mono font-black tabular-nums">
                {trade.size.toFixed(4)}
              </span>
              <span className="text-right text-zinc-600 text-[10px] font-mono font-black tabular-nums">
                {trade.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Internal utility since I haven't written the file yet in this parallel block
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
