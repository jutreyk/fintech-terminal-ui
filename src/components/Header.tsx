import React from 'react';
import { Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketTicker } from '../types/market';

interface HeaderProps {
  ticker: MarketTicker;
}

export const Header: React.FC<HeaderProps> = ({ ticker }) => {
  const isPositive = ticker.change24h >= 0;

  return (
    <header className="h-14 border-b border-canvas-border bg-canvas-subtle px-4 flex items-center justify-between select-none">
      <div className="flex items-center gap-6">
        {/* Brand / Pair */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-coinbase-blue flex items-center justify-center font-bold text-white text-xs">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">{ticker.symbol}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-canvas-panel text-slate-400 font-mono">Spot</span>
            </div>
            <span className="text-[11px] text-slate-500">Bitcoin / US Dollar</span>
          </div>
        </div>

        <div className="h-6 w-px bg-canvas-border" />

        {/* Ticker Stats */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Price</div>
            <div className={`font-semibold text-sm ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
              ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h Change</div>
            <div className={`flex items-center gap-1 font-medium ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{ticker.change24h}%
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h High</div>
            <div className="text-slate-200">${ticker.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h Low</div>
            <div className="text-slate-200">${ticker.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="hidden lg:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h Volume</div>
            <div className="text-slate-200">{ticker.volume24h.toLocaleString('en-US')} BTC</div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-canvas-panel border border-canvas-border text-[11px] text-emerald-400 font-medium">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>WebSocket Feed Connected</span>
        </div>
        <div className="h-4 w-px bg-canvas-border" />
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-coinbase-blue" />
          <span>Zero-Trust API</span>
        </div>
      </div>
    </header>
  );
};
