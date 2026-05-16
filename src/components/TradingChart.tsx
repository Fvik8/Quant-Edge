import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';

interface ChartProps {
  data: any[];
}

export const TradingChart: React.FC<ChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontFamily: 'JetBrains Mono, monospace',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF41',
      downColor: '#FF3131',
      borderVisible: false,
      wickUpColor: '#00FF41',
      wickDownColor: '#FF3131',
    });

    // Add Entry Price Line
    series.createPriceLine({
      price: 63850.00,
      color: '#00FF41',
      lineWidth: 1,
      lineStyle: 1, // Dotted
      axisLabelVisible: true,
      title: 'ENTRY LONG',
    });

    // Add Active Order Line
    series.createPriceLine({
      price: 64500.00,
      color: '#FBBF24',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: 'LIMIT SELL',
    });

    series.setData(data as CandlestickData[]);
    
    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update data if it changes significantly or just for initial load
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data as CandlestickData[]);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};
