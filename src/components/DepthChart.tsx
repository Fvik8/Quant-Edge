import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '../hooks/useTerminalData';

interface DepthChartProps {
  bids: Order[];
  asks: Order[];
}

export const DepthChart: React.FC<DepthChartProps> = ({ bids, asks }) => {
  // Process data for the depth chart
  const bidData = bids.map(b => ({
    price: b.price,
    bidVolume: b.total,
    askVolume: 0
  })).sort((a, b) => a.price - b.price);

  const askData = asks.map(a => ({
    price: a.price,
    bidVolume: 0,
    askVolume: a.total
  })).sort((a, b) => a.price - b.price);

  const data = [...bidData, ...askData];

  return (
    <div className="w-full h-full bg-black/50 p-2">
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Depth</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-terminal-green/30 border border-terminal-green" />
            <span className="text-[9px] text-zinc-500 uppercase">Bids</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-terminal-red/30 border border-terminal-red" />
            <span className="text-[9px] text-zinc-500 uppercase">Asks</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAsk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF3131" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FF3131" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="price" 
            hide 
            type="number" 
            domain={['dataMin', 'dataMax']}
          />
          <YAxis hide />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-zinc-900 border border-zinc-800 p-2 font-mono text-[10px]">
                    <div className="text-white mb-1">Price: {data.price.toFixed(2)}</div>
                    <div className="text-zinc-400">
                      Volume: {(data.bidVolume || data.askVolume).toFixed(4)}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="step"
            dataKey="bidVolume"
            stroke="#00FF41"
            fillOpacity={1}
            fill="url(#colorBid)"
            strokeWidth={1}
            isAnimationActive={false}
          />
          <Area
            type="step"
            dataKey="askVolume"
            stroke="#FF3131"
            fillOpacity={1}
            fill="url(#colorAsk)"
            strokeWidth={1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
