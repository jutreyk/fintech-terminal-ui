import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { PairConfig, Trade } from '../types';

interface TradesTapeProps {
  trades: Trade[];
  activepair: PairConfig;
  isaudioenabled: boolean;
  setisaudioenabled: React.Dispatch<React.SetStateAction<boolean>>;
  lasttradedid: string | null;
}

export const TradesTape: React.FC<TradesTapeProps> = ({
  trades,
  activepair,
  isaudioenabled,
  setisaudioenabled,
  lasttradedid
}) => {
  return (
    <section className="w-56 flex flex-col border-r border-canvas-border bg-canvas-subtle">
      <div className="h-10 border-b border-canvas-border px-3 flex items-center justify-between text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-1.5">
          <span>Лента сделок</span>
          <button
            type="button"
            onClick={() => setisaudioenabled(prev => !prev)}
            className={`p-1 rounded transition hover:bg-canvas-panel ${
              isaudioenabled ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isaudioenabled ? 'Звук сделок включен' : 'Звук сделок выключен'}
          >
            {isaudioenabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live</span>
      </div>
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-canvas-border">
        <span>Цена</span>
        <span className="text-right">Объем</span>
        <span className="text-right">Время</span>
      </div>
      <div className="flex-1 overflow-y-auto font-mono text-xs p-1 space-y-[2px]">
        {trades.map(trade => {
          const isrecent = trade.id === lasttradedid;
          const flashclass = isrecent
            ? trade.side === 'buy'
              ? 'bg-emerald-500/25 transition-colors duration-500'
              : 'bg-rose-500/25 transition-colors duration-500'
            : 'hover:bg-canvas-panel transition-colors';
          return (
            <div key={trade.id} className={`grid grid-cols-3 px-2 py-0.5 rounded-sm ${flashclass}`}>
              <span className={trade.side === 'buy' ? 'text-trade-up font-medium' : 'text-trade-down font-medium'}>
                {trade.price.toFixed(activepair.pricefraction)}
              </span>
              <span className="text-right text-slate-300">{trade.amount.toFixed(activepair.amountfraction)}</span>
              <span className="text-right text-slate-500 text-[11px]">{trade.time}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
