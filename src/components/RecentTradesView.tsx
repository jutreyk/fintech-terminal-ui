import React from 'react';
import type { Trade } from '../types/market';

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTradesView: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <section aria-label="Recent Market Trades" className="w-64 flex flex-col border-r border-canvas-border bg-canvas-subtle select-none">
      <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>Recent Trades</span>
        <span className="text-[10px] text-slate-500 font-mono">Live</span>
      </div>

      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
        <span>Price</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Time</span>
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
  );
};
