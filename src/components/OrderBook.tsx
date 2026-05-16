import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../hooks/useTerminalData';

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
}

export const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  return (
    <div className="flex flex-col h-full bg-black font-mono text-[11px]">
      <div className="grid grid-cols-3 px-3 py-2 text-zinc-600 uppercase text-[9px] font-bold border-b border-terminal-border">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sells) */}
        <div className="flex-1 flex flex-col-reverse overflow-hidden px-1 py-1">
          <AnimatePresence initial={false}>
            {asks.slice(0, 15).map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-3 p-1 text-terminal-red hover:bg-terminal-red/5 transition-colors cursor-default"
              >
                <span className="font-bold">{order.price.toFixed(2)}</span>
                <span className="text-right text-white">{order.size.toFixed(3)}</span>
                <span className="text-right text-zinc-500">{order.total.toFixed(2)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mid Price / Spread */}
        <div className="my-2 py-3 border-y border-terminal-border text-center bg-terminal-surface/50">
          <span className="text-xl font-bold tracking-tight text-white">64,203.75</span>
          <span className="text-[10px] text-terminal-green ml-2 font-bold uppercase tracking-widest">Spread: 0.75</span>
        </div>

        {/* Bids (Buys) */}
        <div className="flex-1 overflow-hidden px-1 py-1">
          <AnimatePresence initial={false}>
            {bids.slice(0, 15).map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-3 p-1 text-terminal-green hover:bg-terminal-green/5 transition-colors cursor-default"
              >
                <span className="font-bold">{order.price.toFixed(2)}</span>
                <span className="text-right text-white">{order.size.toFixed(3)}</span>
                <span className="text-right text-zinc-500">{order.total.toFixed(2)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
