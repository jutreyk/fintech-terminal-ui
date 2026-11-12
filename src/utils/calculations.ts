import type { Candle, Timeframe } from '../types';

export function generateInitialCandles(
  count: number = 100,
  tf: Timeframe = '5m',
  startpriceval: number = 62500,
  spreadvol: number = 160
): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = startpriceval;
  const now = Math.floor(Date.now() / 1000);

  const intervals: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '1d': 86400
  };
  const intervalSeconds = intervals[tf] || 300;

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalSeconds;
    const delta = (Math.random() - 0.48) * spreadvol;
    const open = currentPrice;
    const close = Math.round((open + delta) * 100) / 100;
    const high = Math.round((Math.max(open, close) + Math.random() * (spreadvol * 0.5)) * 100) / 100;
    const low = Math.round((Math.min(open, close) - Math.random() * (spreadvol * 0.5)) * 100) / 100;
    candles.push({ time, open, high, low, close, volume: 10 });
    currentPrice = close;
  }
  return candles;
}

export function calculatesmaoverlay(candleitems: Candle[], periodwindow: number = 20) {
  const resultdataset: { time: number; value: number }[] = [];
  let tempsumvalue = 0;
  for (let i = 0; i < candleitems.length; i++) {
    tempsumvalue += candleitems[i].close;
    if (i >= periodwindow) {
      tempsumvalue -= candleitems[i - periodwindow].close;
    }
    if (i >= periodwindow - 1) {
      const avgresval = Math.round((tempsumvalue / periodwindow) * 100) / 100;
      resultdataset.push({
        time: candleitems[i].time,
        value: avgresval
      });
    }
  }
  return resultdataset;
}
