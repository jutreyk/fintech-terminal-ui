import React from 'react';
import { Activity, ShieldCheck, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import type { MarketSymbol, MarketTicker, PairConfig } from '../types';
import { PAIR_CONFIGS } from '../constants';

interface HeaderProps {
  ticker: MarketTicker;
  selectedsymbol: MarketSymbol;
  activepair: PairConfig;
  isdropdownopen: boolean;
  setisdropdownopen: React.Dispatch<React.SetStateAction<boolean>>;
  setselectedsymbol: (sym: MarketSymbol) => void;
}

export const Header: React.FC<HeaderProps> = ({
  ticker,
  selectedsymbol,
  activepair,
  isdropdownopen,
  setisdropdownopen,
  setselectedsymbol
}) => {
  const isPositive = ticker.change24h >= 0;

  return (
    <header className="h-14 border-b border-canvas-border bg-canvas-subtle px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-coinbase-blue flex items-center justify-center font-bold text-white text-xs">
            C
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setisdropdownopen(prev => !prev)}
              className="flex items-center gap-2 hover:bg-canvas-panel px-2 py-1 rounded transition text-left"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white">{ticker.symbol}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-canvas-panel text-slate-400 font-mono">Spot</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-500">{activepair.name}</span>
              </div>
            </button>
            {isdropdownopen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#0e1117] border border-canvas-border rounded shadow-2xl py-1 z-50">
                {(Object.keys(PAIR_CONFIGS) as MarketSymbol[]).map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      setselectedsymbol(sym);
                      setisdropdownopen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-canvas-panel transition ${
                      selectedsymbol === sym ? 'bg-canvas-panel font-semibold text-white' : 'text-slate-300'
                    }`}
                  >
                    <span>{sym}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ${PAIR_CONFIGS[sym].baseprice.toLocaleString('en-US')}
                    </span>
                  </button>
                ))}
              </div>
            )}
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
              {isPositive ? '+' : ''}
              {ticker.change24h}%
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 uppercase">24ч Макс</div>
            <div className="text-slate-200">
              ${ticker.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 uppercase">24ч Мин</div>
            <div className="text-slate-200">
              ${ticker.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
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
  );
};
