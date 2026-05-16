import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Zap, Settings2 } from 'lucide-react';

interface ControlPanelProps {
  selectedAsset: string;
  price: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ selectedAsset, price }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0.100');
  const [orderType, setOrderType] = useState('Limit Order');
  const [isExecuting, setIsExecuting] = useState(false);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [leverage, setLeverage] = useState(1);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      alert(`${side.toUpperCase()} Order Executed: ${amount} ${selectedAsset} at ${orderType} with ${leverage}x Leverage`);
    }, 600);
  };

  const setPercentage = (p: number) => {
    const max = 1.45;
    setAmount((max * p).toFixed(3));
  };

  return (
    <div className="p-4 flex flex-col h-full bg-black overflow-y-auto">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter transition-all ${
            side === 'buy' ? 'bg-terminal-green text-black' : 'bg-terminal-border text-zinc-400'
          }`}
        >
          Buy / Long
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter transition-all ${
            side === 'sell' ? 'bg-terminal-red text-white' : 'bg-terminal-border text-zinc-400'
          }`}
        >
          Sell / Short
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {/* Order Type */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Order Type</label>
          <select 
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs flex justify-between items-center cursor-pointer hover:border-zinc-700 transition-colors text-white outline-none appearance-none"
          >
            <option>Market Order</option>
            <option>Limit Order</option>
            <option>Stop Loss</option>
            <option>Take Profit</option>
          </select>
        </div>

        {/* Leverage Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Leverage</label>
            <span className="text-xs font-mono text-terminal-green font-bold">{leverage}x</span>
          </div>
          <input 
            type="range"
            min="1"
            max="100"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-terminal-green"
          />
          <div className="flex justify-between text-[8px] text-zinc-600 font-mono">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>100x</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Size ({selectedAsset})</label>
            <span className="text-[9px] text-zinc-600 font-mono">USD ≈ {(parseFloat(amount || '0') * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <input 
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs font-mono text-right text-white focus:border-terminal-green outline-none transition-colors"
          />
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[0.25, 0.5, 0.75, 1].map(p => (
              <button 
                key={p} 
                onClick={() => setPercentage(p)}
                className="bg-zinc-900 hover:bg-zinc-800 py-1.5 text-[9px] font-bold font-mono text-zinc-500 transition-colors uppercase"
              >
                {p === 1 ? 'Max' : `${p * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* TP / SL Advanced Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Take Profit</label>
            <input 
              type="text"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="72,000.00"
              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs font-mono text-right text-white focus:border-terminal-green outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Stop Loss</label>
            <input 
              type="text"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="62,000.00"
              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs font-mono text-right text-white focus:border-terminal-red outline-none transition-colors"
            />
          </div>
        </div>

        {/* Account Context */}
        <div className="pt-4 border-t border-terminal-border space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-500">Available Balance:</span>
            <span className="text-white">$1,245,902.12</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-500">Margin Used:</span>
            <span className="text-zinc-300">$45,101.50</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-500">Est. Liquidation Price:</span>
            <span className="text-terminal-red">54,120.45</span>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <button 
          onClick={handleExecute}
          disabled={isExecuting}
          className={`w-full py-4 text-black font-black uppercase tracking-widest text-sm transition-all transform active:scale-[0.98] ${
            isExecuting ? 'bg-zinc-500 animate-pulse cursor-not-allowed' : 'bg-white hover:bg-terminal-green'
          }`}
        >
          {isExecuting ? 'Processing...' : 'Execute Trade'}
        </button>
      </div>
    </div>
  );
};
