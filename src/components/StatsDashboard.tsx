import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, Hash, TrendingUp, DollarSign } from 'lucide-react';

const PERFORMANCE_DATA = [
  { day: '01', value: 118000 },
  { day: '05', value: 120500 },
  { day: '10', value: 119000 },
  { day: '15', value: 122400 },
  { day: '20', value: 121000 },
  { day: '25', value: 124800 },
  { day: '30', value: 125450 },
];

const RECENT_TRADES = [
  { time: '14:20:45', asset: 'BTC/USDT', side: 'LONG', pnl: '+1,240.50', status: 'CLOSED' },
  { time: '12:15:22', asset: 'ETH/USDT', side: 'SHORT', pnl: '-420.20', status: 'CLOSED' },
  { time: '10:05:11', asset: 'SOL/USDT', side: 'LONG', pnl: '+850.10', status: 'CLOSED' },
  { time: '08:45:30', asset: 'BTC/USDT', side: 'SHORT', pnl: '+2,100.00', status: 'CLOSED' },
  { time: 'Yesterday', asset: 'LINK/USDT', side: 'LONG', pnl: '+120.40', status: 'CLOSED' },
];

export const StatsDashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-[#020205] p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-2">Performance Metrics</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-terminal-green" />
              Institutional Asset Monitoring Active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-none mb-1">Account Equity</span>
              <div className="text-2xl font-black text-white font-mono tracking-tighter">$125,450.80</div>
            </div>
            <div className="h-10 w-px bg-terminal-border/40 mx-2" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-none mb-1">24h Gain</span>
              <div className="text-xl font-black text-terminal-green font-mono tracking-tighter">+4.25%</div>
            </div>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Win Rate', value: '68.4%', sub: 'Last 100 Trades' },
            { label: 'Sharpe Ratio', value: '2.45', sub: 'Risk Adj. Performance' },
            { label: 'Max Drawdown', value: '3.2%', sub: 'Recovery: 12 Days' },
            { label: 'Total Volume', value: '$4.2M', sub: '30-Day Aggregated' }
          ].map((card, i) => (
            <div key={i} className="p-5 bg-terminal-surface/10 border border-terminal-border rounded-sm hover:bg-terminal-surface/20 transition-all border-l-2 border-l-terminal-border/50">
              <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-3">{card.label}</div>
              <div className="text-xl font-black text-white font-mono mb-1">{card.value}</div>
              <div className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Performance Chart Card */}
        <div className="bg-terminal-surface/10 border border-terminal-border rounded-sm p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset Growth Velocity (30D)</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', 'ALL'].map(t => (
                <button key={t} className={`text-[9px] font-black px-2 py-1 rounded-[1px] transition-all ${t === '1M' ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30' : 'text-zinc-600 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#3f3f46" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={({ x, y, payload }) => (
                    <text x={x} y={y + 16} fill="#52525b" fontSize={9} fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                      May {payload.value}
                    </text>
                  )}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #18181b', 
                    borderRadius: '2px', 
                    fontSize: '10px',
                    fontWeight: '900',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#22c55e' }}
                  cursor={{ stroke: 'rgba(34, 197, 94, 0.2)', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade Ledger */}
        <div className="bg-terminal-surface/10 border border-terminal-border rounded-sm overflow-hidden">
          <div className="p-5 border-b border-terminal-border flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Historical Trade Ledger</h3>
            <button className="text-[9px] text-zinc-600 hover:text-white uppercase font-black tracking-widest transition-colors flex items-center gap-1">
              Export CSV <ArrowDownRight className="w-3 h-3" />
            </button>
          </div>
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="text-zinc-600 border-b border-terminal-border/30 bg-terminal-surface/5">
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[9px]">Timestamp</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[9px]">Asset Node</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[9px]">Execution</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[9px]">Realized PnL</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[9px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {RECENT_TRADES.map((trade, i) => (
                <tr key={i} className="group hover:bg-white/[0.01] transition-colors tabular-nums">
                  <td className="py-4 px-6 text-zinc-500 flex items-center gap-2">
                    <Clock className="w-3 h-3 opacity-30" />
                    {trade.time}
                  </td>
                  <td className="py-4 px-6 text-white font-black">{trade.asset}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-[1px] font-black text-[9px] border ${trade.side === 'LONG' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className={`py-4 px-6 font-black ${trade.pnl.startsWith('+') ? 'text-terminal-green' : 'text-terminal-red'}`}>
                    {trade.pnl}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[10px] text-zinc-600 font-black italic tracking-widest">{trade.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center border-t border-terminal-border/30">
            <button className="text-[9px] text-zinc-700 hover:text-zinc-400 uppercase font-black tracking-widest transition-colors">
              Synchronize full history (Deep Archive)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
