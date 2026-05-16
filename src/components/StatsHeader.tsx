import React from 'react';
import { Lock, Unlock, ChevronDown, ShieldCheck } from 'lucide-react';
import { Asset } from '../hooks/useTerminalData';
import { cn } from '../lib/utils';

interface StatsHeaderProps {
  ticker: Asset;
  assets: Asset[];
  selectedAsset: string;
  onAssetChange: (symbol: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDemoMode: boolean;
  onDemoModeToggle: (on: boolean) => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ 
  ticker, 
  assets, 
  selectedAsset, 
  onAssetChange,
  activeTab,
  onTabChange,
  isDemoMode,
  onDemoModeToggle
}) => {
  const lastUpdate = React.useRef(new Date().toLocaleTimeString());
  const [currentTime, setCurrentTime] = React.useState(lastUpdate.current);
  const [priceFlash, setPriceFlash] = React.useState('');
  const lastPrice = React.useRef(ticker.price);

  React.useEffect(() => {
    if (ticker.price > lastPrice.current) {
      setPriceFlash('blink-green');
      const timer = setTimeout(() => setPriceFlash(''), 500);
      lastPrice.current = ticker.price;
      return () => clearTimeout(timer);
    } else if (ticker.price < lastPrice.current) {
      setPriceFlash('blink-red');
      const timer = setTimeout(() => setPriceFlash(''), 500);
      lastPrice.current = ticker.price;
      return () => clearTimeout(timer);
    }
  }, [ticker.price]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-terminal-bg border-b border-terminal-border shrink-0 select-none">
      <header className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-terminal-green rounded-full shadow-[0_0_12px_rgba(0,255,65,0.5)] animate-pulse"></div>
            <span className="font-sans font-black tracking-tighter text-2xl text-white">QUANT<span className="text-terminal-green italic">EDGE</span></span>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-1.5 bg-terminal-surface border border-terminal-border hover:border-zinc-500 transition-all active:scale-95 group">
              <span className="text-[12px] font-black text-white font-mono tracking-tight">{selectedAsset}/USD</span>
              <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-terminal-bg border border-terminal-border shadow-[10px_10px_30px_rgba(0,0,0,0.5)] z-[100] hidden group-hover:block backdrop-blur-md">
              {assets.map(asset => (
                <button
                  key={asset.symbol}
                  onClick={() => onAssetChange(asset.symbol)}
                  className={`w-full text-left px-4 py-3 text-[11px] font-mono hover:bg-terminal-surface transition-all flex justify-between items-center group/item ${selectedAsset === asset.symbol ? 'text-terminal-green bg-terminal-surface/30' : 'text-zinc-500 hover:text-zinc-200'}`}
                >
                  <span className="font-black tracking-tight">{asset.symbol}/USD</span>
                  <span className={cn(
                    "font-bold",
                    asset.change >= 0 ? "text-terminal-green" : "text-terminal-red"
                  )}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <nav className="hidden xl:flex gap-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] h-full items-center">
            {['Terminal', 'Portfolio', 'Markets', 'Stats'].map(tab => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`transition-all py-1 border-b-2 hover:text-white ${
                  activeTab === tab ? 'text-white border-white' : 'border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
            
            <div className="h-6 w-px bg-terminal-border/40 mx-4" />
            
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${!isDemoMode ? 'text-zinc-500' : 'text-zinc-700'}`}>Demo</span>
              <button 
                onClick={() => onDemoModeToggle(!isDemoMode)}
                className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative ${isDemoMode ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-zinc-800 border border-zinc-700'}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${isDemoMode ? 'translate-x-5 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'translate-x-0 bg-zinc-600'}`} />
              </button>
              {isDemoMode && (
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-sm animate-pulse-slow">
                   <div className="w-1 h-1 rounded-full bg-yellow-500" />
                   <span className="text-[8px] text-yellow-500 font-black uppercase tracking-[0.2em]">Virtual Trading</span>
                </div>
              )}
              {!isDemoMode && (
                <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-sm opacity-50">
                   <div className="w-1 h-1 rounded-full bg-zinc-500" />
                   <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Live Mode (Locked)</span>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-10 text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] opacity-40 leading-none mb-1">System Time</span>
            <span className="text-white font-mono font-black tabular-nums tracking-tighter">{currentTime}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-40 leading-none mb-1">Latency</span>
            <span className="text-terminal-green font-mono font-black tracking-tighter">0.14ms</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-terminal-surface/50 border border-terminal-border">
             <div className="flex flex-col items-end">
                <span className="text-[8px] opacity-40 leading-none mb-0.5">Cloud Mesh</span>
                <span className="text-terminal-green font-black">ENCRYPTED</span>
             </div>
             <ShieldCheck className="w-4 h-4 text-terminal-green" />
          </div>
        </div>
      </header>

      {/* Institutional Stats Strip */}
      <div className="h-12 border-t border-terminal-border flex items-center px-6 gap-12 bg-terminal-surface/10 overflow-x-auto scrollbar-hide">
        <div className="flex flex-col min-w-[120px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">Index Price</span>
          <span className={cn(
            "text-[13px] font-black font-mono leading-none tracking-tighter transition-colors duration-300",
            ticker.change >= 0 ? "text-terminal-green" : "text-terminal-red",
            priceFlash
          )}>
            {ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="h-6 w-px bg-terminal-border self-center" />
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">Mark Price</span>
          <span className="text-[13px] text-white font-black font-mono leading-none tracking-tighter">
            {(ticker.price * 1.00008).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">24h Change</span>
          <span className={`text-[13px] font-black font-mono leading-none tracking-tighter ${ticker.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
            {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%
          </span>
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">24h High</span>
          <span className="text-[13px] text-zinc-200 font-black font-mono leading-none tracking-tighter">
            {ticker.high.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">24h Low</span>
          <span className="text-[13px] text-zinc-200 font-black font-mono leading-none tracking-tighter">
            {ticker.low.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col min-w-[140px]">
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-none mb-1">24h Volume ({ticker.symbol})</span>
          <span className="text-[13px] text-white font-black font-mono leading-none tracking-tighter">
            {ticker.volume.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
        </div>
      </div>
    </div>
  );
};

