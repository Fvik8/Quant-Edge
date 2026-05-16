import React, { useMemo } from 'react';
import { Maximize2, BarChart2, Activity, Clock } from 'lucide-react';

interface ChartProps {
  asset: {
    symbol: string;
    price: number;
    change24h: number;
  };
}

export const TradingChart: React.FC<ChartProps> = ({ asset }) => {
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];
  
  // Генериране на симулирана графика чрез SVG Path
  const chartPoints = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: i * 40,
      y: 150 + (Math.random() - 0.5) * 80
    }));
  }, [asset.symbol]);

  const pathData = `M ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="flex-1 bg-black rounded-xl border border-zinc-800/30 flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl">
      {/* Chart Header */}
      <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white">{asset.symbol}/USD</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Инструмент</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${asset.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800/50 mx-2"></div>
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <button key={tf} className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${tf === '15M' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:bg-zinc-800'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/30 rounded-lg"><Activity size={14} /></button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/30 rounded-lg"><Maximize2 size={14} /></button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="flex-1 relative group cursor-crosshair overflow-hidden">
        {/* SVG Grid */}
        <svg className="absolute inset-0 w-full h-full text-zinc-900/30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={asset.change24h >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Live Line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d={pathData}
            fill="none"
            stroke={asset.change24h >= 0 ? '#10b981' : '#f43f5e'}
            strokeWidth="2.5"
            className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
          <path
            d={`${pathData} L 800,400 L 0,400 Z`}
            fill="url(#chartGradient)"
          />
        </svg>

        {/* Price Indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-l shadow-xl z-10">
          {asset.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

