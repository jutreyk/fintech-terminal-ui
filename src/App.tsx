import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1d';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastPrice: number;
  spread: number;
}

export interface Trade {
  id: string;
  time: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

function generateInitialCandles(count: number = 100, tf: Timeframe = '5m'): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = 62500;
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
    const delta = (Math.random() - 0.48) * 160;
    const open = currentPrice;
    const close = Math.round((open + delta) * 10) / 10;
    const high = Math.round((Math.max(open, close) + Math.random() * 80) * 10) / 10;
    const low = Math.round((Math.min(open, close) - Math.random() * 80) * 10) / 10;
    candles.push({ time, open, high, low, close, volume: 10 });
    currentPrice = close;
  }
  return candles;
}

function calculatesmaoverlay(candleitems: Candle[], periodwindow: number = 20) {
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

export const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');
  const [ticker, setTicker] = useState<MarketTicker>({
    symbol: 'BTC-USD',
    price: 64280.5,
    change24h: 3.42,
    high24h: 65120.0,
    low24h: 62940.0,
    volume24h: 28419.65
  });
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(120, '5m'));
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: [],
    lastPrice: 64280.5,
    spread: 0.5
  });

  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [priceInput, setPriceInput] = useState<string>('64280.5');
  const [amountInput, setAmountInput] = useState<string>('0.05');

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef(ticker.price);

  useEffect(() => {
    const genBook = (basePrice: number): OrderBook => {
      const bids: OrderBookLevel[] = [];
      const asks: OrderBookLevel[] = [];
      let bTotal = 0;
      let aTotal = 0;
      for (let i = 1; i <= 14; i++) {
        const bPrice = Math.round((basePrice - i * 5) * 10) / 10;
        const bSize = Math.round((Math.random() * 1.5 + 0.1) * 1000) / 1000;
        bTotal += bSize;
        bids.push({ price: bPrice, size: bSize, total: Math.round(bTotal * 1000) / 1000 });

        const aPrice = Math.round((basePrice + i * 5) * 10) / 10;
        const aSize = Math.round((Math.random() * 1.5 + 0.1) * 1000) / 1000;
        aTotal += aSize;
        asks.push({ price: aPrice, size: aSize, total: Math.round(aTotal * 1000) / 1000 });
      }
      return {
        bids,
        asks,
        lastPrice: basePrice,
        spread: Math.round((asks[0].price - bids[0].price) * 10) / 10
      };
    };

    setOrderBook(genBook(priceRef.current));

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 12;
      const newPrice = Math.round((priceRef.current + delta) * 10) / 10;
      priceRef.current = newPrice;
      const s: 'buy' | 'sell' = delta >= 0 ? 'buy' : 'sell';
      const amount = Math.round((Math.random() * 0.85 + 0.02) * 1000) / 1000;
      const nowStr = new Date().toTimeString().split(' ')[0]!;

      setTrades(prev => [
        { id: Math.random().toString(36).slice(2, 9), time: nowStr, price: newPrice, amount, side: s },
        ...prev.slice(0, 39)
      ]);

      setTicker(prev => ({
        ...prev,
        price: newPrice,
        high24h: Math.max(prev.high24h, newPrice),
        low24h: Math.min(prev.low24h, newPrice)
      }));

      setOrderBook(genBook(newPrice));
    }, 650);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0a0b0d' }, textColor: '#848e9c' },
      grid: { vertLines: { color: 'rgba(35, 39, 46, 0.6)' }, horzLines: { color: 'rgba(35, 39, 46, 0.6)' } },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#23272e' },
      timeScale: { borderColor: '#23272e', timeVisible: true, secondsVisible: false }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00c087',
      downColor: '#ff3b30',
      borderVisible: false,
      wickUpColor: '#00c087',
      wickDownColor: '#ff3b30'
    });

    candlestickSeries.setData(candles.map(c => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    })));

    const smaserieslayer = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true
    });

    const calculatedsmadata = calculatesmaoverlay(candles, 20);
    smaserieslayer.setData(calculatedsmadata.map(item => ({
      time: item.time as any,
      value: item.value
    })));

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles]);

  const maxTotal = Math.max(...orderBook.bids.map(b => b.total), ...orderBook.asks.map(a => a.total), 1);
  const isPositive = ticker.change24h >= 0;
  const estimatedTotal = (parseFloat(priceInput || '0') * parseFloat(amountInput || '0')).toFixed(2);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas text-slate-100 select-none">
      <header className="h-14 border-b border-canvas-border bg-canvas-subtle px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-coinbase-blue flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">{ticker.symbol}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-canvas-panel text-slate-400 font-mono">Spot</span>
              </div>
              <span className="text-[11px] text-slate-500">Bitcoin / US Dollar</span>
            </div>
          </div>
          <div className="h-6 w-px bg-canvas-border" />
          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Цена</div>
              <div className={`font-semibold text-sm ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">24ч Изменение</div>
              <div className={`flex items-center gap-1 font-medium ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{ticker.change24h}%
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] text-slate-400 uppercase">24ч Макс</div>
              <div className="text-slate-200">${ticker.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] text-slate-400 uppercase">24ч Мин</div>
              <div className="text-slate-200">${ticker.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-canvas-panel border border-canvas-border text-[11px] text-emerald-400 font-medium">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>WebSocket Live</span>
          </div>
          <div className="h-4 w-px bg-canvas-border" />
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-coinbase-blue" />
            <span>Zero-Trust Enclave</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 flex flex-col bg-canvas border-r border-canvas-border overflow-hidden">
          <div className="h-10 border-b border-canvas-border px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 mr-2 text-[11px] uppercase">Интервал:</span>
              {(['1m', '5m', '15m', '1h', '1d'] as Timeframe[]).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    setTimeframe(tf);
                    setCandles(generateInitialCandles(120, tf));
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    timeframe === tf ? 'bg-canvas-panel text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">TradingView Lightweight Charts v5</div>
          </div>
          <div ref={chartContainerRef} className="flex-1 w-full h-full relative" />
        </section>

        <section className="w-64 flex flex-col border-r border-canvas-border bg-canvas-subtle">
          <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Биржевой стакан</span>
            <span className="text-[10px] text-slate-500 font-mono">BTC / USD</span>
          </div>
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
            <span>Цена</span>
            <span className="text-right">Размер</span>
            <span className="text-right">Всего</span>
          </div>
          <div className="flex-1 flex flex-col justify-end overflow-hidden space-y-[2px] p-1 font-mono text-xs">
            {orderBook.asks.slice(0, 8).reverse().map((ask, idx) => (
              <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-canvas-panel cursor-pointer">
                <div className="absolute inset-y-0 right-0 bg-trade-downBg pointer-events-none" style={{ width: `${Math.min((ask.total / maxTotal) * 100, 100)}%` }} />
                <span className="relative text-trade-down font-medium">{ask.price.toFixed(1)}</span>
                <span className="relative text-right text-slate-300">{ask.size.toFixed(3)}</span>
                <span className="relative text-right text-slate-500">{ask.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-9 border-y border-canvas-border bg-canvas-panel px-3 flex items-center justify-between font-mono">
            <span className="text-sm font-bold text-white">${orderBook.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })}</span>
            <span className="text-[11px] text-slate-400">Спред: <span className="text-slate-200">{orderBook.spread.toFixed(1)}</span></span>
          </div>
          <div className="flex-1 overflow-hidden space-y-[2px] p-1 font-mono text-xs">
            {orderBook.bids.slice(0, 8).map((bid, idx) => (
              <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-canvas-panel cursor-pointer">
                <div className="absolute inset-y-0 right-0 bg-trade-upBg pointer-events-none" style={{ width: `${Math.min((bid.total / maxTotal) * 100, 100)}%` }} />
                <span className="relative text-trade-up font-medium">{bid.price.toFixed(1)}</span>
                <span className="relative text-right text-slate-300">{bid.size.toFixed(3)}</span>
                <span className="relative text-right text-slate-500">{bid.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="w-56 flex flex-col border-r border-canvas-border bg-canvas-subtle">
          <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Лента сделок</span>
            <span className="text-[10px] text-slate-500 font-mono">Live</span>
          </div>
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
            <span>Цена</span>
            <span className="text-right">Объем</span>
            <span className="text-right">Время</span>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs p-1 space-y-[2px]">
            {trades.map(trade => (
              <div key={trade.id} className="grid grid-cols-3 px-2 py-0.5 hover:bg-canvas-panel">
                <span className={trade.side === 'buy' ? 'text-trade-up font-medium' : 'text-trade-down font-medium'}>
                  {trade.price.toFixed(1)}
                </span>
                <span className="text-right text-slate-300">{trade.amount.toFixed(3)}</span>
                <span className="text-right text-slate-500 text-[11px]">{trade.time}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="w-72 flex flex-col bg-canvas-subtle p-4">
          <div className="flex rounded bg-canvas-panel p-1 mb-4">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${side === 'buy' ? 'bg-trade-up text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Купить BTC
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${side === 'sell' ? 'bg-trade-down text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Продать BTC
            </button>
          </div>

          <div className="flex gap-4 border-b border-canvas-border pb-2 mb-4 text-xs">
            <button
              type="button"
              onClick={() => setOrderType('limit')}
              className={`font-medium transition ${orderType === 'limit' ? 'text-white border-b-2 border-coinbase-blue pb-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Лимитный
            </button>
            <button
              type="button"
              onClick={() => setOrderType('market')}
              className={`font-medium transition ${orderType === 'market' ? 'text-white border-b-2 border-coinbase-blue pb-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Рыночный
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {orderType === 'limit' && (
              <div>
                <label className="block text-slate-400 mb-1 text-[11px] uppercase">Цена (USD)</label>
                <input
                  type="text"
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                  className="w-full bg-canvas-panel border border-canvas-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-coinbase-blue"
                />
              </div>
            )}
            <div>
              <label className="block text-slate-400 mb-1 text-[11px] uppercase">Количество (BTC)</label>
              <input
                type="text"
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                className="w-full bg-canvas-panel border border-canvas-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-coinbase-blue"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px]">
              {['25%', '50%', '75%', '100%'].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    const balanceBTC = 1.45;
                    const fraction = parseInt(pct) / 100;
                    setAmountInput((balanceBTC * fraction).toFixed(3));
                  }}
                  className="py-1 rounded bg-canvas-panel hover:bg-canvas-hover text-slate-400 hover:text-white transition"
                >
                  {pct}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-canvas-border">
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>Итого:</span>
                <span className="text-white font-bold">${estimatedTotal} USD</span>
              </div>
            </div>
            <button
              type="button"
              className={`w-full py-2.5 rounded font-sans font-bold text-xs uppercase tracking-wider transition ${
                side === 'buy' ? 'bg-trade-up text-black hover:bg-[#00d898]' : 'bg-trade-down text-white hover:bg-[#ff4f45]'
              }`}
            >
              {side === 'buy' ? 'Разместить покупку' : 'Разместить продажу'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
