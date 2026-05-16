import React from 'react';
import { Lock, Unlock, ChevronDown } from 'lucide-react';
import { Asset } from '../hooks/useTerminalData';

interface StatsHeaderProps {
  ticker: Asset;
  assets: Asset[];
  selectedAsset: string;
  onAssetChange: (symbol: string) => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ ticker, assets, selectedAsset, onAssetChange }) => {
  const [activeTab, setActiveTab] = React.useState('Terminal');
  const [isLocked, setIsLocked] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-black border-b border-terminal-border shrink-0">
      <header className="h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-terminal-green rounded-full shadow-[0_0_8px_rgba(0,255,65,0.4)]"></div>
            <span className="font-bold tracking-tighter text-xl">QUANT<span className="text-terminal-green">EDGE</span></span>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-600 transition-colors">
              <span className="text-[12px] font-bold text-white font-mono">{selectedAsset}/USD</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-950 border border-zinc-800 rounded shadow-xl z-50 hidden group-hover:block">
              {assets.map(asset => (
                <button
                  key={asset.symbol}
                  onClick={() => onAssetChange(asset.symbol)}
                  className={`w-full text-left px-3 py-2 text-[11px] font-mono hover:bg-zinc-900 transition-colors flex justify-between items-center ${selectedAsset === asset.symbol ? 'text-terminal-green' : 'text-zinc-400'}`}
                >
                  <span>{asset.symbol}/USD</span>
                  <span className={asset.change >= 0 ? "text-terminal-green" : "text-terminal-red"}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest h-full">
            {['Terminal', 'Portfolio', 'Analytics', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 transition-all border-b-2 ${
                  activeTab === tab ? 'text-white border-white' : 'border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded">
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-1.5 transition-colors ${isLocked ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
            >
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span className="uppercase font-bold tracking-tighter">Layout</span>
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-zinc-600 uppercase font-bold tracking-tighter">Last Update</span>
            <span className="text-white tabular-nums">{lastUpdate}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-600 uppercase font-bold tracking-tighter">Latency</span>
            <span className="text-terminal-green">0.42ms</span>
          </div>
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-zinc-600 uppercase font-bold tracking-tighter">Connection</span>
            <span className="text-terminal-green">STABLE / QUANT-LINK</span>
          </div>
        </div>
      </header>

      {/* Ticker Stats Bar */}
      <div className="h-10 border-t border-terminal-border flex items-center px-4 gap-8 bg-zinc-950/50">
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">Price</span>
          <span className={`text-[12px] font-bold font-mono leading-none ${ticker.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
            {ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">Index Price</span>
          <span className="text-[12px] text-white font-bold font-mono leading-none">
            {(ticker.price * 1.0001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">24h Change</span>
          <span className={`text-[12px] font-bold font-mono leading-none ${ticker.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
            {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%
          </span>
        </div>
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">24h High</span>
          <span className="text-[12px] text-white font-bold font-mono leading-none">
            {ticker.high.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">24h Low</span>
          <span className="text-[12px] text-white font-bold font-mono leading-none">
            {ticker.low.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col min-w-[120px]">
          <span className="text-[9px] text-zinc-600 uppercase font-bold leading-none mb-0.5 tracking-widest">24h Volume ({ticker.symbol})</span>
          <span className="text-[12px] text-white font-bold font-mono leading-none">
            {ticker.volume.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
        </div>
      </div>
    </div>
  );
};

