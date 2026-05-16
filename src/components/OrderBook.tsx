import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../hooks/useTerminalData';

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
}

const OrderRow: React.FC<{ order: Order; maxTotal: number; colorClass: string; blinkClass: string }> = ({ 
  order, maxTotal, colorClass, blinkClass 
}) => {
  const [blink, setBlink] = useState('');
  const lastSize = useRef(order.size);

  useEffect(() => {
    if (order.size !== lastSize.current) {
      setBlink(blinkClass);
      const timer = setTimeout(() => setBlink(''), 500);
      lastSize.current = order.size;
      return () => clearTimeout(timer);
    }
  }, [order.size, blinkClass]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative grid grid-cols-3 px-3 py-[1px] transition-colors cursor-default group ${colorClass} ${blink}`}
    >
      <div 
        className={`absolute inset-y-0 right-0 opacity-10 transition-all duration-300 pointer-events-none ${colorClass === 'text-terminal-red' ? 'bg-terminal-red' : 'bg-terminal-green'}`}
        style={{ width: `${(order.total / maxTotal) * 100}%` }}
      />
      <span className="font-mono font-bold relative z-10">{order.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
      <span className="text-right text-zinc-300 font-mono relative z-10">{order.size.toFixed(4)}</span>
      <span className="text-right text-zinc-500 font-mono relative z-10">{order.total.toFixed(2)}</span>
    </motion.div>
  );
};

export const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  const midPrice = bids.length > 0 && asks.length > 0 ? (bids[0].price + asks[asks.length-1].price) / 2 : 0;
  const lastMidPrice = useRef(midPrice);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (midPrice > lastMidPrice.current) setPriceDirection('up');
    else if (midPrice < lastMidPrice.current) setPriceDirection('down');
    lastMidPrice.current = midPrice;
  }, [midPrice]);

  return (
    <div className="flex flex-col h-full bg-terminal-bg font-mono text-[11px] select-none tabular-nums">
      <div className="grid grid-cols-3 px-3 py-2 text-zinc-500 uppercase text-[9px] font-black tracking-widest border-b border-terminal-border bg-terminal-surface/10">
        <span>Price (USD)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sells) */}
        <div className="flex-1 flex flex-col-reverse overflow-hidden py-1">
          {asks.slice(0, 16).map((order) => (
            <OrderRow 
              key={order.id} 
              order={order} 
              maxTotal={maxTotal} 
              colorClass="text-terminal-red" 
              blinkClass="blink-red" 
            />
          ))}
        </div>

        {/* Mid Price / Spread */}
        <div className="py-3 border-y border-terminal-border text-center bg-terminal-surface/40">
          <div className="flex items-center justify-center gap-2">
             <span className={`text-lg font-black tracking-tight tabular-nums transition-colors ${priceDirection === 'up' ? 'text-terminal-green' : priceDirection === 'down' ? 'text-terminal-red' : 'text-white'}`}>
               {midPrice.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
             </span>
             {priceDirection && (
               <span className={`text-[10px] font-black ${priceDirection === 'up' ? 'text-terminal-green' : 'text-terminal-red'}`}>
                 {priceDirection === 'up' ? '↑' : '↓'}
               </span>
             )}
          </div>
          <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">
            Spread: <span className="text-zinc-400">{(asks[asks.length-1]?.price - bids[0]?.price).toFixed(4)}</span>
          </div>
        </div>

        {/* Bids (Buys) */}
        <div className="flex-1 overflow-hidden py-1">
          {bids.slice(0, 16).map((order) => (
            <OrderRow 
              key={order.id} 
              order={order} 
              maxTotal={maxTotal} 
              colorClass="text-terminal-green" 
              blinkClass="blink-green" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
