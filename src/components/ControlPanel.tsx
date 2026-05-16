import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Zap, Settings2 } from 'lucide-react';

interface ControlPanelProps {
  selectedAsset: string;
  price: number;
  balance: number;
  onOrderPlace: (side: 'buy' | 'sell', amount: string, price: number, leverage: number) => void;
  isDemoMode: boolean;
  onResetBalance: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  selectedAsset, 
  price, 
  balance, 
  onOrderPlace,
  isDemoMode,
  onResetBalance
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0.100');
  const [orderType, setOrderType] = useState('Limit Order');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [leverage, setLeverage] = useState(10); // Default to 10x

  const handleExecute = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setShowToast(true);
      onOrderPlace(side, amount, price, leverage);
      setAmount('');
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const maxAmount = (balance * leverage) / (price || 1);

  const setPercentage = (p: number) => {
    const calcAmount = maxAmount * p;
    setAmount(calcAmount.toFixed(selectedAsset === 'BTC' ? 3 : 2));
  };

  const handleAmountChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <div className={`p-4 flex flex-col h-full bg-terminal-bg overflow-y-auto scrollbar-hide transition-colors duration-500 ${isDemoMode ? 'border-l border-yellow-500/30 ring-1 ring-yellow-500/10' : ''}`}>
      <div className="flex gap-1 bg-terminal-surface p-1 rounded-sm mb-6 border border-terminal-border">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1px] border ${
            side === 'buy' 
              ? 'bg-emerald-500 text-black border-emerald-500' 
              : 'bg-emerald-500/10 text-emerald-500/60 border-emerald-500/20 hover:text-emerald-500 hover:bg-emerald-500/20'
          }`}
        >
          Buy / Long
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1px] border ${
            side === 'sell' 
              ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
              : 'bg-rose-500/10 text-rose-500/60 border-rose-500/20 hover:text-rose-500 hover:bg-rose-500/20'
          }`}
        >
          Sell / Short
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Balance Display */}
        <div className="flex justify-between items-end px-0.5">
          <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-none">Available</label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-300 font-bold tabular-nums">
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
            </span>
            {isDemoMode && (
              <button 
                onClick={onResetBalance}
                className="p-1 hover:bg-zinc-800 rounded-sm text-zinc-600 hover:text-yellow-500 transition-all group"
                title="Reset Virtual Balance"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-active:rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Order Type */}
        <div className="space-y-1.5">
          <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-none">Order Type</label>
          <div className="relative">
            <select 
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-terminal-surface border border-terminal-border p-2.5 text-[11px] font-bold text-white outline-none focus:border-zinc-500 appearance-none transition-colors cursor-pointer"
            >
              <option>Limit Order</option>
              <option>Market Order</option>
              <option>Stop Loss</option>
              <option>Take Profit</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[8px]">▼</div>
          </div>
        </div>

        {/* Leverage Display & Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-0.5">
            <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-none">Leverage</label>
            <span className={`text-[11px] font-mono font-bold ${side === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>{leverage}x</span>
          </div>
          <div className="relative group">
            <input 
              type="range"
              min="1"
              max="100"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-white ${side === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}
            />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-600 font-mono font-bold uppercase px-0.5">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>100x</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-0.5">
            <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-none">Position Size</label>
            <span className="text-[9px] text-zinc-600 font-mono font-bold tabular-nums">Max: {maxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>
          </div>
          <div className="relative group">
            <input 
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-terminal-surface border border-terminal-border p-4 text-[16px] font-mono font-black text-white focus:border-zinc-400 outline-none transition-all text-right pr-20 group-hover:bg-zinc-900/50"
              placeholder="0.00"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
               <span className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Amount</span>
            </div>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400 font-mono font-black uppercase">USDT</span>
          </div>
          <div className="grid grid-cols-4 gap-1 mt-3">
            {[0.25, 0.5, 0.75, 1].map(p => (
              <button 
                key={p} 
                onClick={() => setAmount((maxAmount * p).toFixed(2))}
                className="bg-terminal-surface hover:bg-zinc-800 border border-terminal-border py-2 text-[9px] font-black font-mono text-zinc-600 hover:text-white transition-all uppercase rounded-sm"
              >
                {p * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* TP / SL */}
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-none">Profit Goal</label>
            <input 
              type="text"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Target Price"
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-[11px] font-mono font-bold text-right text-emerald-500/60 placeholder:text-zinc-700 hover:border-zinc-700/50 focus:border-emerald-500/50 outline-none transition-colors"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-none">Security Exit</label>
            <input 
              type="text"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Stop Price"
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-[11px] font-mono font-bold text-right text-rose-500/60 placeholder:text-zinc-700 hover:border-zinc-700/50 focus:border-rose-500/50 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 relative">
        {showToast && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-emerald-500 text-black px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Contract Opened
            </div>
          </div>
        )}
        <button 
          onClick={handleExecute}
          disabled={isExecuting || !amount || parseFloat(amount) <= 0}
          className={`w-full py-4 font-black uppercase tracking-[0.3em] text-xs transition-all transform active:scale-[0.98] border border-transparent shadow-lg text-white ${
            isExecuting 
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed animate-pulse' 
              : !amount || parseFloat(amount) <= 0
                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border-zinc-800'
                : side === 'buy' 
                  ? 'bg-emerald-500 hover:brightness-110 shadow-[0_4px_20px_rgba(16,185,129,0.2)]' 
                  : 'bg-rose-500 hover:brightness-110 shadow-[0_4px_20px_rgba(244,63,94,0.2)]'
          }`}
        >
          {isExecuting ? 'Transmitting...' : `${side === 'buy' ? 'Open Long' : 'Open Short'}`}
        </button>
        <div className="mt-3 flex justify-between text-[8px] text-zinc-600 uppercase font-black tracking-widest">
           <span>No Transaction Fees</span>
           <span>Instant Execution</span>
        </div>
      </div>
    </div>
  );
};
