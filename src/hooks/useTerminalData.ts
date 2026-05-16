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
    'BNB': { symbol: 'BNB', name: 'BNB', price: 585.20, change: 0.45, high: 592.30, low: 578.10, volume: 452000.1 },
    'XRP': { symbol: 'XRP', name: 'XRP', price: 0.524, change: -0.32, high: 0.535, low: 0.518, volume: 8540000.0 },
    'ADA': { symbol: 'ADA', name: 'Cardano', price: 0.452, change: 1.25, high: 0.465, low: 0.442, volume: 32000000.0 },
    'DOGE': { symbol: 'DOGE', name: 'Dogecoin', price: 0.152, change: -4.50, high: 0.165, low: 0.148, volume: 1250000000.0 },
    'DOT': { symbol: 'DOT', name: 'Polkadot', price: 7.12, change: 2.15, high: 7.35, low: 6.95, volume: 1250000.0 },
    'LINK': { symbol: 'LINK', name: 'Chainlink', price: 14.50, change: 3.42, high: 14.85, low: 13.90, volume: 4500000.0 },
    'MATIC': { symbol: 'MATIC', name: 'Polygon', price: 0.72, change: -1.25, high: 0.75, low: 0.70, volume: 12500000.0 },
    'AVAX': { symbol: 'AVAX', name: 'Avalanche', price: 34.20, change: 2.15, high: 35.50, low: 32.80, volume: 1250000.0 },
    'ATOM': { symbol: 'ATOM', name: 'Cosmos', price: 8.45, change: 0.12, high: 8.65, low: 8.35, volume: 850000.0 },
    'UNI': { symbol: 'UNI', name: 'Uniswap', price: 7.85, change: -2.45, high: 8.12, low: 7.65, volume: 1250000.0 },
  };

  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [ticker, setTicker] = useState<Asset>(assets['BTC']);
  
  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('isDemoMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [realBalance] = useState(125450.80);
  const [demoBalance, setDemoBalance] = useState(() => {
    const saved = localStorage.getItem('demoBalance');
    return saved ? JSON.parse(saved) : 100000.00;
  });

  const [realPositions, setRealPositions] = useState<any[]>([]);
  const [demoPositions, setDemoPositions] = useState<any[]>(() => {
    const saved = localStorage.getItem('demoPositions');
    return saved ? JSON.parse(saved) : [];
  });

  // Current active data based on mode
  const balance = isDemoMode ? demoBalance : realBalance;
  const positions = isDemoMode ? demoPositions : realPositions;

  useEffect(() => {
    localStorage.setItem('isDemoMode', JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      localStorage.setItem('demoBalance', JSON.stringify(demoBalance));
      localStorage.setItem('demoPositions', JSON.stringify(demoPositions));
    }
  }, [demoBalance, demoPositions, isDemoMode]);

  const addPosition = (side: 'buy' | 'sell', amount: string, price: number, leverage: number) => {
    const size = parseFloat(amount);
    const cost = (size * price) / leverage;
    
    if (isDemoMode) {
      if (demoBalance < cost) return;
      setDemoBalance(prev => prev - cost);
    }

    const newPosition = {
      id: Math.random().toString(36).substr(2, 9),
      asset: selectedAsset,
      type: side === 'buy' ? 'LONG' : 'SHORT',
      size,
      entry: price,
      mark: price,
      pnl: 0,
      leverage,
      timestamp: new Date().toLocaleTimeString(),
      marginUsed: cost
    };

    if (isDemoMode) {
      setDemoPositions(prev => [newPosition, ...prev]);
    } else {
      setRealPositions(prev => [newPosition, ...prev]);
    }
  };

  const removePosition = (id: string) => {
    if (isDemoMode) {
      const pos = demoPositions.find(p => p.id === id);
      if (pos) {
        const pnl = (ticker.price - pos.entry) * pos.size * (pos.type === 'LONG' ? 1 : -1);
        setDemoBalance(prev => prev + pos.marginUsed + pnl);
      }
      setDemoPositions(prev => prev.filter(p => p.id !== id));
    } else {
      setRealPositions(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetDemoBalance = () => {
    setDemoBalance(100000.00);
    setDemoPositions([]);
  };
  const [orderBook, setOrderBook] = useState<{ bids: Order[]; asks: Order[] }>({
    bids: [],
    asks: [],
  });
  const [history, setHistory] = useState<any[]>([]);
  const [candles, setCandles] = useState<Tick[]>([]);

  // Binance WebSocket for real-time price
  useEffect(() => {
    const symbol = `${selectedAsset.toLowerCase()}usdt`;
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.c);
      
      setTicker(prev => ({
        ...prev,
        price: newPrice,
        change: parseFloat(data.P),
        high: parseFloat(data.h),
        low: parseFloat(data.l),
        volume: parseFloat(data.v),
      }));

      // Update order book to center around new price if it moved enough
      setOrderBook(prev => {
        const generateOrders = (type: 'bid' | 'ask', basePrice: number): Order[] => {
          let cumulativeTotal = 0;
          const step = basePrice * 0.0001;
          return Array.from({ length: 15 }).map((_, i) => {
            const price = type === 'bid' ? basePrice - i * step : basePrice + i * step;
            const size = Math.random() * (type === 'bid' ? 2 : 1.5);
            cumulativeTotal += size;
            return {
              id: `${type}-${i}-${newPrice.toFixed(2)}`,
              price,
              size,
              total: cumulativeTotal,
              type
            };
          });
        };

        // Only update if price changed significantly (e.g. 0.01%) to avoid flickering
        if (Math.abs(newPrice - (prev.bids[0]?.price || 0)) > newPrice * 0.0001) {
          return {
            bids: generateOrders('bid', newPrice),
            asks: generateOrders('ask', newPrice).reverse(),
          };
        }
        return prev;
      });
    };

    return () => {
      socket.close();
    };
  }, [selectedAsset]);

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

  // Real-time updates for simulation of secondary data
  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [ticker.price]);

  return { ticker, orderBook, history, candles, selectedAsset, setSelectedAsset, assets: Object.values(assets), balance, positions, addPosition, removePosition, isDemoMode, setIsDemoMode, resetDemoBalance };
};
