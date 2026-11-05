import React from 'react';
import type { OrderBook } from '../types/market';

interface OrderBookProps {
  orderBook: OrderBook;
}

export const OrderBookView: React.FC<OrderBookProps> = ({ orderBook }) => {
  const maxTotal = Math.max(
    ...orderBook.bids.map(b => b.total),
    ...orderBook.asks.map(a => a.total),
    1
  );

  return (
    <section aria-label="Order Book" className="w-72 flex flex-col border-r border-canvas-border bg-canvas-subtle select-none">
      <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>Order Book</span>
        <span className="text-[10px] text-slate-500 font-mono">BTC / USD</span>
      </div>

      {/* Header Columns */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden space-y-[2px] p-1 font-mono text-xs">
        {orderBook.asks.slice(0, 10).reverse().map((ask, idx) => {
          const depthPct = Math.min((ask.total / maxTotal) * 100, 100);
          return (
            <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 cursor-pointer hover:bg-canvas-panel">
              <div
                className="absolute inset-y-0 right-0 bg-trade-downBg pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="relative text-trade-down font-medium">{ask.price.toFixed(1)}</span>
              <span className="relative text-right text-slate-300">{ask.size.toFixed(3)}</span>
              <span className="relative text-right text-slate-500">{ask.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Mid market spread bar */}
      <div className="h-9 border-y border-canvas-border bg-canvas-panel px-3 flex items-center justify-between font-mono">
        <span className="text-sm font-bold text-white">
          ${orderBook.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })}
        </span>
        <span className="text-[11px] text-slate-400">
          Spread: <span className="text-slate-200">{orderBook.spread.toFixed(1)}</span>
        </span>
      </div>

      {/* Bids (Buys) */}
      <div className="flex-1 overflow-hidden space-y-[2px] p-1 font-mono text-xs">
        {orderBook.bids.slice(0, 10).map((bid, idx) => {
          const depthPct = Math.min((bid.total / maxTotal) * 100, 100);
          return (
            <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 cursor-pointer hover:bg-canvas-panel">
              <div
                className="absolute inset-y-0 right-0 bg-trade-upBg pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="relative text-trade-up font-medium">{bid.price.toFixed(1)}</span>
              <span className="relative text-right text-slate-300">{bid.size.toFixed(3)}</span>
              <span className="relative text-right text-slate-500">{bid.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
