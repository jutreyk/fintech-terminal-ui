import { useState, useEffect, useRef } from 'react';
import type { MarketTicker, OrderBook, Trade, Candle } from '../types/market';
import { INITIAL_TICKER, generateInitialCandles } from '../data/marketData';

export function useMarketStream() {
  const [ticker, setTicker] = useState<MarketTicker>(INITIAL_TICKER);
  const [candles] = useState<Candle[]>(() => generateInitialCandles(120));
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: [],
    lastPrice: INITIAL_TICKER.price,
    spread: 0.5
  });

  const priceRef = useRef(ticker.price);

  useEffect(() => {
    // Generate initial order book around current price
    const generateOrderBook = (basePrice: number): OrderBook => {
      const bids = [];
      const asks = [];
      let bidTotal = 0;
      let askTotal = 0;

      for (let i = 1; i <= 18; i++) {
        const bidPrice = Math.round((basePrice - i * 5) * 10) / 10;
        const bidSize = Math.round((Math.random() * 1.8 + 0.1) * 1000) / 1000;
        bidTotal += bidSize;
        bids.push({ price: bidPrice, size: bidSize, total: Math.round(bidTotal * 1000) / 1000 });

        const askPrice = Math.round((basePrice + i * 5) * 10) / 10;
        const askSize = Math.round((Math.random() * 1.8 + 0.1) * 1000) / 1000;
        askTotal += askSize;
        asks.push({ price: askPrice, size: askSize, total: Math.round(askTotal * 1000) / 1000 });
      }

      return {
        bids,
        asks,
        lastPrice: basePrice,
        spread: Math.round((asks[0]!.price - bids[0]!.price) * 10) / 10
      };
    };

    setOrderBook(generateOrderBook(priceRef.current));

    // Simulation loop (live ticks)
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 12;
      const newPrice = Math.round((priceRef.current + delta) * 10) / 10;
      priceRef.current = newPrice;

      const side: 'buy' | 'sell' = delta >= 0 ? 'buy' : 'sell';
      const amount = Math.round((Math.random() * 0.85 + 0.02) * 1000) / 1000;
      const nowStr = new Date().toTimeString().split(' ')[0]!;

      // Add to trades
      setTrades(prev => [
        {
          id: Math.random().toString(36).slice(2, 9),
          time: nowStr,
          price: newPrice,
          amount,
          side
        },
        ...prev.slice(0, 49)
      ]);

      // Update ticker
      setTicker(prev => ({
        ...prev,
        price: newPrice,
        high24h: Math.max(prev.high24h, newPrice),
        low24h: Math.min(prev.low24h, newPrice)
      }));

      // Update orderbook
      setOrderBook(generateOrderBook(newPrice));
    }, 650);

    return () => clearInterval(interval);
  }, []);

  return { ticker, candles, trades, orderBook };
}
