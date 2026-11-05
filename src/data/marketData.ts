import type { Candle, MarketTicker } from '../types/market';

export const INITIAL_TICKER: MarketTicker = {
  symbol: 'BTC-USD',
  baseAsset: 'BTC',
  quoteAsset: 'USD',
  price: 64280.5,
  change24h: 3.42,
  high24h: 65120.0,
  low24h: 62940.0,
  volume24h: 28419.65
};

export function generateInitialCandles(count: number = 100): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = 62500;
  const now = Math.floor(Date.now() / 1000);
  const intervalSeconds = 300; // 5m intervals

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalSeconds;
    const delta = (Math.random() - 0.48) * 160;
    const open = currentPrice;
    const close = Math.round((open + delta) * 10) / 10;
    const high = Math.round((Math.max(open, close) + Math.random() * 80) * 10) / 10;
    const low = Math.round((Math.min(open, close) - Math.random() * 80) * 10) / 10;
    const volume = Math.round((Math.random() * 15 + 2) * 100) / 100;

    candles.push({ time, open, high, low, close, volume });
    currentPrice = close;
  }

  return candles;
}
