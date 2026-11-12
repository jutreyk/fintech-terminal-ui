import { useState, useEffect, useRef } from 'react';
import type {
  Candle,
  MarketSymbol,
  MarketTicker,
  OrderBook,
  OrderBookLevel,
  Timeframe,
  Trade
} from '../types';
import { PAIR_CONFIGS } from '../constants';
import { generateInitialCandles } from '../utils/calculations';

export function useTerminalData() {
  const [selectedsymbol, setselectedsymbol] = useState<MarketSymbol>('BTC-USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');
  const [issmashown, setissmashown] = useState<boolean>(true);
  const [isdropdownopen, setisdropdownopen] = useState<boolean>(false);
  const [isaudioenabled, setisaudioenabled] = useState<boolean>(false);
  const [lasttradedid, setlasttradedid] = useState<string | null>(null);

  const audiocontextref = useRef<AudioContext | null>(null);

  const playtradesoundtick = (tradeside: 'buy' | 'sell') => {
    try {
      if (!audiocontextref.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audiocontextref.current = new AudioCtx();
        }
      }
      const actx = audiocontextref.current;
      if (!actx || actx.state === 'suspended') {
        actx?.resume();
      }
      if (!actx) return;

      const oscnode = actx.createOscillator();
      const gainnode = actx.createGain();
      oscnode.type = 'sine';
      oscnode.frequency.setValueAtTime(tradeside === 'buy' ? 920 : 280, actx.currentTime);
      gainnode.gain.setValueAtTime(0.035, actx.currentTime);
      gainnode.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.04);
      oscnode.connect(gainnode);
      gainnode.connect(actx.destination);
      oscnode.start();
      oscnode.stop(actx.currentTime + 0.04);
    } catch {}
  };

  const activepair = PAIR_CONFIGS[selectedsymbol];

  const [ticker, setTicker] = useState<MarketTicker>({
    symbol: activepair.symbol,
    price: activepair.baseprice,
    change24h: 3.42,
    high24h: Math.round(activepair.baseprice * 1.018 * 100) / 100,
    low24h: Math.round(activepair.baseprice * 0.982 * 100) / 100,
    volume24h: 28419.65
  });
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateInitialCandles(120, '5m', activepair.baseprice, activepair.baseprice * 0.005)
  );
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: [],
    lastPrice: activepair.baseprice,
    spread: activepair.spreadval
  });

  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [priceInput, setPriceInput] = useState<string>(activepair.baseprice.toString());
  const [amountInput, setAmountInput] = useState<string>(activepair.baseamount.toString());

  const priceRef = useRef(activepair.baseprice);

  useEffect(() => {
    const curpair = PAIR_CONFIGS[selectedsymbol];
    priceRef.current = curpair.baseprice;
    setPriceInput(curpair.baseprice.toString());
    setAmountInput(curpair.baseamount.toString());
    setTicker({
      symbol: curpair.symbol,
      price: curpair.baseprice,
      change24h: selectedsymbol === 'BTC-USD' ? 3.42 : selectedsymbol === 'ETH-USD' ? 1.85 : -2.14,
      high24h: Math.round(curpair.baseprice * 1.018 * 100) / 100,
      low24h: Math.round(curpair.baseprice * 0.982 * 100) / 100,
      volume24h: selectedsymbol === 'BTC-USD' ? 28419.65 : selectedsymbol === 'ETH-USD' ? 142050.8 : 893420.0
    });
    setCandles(generateInitialCandles(120, timeframe, curpair.baseprice, curpair.baseprice * 0.005));
    setTrades([]);
  }, [selectedsymbol]);

  useEffect(() => {
    const curcfg = PAIR_CONFIGS[selectedsymbol];
    const genBook = (basePrice: number): OrderBook => {
      const bids: OrderBookLevel[] = [];
      const asks: OrderBookLevel[] = [];
      let bTotal = 0;
      let aTotal = 0;
      const stepval = curcfg.stepprice;
      const decplaces = curcfg.pricefraction;
      for (let i = 1; i <= 14; i++) {
        const rawbprice = basePrice - i * stepval;
        const bPrice = Number(rawbprice.toFixed(decplaces));
        const bSize = Math.round((Math.random() * 1.5 + 0.1) * 1000) / 1000;
        bTotal += bSize;
        bids.push({ price: bPrice, size: bSize, total: Math.round(bTotal * 1000) / 1000 });

        const rawaprice = basePrice + i * stepval;
        const aPrice = Number(rawaprice.toFixed(decplaces));
        const aSize = Math.round((Math.random() * 1.5 + 0.1) * 1000) / 1000;
        aTotal += aSize;
        asks.push({ price: aPrice, size: aSize, total: Math.round(aTotal * 1000) / 1000 });
      }
      return {
        bids,
        asks,
        lastPrice: basePrice,
        spread: Number((asks[0].price - bids[0].price).toFixed(decplaces))
      };
    };

    setOrderBook(genBook(priceRef.current));

    const interval = setInterval(() => {
      const curcfginner = PAIR_CONFIGS[selectedsymbol];
      const delta = (Math.random() - 0.49) * curcfginner.volatility;
      const decdigits = curcfginner.pricefraction;
      const newPrice = Number((priceRef.current + delta).toFixed(decdigits));
      priceRef.current = newPrice;
      const s: 'buy' | 'sell' = delta >= 0 ? 'buy' : 'sell';
      const amount = Math.round((Math.random() * curcfginner.baseamount * 2 + curcfginner.baseamount * 0.1) * 1000) / 1000;
      const nowStr = new Date().toTimeString().split(' ')[0]!;
      const newtradeid = Math.random().toString(36).slice(2, 9);

      setlasttradedid(newtradeid);
      if (isaudioenabled) {
        playtradesoundtick(s);
      }

      setTrades(prev => [
        { id: newtradeid, time: nowStr, price: newPrice, amount, side: s },
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
  }, [selectedsymbol, isaudioenabled]);

  const estimatedTotal = (parseFloat(priceInput || '0') * parseFloat(amountInput || '0')).toFixed(2);

  return {
    selectedsymbol,
    setselectedsymbol,
    activepair,
    timeframe,
    setTimeframe,
    issmashown,
    setissmashown,
    isdropdownopen,
    setisdropdownopen,
    isaudioenabled,
    setisaudioenabled,
    lasttradedid,
    ticker,
    candles,
    setCandles,
    trades,
    orderBook,
    side,
    setSide,
    orderType,
    setOrderType,
    priceInput,
    setPriceInput,
    amountInput,
    setAmountInput,
    estimatedTotal
  };
}
