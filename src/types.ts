export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1d';
export type MarketSymbol = 'BTC-USD' | 'ETH-USD' | 'SOL-USD';

export interface PairConfig {
  symbol: MarketSymbol;
  name: string;
  baseprice: number;
  pricefraction: number;
  volatility: number;
  spreadval: number;
  stepprice: number;
  baseamount: number;
  amountfraction: number;
}

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
