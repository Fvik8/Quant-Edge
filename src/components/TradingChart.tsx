import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

interface ChartProps {
  data: any[];
  symbol: string;
}

export const TradingChart: React.FC<ChartProps> = ({ symbol }) => {
  return (
    <div className="w-full h-full bg-terminal-bg relative pt-[40px] overflow-hidden">
      <div className="w-full h-full overflow-hidden border-t border-terminal-border/20">
        <AdvancedRealTimeChart
          theme="dark"
          autosize
          symbol={`BINANCE:${symbol}USDT`}
          interval="15"
          timezone="Etc/UTC"
          style="1"
          locale="en"
          toolbar_bg="#09090b"
          enable_publishing={false}
          hide_top_toolbar={false}
          hide_legend={false}
          save_image={false}
          container_id="tradingview_chart"
          backgroundColor="#09090b"
          gridColor="rgba(255, 255, 255, 0.05)"
        />
      </div>
    </div>
  );
};
