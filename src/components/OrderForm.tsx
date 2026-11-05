import React, { useState } from 'react';

interface OrderFormProps {
  currentPrice: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ currentPrice }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState<string>(currentPrice.toFixed(1));
  const [amount, setAmount] = useState<string>('0.05');

  const total = (parseFloat(price || '0') * parseFloat(amount || '0')).toFixed(2);

  return (
    <aside aria-label="Trade Execution Panel" className="w-80 flex flex-col bg-canvas-subtle p-4 select-none">
      <div className="flex rounded bg-canvas-panel p-1 mb-4">
        <button
          type="button"
          onClick={() => setSide('buy')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${
            side === 'buy' ? 'bg-trade-up text-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          Buy BTC
        </button>
        <button
          type="button"
          onClick={() => setSide('sell')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${
            side === 'sell' ? 'bg-trade-down text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sell BTC
        </button>
      </div>

      {/* Order Type Tabs */}
      <div className="flex gap-4 border-b border-canvas-border pb-2 mb-4 text-xs">
        <button
          type="button"
          onClick={() => setOrderType('limit')}
          className={`font-medium transition ${
            orderType === 'limit' ? 'text-white border-b-2 border-coinbase-blue pb-1' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Limit Order
        </button>
        <button
          type="button"
          onClick={() => setOrderType('market')}
          className={`font-medium transition ${
            orderType === 'market' ? 'text-white border-b-2 border-coinbase-blue pb-1' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Market Order
        </button>
      </div>

      <div className="space-y-4 text-xs font-mono">
        {orderType === 'limit' && (
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">Price (USD)</label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-canvas-panel border border-canvas-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-coinbase-blue"
              />
              <span className="absolute right-3 top-2 text-slate-500">USD</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-slate-400 mb-1 text-[11px] uppercase">Amount (BTC)</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-canvas-panel border border-canvas-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-coinbase-blue"
            />
            <span className="absolute right-3 top-2 text-slate-500">BTC</span>
          </div>
        </div>

        {/* Sliders / Percentage shortcuts */}
        <div className="grid grid-cols-4 gap-2 text-[10px]">
          {['25%', '50%', '75%', '100%'].map(pct => (
            <button
              key={pct}
              type="button"
              className="py-1 rounded bg-canvas-panel hover:bg-canvas-hover text-slate-400 transition"
            >
              {pct}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-canvas-border">
          <div className="flex justify-between text-slate-400 text-[11px] mb-1">
            <span>Estimated Total:</span>
            <span className="text-white font-bold">${total} USD</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[10px]">
            <span>Maker Fee: 0.05%</span>
            <span>Taker Fee: 0.15%</span>
          </div>
        </div>

        <button
          type="button"
          className={`w-full py-2.5 rounded font-sans font-bold text-xs uppercase tracking-wider transition shadow-md active:scale-[0.99] ${
            side === 'buy'
              ? 'bg-trade-up text-black hover:bg-[#00d898]'
              : 'bg-trade-down text-white hover:bg-[#ff4f45]'
          }`}
        >
          {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
        </button>
      </div>
    </aside>
  );
};
