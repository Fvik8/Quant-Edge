import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TradeHistoryProps {
  history: any[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ history }) => {
  return (
    <div className="flex flex-col h-full bg-black font-mono text-[11px]">
      <div className="grid grid-cols-3 px-3 py-2 text-zinc-600 uppercase text-[9px] font-bold border-b border-terminal-border">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <AnimatePresence initial={false}>
          {history.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 p-1 hover:bg-white/5 transition-colors"
            >
              <span className={cn(
                "font-bold",
                trade.type === 'buy' ? "text-terminal-green" : "text-terminal-red"
              )}>
                {trade.price.toFixed(2)}
              </span>
              <span className="text-right text-white">
                {trade.size.toFixed(3)}
              </span>
              <span className="text-right text-zinc-600 text-[10px]">
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
