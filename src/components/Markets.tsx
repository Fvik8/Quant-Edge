import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, Globe, Zap } from 'lucide-react';

interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
}

const MOCK_MARKETS: MarketAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 64203.50, change: 2.45, volume: '42.1B' },
  { symbol: 'ETH', name: 'Ethereum', price: 3120.40, change: -1.20, volume: '18.5B' },
  { symbol: 'SOL', name: 'Solana', price: 142.25, change: 8.32, volume: '5.2B' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.15, change: -0.45, volume: '1.1B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.452, change: 1.12, volume: '0.8B' },
  { symbol: 'LINK', name: 'Chainlink', price: 14.85, change: 4.20, volume: '1.4B' },
  { symbol: 'AVAX', name: 'Avalanche', price: 34.12, change: -2.15, volume: '0.9B' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.72, change: 0.85, volume: '0.6B' },
];

interface MarketsProps {
  onTrade: (symbol: string) => void;
}

export const Markets: React.FC<MarketsProps> = ({ onTrade }) => {
  const [search, setSearch] = useState('');

  const filteredMarkets = useMemo(() => {
    return MOCK_MARKETS.filter(m => 
      m.symbol.toLowerCase().includes(search.toLowerCase()) || 
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const topGainers = useMemo(() => {
    return [...MOCK_MARKETS].sort((a, b) => b.change - a.change).slice(0, 3);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#09090b] overflow-hidden">
      {/* Markets Header */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-2">Global Markets</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Live cross-exchange data feed activated
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-terminal-green" />
            <input 
              type="text" 
              placeholder="Filter assets (e.g. BTC, ETH...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121216] border border-zinc-900 rounded-sm py-3 pl-12 pr-4 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-zinc-700 transition-all uppercase tracking-widest focus:bg-[#1a1a21]"
            />
          </div>
        </div>

        {/* Top Gainers Row */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 mr-4">
            <Zap className="w-3 h-3 text-terminal-green" />
            Top Movers:
          </div>
          {topGainers.map((asset) => (
            <div key={asset.symbol} className="px-4 py-2 bg-terminal-surface/20 border border-terminal-border rounded-sm flex items-center gap-3 hover:bg-terminal-surface/40 transition-colors cursor-pointer group">
              <span className="text-zinc-300 font-black">{asset.symbol}</span>
              <span className="text-terminal-green font-mono font-black tabular-nums">+{asset.change}%</span>
              <ArrowUpRight className="w-3 h-3 text-terminal-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* Markets Table */}
      <div className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#09090b] z-10">
            <tr className="text-zinc-600 border-b border-zinc-900">
              <th className="py-4 font-black uppercase tracking-widest text-[10px]">Asset Name</th>
              <th className="py-4 font-black uppercase tracking-widest text-[10px]">Current Price</th>
              <th className="py-4 font-black uppercase tracking-widest text-[10px]">24h Change</th>
              <th className="py-4 font-black uppercase tracking-widest text-[10px]">24h Volume</th>
              <th className="py-4 font-black uppercase tracking-widest text-[10px] text-zinc-800">Index</th>
              <th className="py-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {filteredMarkets.map((asset) => (
              <tr key={asset.symbol} className="group hover:bg-white/[0.01] transition-colors tabular-nums">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xs text-zinc-400 group-hover:text-white transition-colors">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="text-white font-black text-sm tracking-tight">{asset.symbol}/USDT</div>
                      <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <span className="text-zinc-100 font-mono font-black text-sm">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-6">
                  <div className={`flex items-center gap-1 font-mono font-black tracking-tighter ${asset.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                    {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(asset.change)}%
                  </div>
                </td>
                <td className="py-6 text-zinc-500 font-mono font-bold text-sm">
                  ${asset.volume}
                </td>
                <td className="py-6">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${Math.random() > 0.4 ? 'bg-zinc-800' : 'bg-terminal-green/40'}`} />
                    ))}
                  </div>
                </td>
                <td className="py-6 text-right">
                  <button 
                    onClick={() => onTrade(asset.symbol)}
                    className="px-6 py-2 border border-zinc-800 hover:border-terminal-green text-zinc-600 hover:text-terminal-green font-black uppercase tracking-widest text-[9px] transition-all rounded-sm active:scale-95"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
            {filteredMarkets.length === 0 && (
              <tr>
                <td colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 text-zinc-700">
                    <Search className="w-12 h-12 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Assets Match Query</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
