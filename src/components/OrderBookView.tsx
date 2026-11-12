import React from 'react';
import type { MarketSymbol, OrderBook, PairConfig } from '../types';

interface OrderBookViewProps {
  orderBook: OrderBook;
  selectedsymbol: MarketSymbol;
  activepair: PairConfig;
  setPriceInput: (price: string) => void;
}

export const OrderBookView: React.FC<OrderBookViewProps> = ({
  orderBook,
  selectedsymbol,
  activepair,
  setPriceInput
}) => {
  const maxTotal = Math.max(...orderBook.bids.map(b => b.total), ...orderBook.asks.map(a => a.total), 1);
  const totalbidsvolume = orderBook.bids.reduce((acc, b) => acc + b.size, 0);
  const totalasksvolume = orderBook.asks.reduce((acc, a) => acc + a.size, 0);
  const totalbookdepth = totalbidsvolume + totalasksvolume || 1;
  const bidimbalanceratio = Math.round((totalbidsvolume / totalbookdepth) * 100);
  const askimbalanceratio = 100 - bidimbalanceratio;

  return (
    <section className="w-64 flex flex-col border-r border-canvas-border bg-canvas-subtle">
      <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>Биржевой стакан</span>
        <span className="text-[10px] text-slate-500 font-mono">{selectedsymbol}</span>
      </div>
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
        <span>Цена</span>
        <span className="text-right">Размер</span>
        <span className="text-right">Всего</span>
      </div>
      <div className="flex-1 flex flex-col justify-end overflow-hidden space-y-[2px] p-1 font-mono text-xs">
        {orderBook.asks.slice(0, 8).reverse().map((ask, idx) => (
          <div
            key={idx}
            onClick={() => setPriceInput(ask.price.toFixed(activepair.pricefraction))}
            className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-canvas-panel cursor-pointer transition-colors"
            title="Клик для подстановки цены"
          >
            <div
              className="absolute inset-y-0 right-0 bg-trade-downBg pointer-events-none"
              style={{ width: `${Math.min((ask.total / maxTotal) * 100, 100)}%` }}
            />
            <span className="relative text-trade-down font-medium">
              {ask.price.toFixed(activepair.pricefraction)}
            </span>
            <span className="relative text-right text-slate-300">
              {ask.size.toFixed(activepair.amountfraction)}
            </span>
            <span className="relative text-right text-slate-500">
              {ask.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="h-9 border-y border-canvas-border bg-canvas-panel px-3 flex items-center justify-between font-mono">
        <span className="text-sm font-bold text-white">
          ${orderBook.lastPrice.toLocaleString('en-US', { minimumFractionDigits: activepair.pricefraction })}
        </span>
        <span className="text-[11px] text-slate-400">
          Спред: <span className="text-slate-200">{orderBook.spread.toFixed(activepair.pricefraction)}</span>
        </span>
      </div>
      <div className="px-3 py-1.5 border-b border-canvas-border bg-[#0a0b0d]">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
          <span className="text-trade-up font-semibold">{bidimbalanceratio}% Bids</span>
          <span className="text-trade-down font-semibold">{askimbalanceratio}% Asks</span>
        </div>
        <div className="w-full h-1.5 bg-[#161a22] rounded-full overflow-hidden flex">
          <div className="bg-trade-up h-full transition-all duration-300" style={{ width: `${bidimbalanceratio}%` }} />
          <div className="bg-trade-down h-full transition-all duration-300" style={{ width: `${askimbalanceratio}%` }} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden space-y-[2px] p-1 font-mono text-xs">
        {orderBook.bids.slice(0, 8).map((bid, idx) => (
          <div
            key={idx}
            onClick={() => setPriceInput(bid.price.toFixed(activepair.pricefraction))}
            className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-canvas-panel cursor-pointer transition-colors"
            title="Клик для подстановки цены"
          >
            <div
              className="absolute inset-y-0 right-0 bg-trade-upBg pointer-events-none"
              style={{ width: `${Math.min((bid.total / maxTotal) * 100, 100)}%` }}
            />
            <span className="relative text-trade-up font-medium">
              {bid.price.toFixed(activepair.pricefraction)}
            </span>
            <span className="relative text-right text-slate-300">
              {bid.size.toFixed(activepair.amountfraction)}
            </span>
            <span className="relative text-right text-slate-500">
              {bid.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
