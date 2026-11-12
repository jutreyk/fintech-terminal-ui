import type { MarketSymbol, PairConfig } from './types';

export const PAIR_CONFIGS: Record<MarketSymbol, PairConfig> = {
  'BTC-USD': {
    symbol: 'BTC-USD',
    name: 'Bitcoin / US Dollar',
    baseprice: 64280.5,
    pricefraction: 1,
    volatility: 12,
    spreadval: 0.5,
    stepprice: 5,
    baseamount: 0.05,
    amountfraction: 3
  },
  'ETH-USD': {
    symbol: 'ETH-USD',
    name: 'Ethereum / US Dollar',
    baseprice: 3450.2,
    pricefraction: 2,
    volatility: 2.5,
    spreadval: 0.1,
    stepprice: 0.5,
    baseamount: 1.25,
    amountfraction: 2
  },
  'SOL-USD': {
    symbol: 'SOL-USD',
    name: 'Solana / US Dollar',
    baseprice: 182.4,
    pricefraction: 2,
    volatility: 0.45,
    spreadval: 0.05,
    stepprice: 0.1,
    baseamount: 15.0,
    amountfraction: 1
  }
};
