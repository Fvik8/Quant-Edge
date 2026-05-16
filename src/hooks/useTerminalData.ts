import { useState, useEffect, useRef, useCallback } from 'react';

export interface Tick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Order {
  id: string;
  price: number;
  size: number;
  total: number;
  type: 'bid' | 'ask';
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

export const useTerminalData = () => {
  const assets: Record<string, Asset> = {
    'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 64240.5, change: 2.45, high: 65120.0, low: 63890.5, volume: 12450.8 },
    'ETH': { symbol: 'ETH', name: 'Ethereum', price: 3124.10, change: -1.20, high: 3210.0, low: 3105.0, volume: 85420.2 },
    'SOL': { symbol: 'SOL', name: 'Solana', price: 145.65, change: 5.12, high: 148.20, low: 138.50, volume: 1254000.5 },
  };

  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [ticker, setTicker] = useState<Asset>(assets['BTC']);
  const [orderBook, setOrderBook] = useState<{ bids: Order[]; asks: Order[] }>({
    bids: [],
    asks: [],
  });
  const [history, setHistory] = useState<any[]>([]);
  const [candles, setCandles] = useState<Tick[]>([]);

  // Initialize data for new asset
  useEffect(() => {
    const currentAsset = assets[selectedAsset];
    setTicker(currentAsset);

    const now = Math.floor(Date.now() / 1000);
    const initialCandles: Tick[] = [];
    let lastPrice = currentAsset.price;
    for (let i = 100; i >= 0; i--) {
      const open = lastPrice + (Math.random() - 0.5) * (lastPrice * 0.002);
      const close = open + (Math.random() - 0.5) * (lastPrice * 0.002);
      initialCandles.push({
        time: now - i * 60,
        open,
        high: Math.max(open, close) + Math.random() * (lastPrice * 0.001),
        low: Math.min(open, close) - Math.random() * (lastPrice * 0.001),
        close,
        volume: Math.random() * 10,
      });
      lastPrice = close;
    }
    setCandles(initialCandles);

    const generateOrders = (type: 'bid' | 'ask', basePrice: number): Order[] => {
      let cumulativeTotal = 0;
      const step = basePrice * 0.0001;
      return Array.from({ length: 15 }).map((_, i) => {
        const price = type === 'bid' ? basePrice - i * step : basePrice + i * step;
        const size = Math.random() * (type === 'bid' ? 2 : 1.5);
        cumulativeTotal += size;
        return {
          id: `${type}-${i}-${Math.random()}`,
          price,
          size,
          total: cumulativeTotal,
          type
        };
      });
    };

    setOrderBook({
      bids: generateOrders('bid', currentAsset.price),
      asks: generateOrders('ask', currentAsset.price).reverse(),
    });
  }, [selectedAsset]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => {
        const move = (Math.random() - 0.5) * (prev.price * 0.0005);
        const newPrice = prev.price + move;
        return {
          ...prev,
          price: newPrice,
          change: prev.change + (move / prev.price) * 100,
        };
      });

      setOrderBook(prev => {
        const updateLevel = (orders: Order[]) => {
          const newOrders = [...orders];
          const idx = Math.floor(Math.random() * orders.length);
          newOrders[idx] = {
            ...newOrders[idx],
            size: Math.max(0.01, newOrders[idx].size + (Math.random() - 0.5) * 0.1),
          };
          let total = 0;
          return newOrders.map(o => {
            total += o.size;
            return { ...o, total };
          });
        };
        return { bids: updateLevel(prev.bids), asks: updateLevel(prev.asks) };
      });

      setHistory(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: ticker.price * (1 + (Math.random() - 0.5) * 0.0001),
          size: Math.random() * 0.5,
          type: Math.random() > 0.5 ? 'buy' : 'sell'
        },
        ...prev.slice(0, 20)
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [ticker.price]);

  return { ticker, orderBook, history, candles, selectedAsset, setSelectedAsset, assets: Object.values(assets) };
};
