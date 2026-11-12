import React from 'react';
import type { MarketSymbol, PairConfig } from '../types';

interface OrderFormProps {
  selectedsymbol: MarketSymbol;
  activepair: PairConfig;
  side: 'buy' | 'sell';
  setSide: (side: 'buy' | 'sell') => void;
  orderType: 'limit' | 'market';
  setOrderType: (t: 'limit' | 'market') => void;
  priceInput: string;
  setPriceInput: (p: string) => void;
  amountInput: string;
  setAmountInput: (a: string) => void;
  estimatedTotal: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  selectedsymbol,
  activepair,
  side,
  setSide,
  orderType,
  setOrderType,
  priceInput,
  setPriceInput,
  amountInput,
  setAmountInput,
  estimatedTotal
}) => {
  const curcrypto = selectedsymbol.split('-')[0];

  return (
    <aside className="w-72 flex flex-col bg-canvas-subtle p-4">
      <div className="flex rounded bg-canvas-panel p-1 mb-4">
        <button
          type="button"
          onClick={() => setSide('buy')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${
            side === 'buy' ? 'bg-trade-up text-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          Купить {curcrypto}
        </button>
        <button
          type="button"
          onClick={() => setSide('sell')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition ${
            side === 'sell' ? 'bg-trade-down text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Продать {curcrypto}
        </button>
      </div>

      <div className="flex gap-4 border-b border-canvas-border pb-2 mb-4 text-xs">
        <button
          type="button"
          onClick={() => setOrderType('limit')}
          className={`font-medium transition ${
            orderType === 'limit'
              ? 'text-white border-b-2 border-coinbase-blue pb-1'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Лимитный
        </button>
        <button
          type="button"
          onClick={() => setOrderType('market')}
          className={`font-medium transition ${
            orderType === 'market'
              ? 'text-white border-b-2 border-coinbase-blue pb-1'
              : 'text-slate-500 hover:text-slate-300'
          }`}
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
          <label className="block text-slate-400 mb-1 text-[11px] uppercase">
            Количество ({curcrypto})
          </label>
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
                const balanceCrypto =
                  selectedsymbol === 'BTC-USD' ? 1.45 : selectedsymbol === 'ETH-USD' ? 12.8 : 95.0;
                const fraction = parseInt(pct) / 100;
                setAmountInput((balanceCrypto * fraction).toFixed(activepair.amountfraction));
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
            side === 'buy'
              ? 'bg-trade-up text-black hover:bg-[#00d898]'
              : 'bg-trade-down text-white hover:bg-[#ff4f45]'
          }`}
        >
          {side === 'buy' ? 'Разместить покупку' : 'Разместить продажу'}
        </button>
      </div>
    </aside>
  );
};
