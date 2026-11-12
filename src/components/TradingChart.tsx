import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';
import type { Candle, Timeframe, MarketSymbol } from '../types';
import { calculatesmaoverlay, generateInitialCandles } from '../utils/calculations';
import { PAIR_CONFIGS } from '../constants';

interface TradingChartProps {
  candles: Candle[];
  setCandles: React.Dispatch<React.SetStateAction<Candle[]>>;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  issmashown: boolean;
  setissmashown: React.Dispatch<React.SetStateAction<boolean>>;
  selectedsymbol: MarketSymbol;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  candles,
  setCandles,
  timeframe,
  setTimeframe,
  issmashown,
  setissmashown,
  selectedsymbol
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredchartdata, sethoveredchartdata] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    smaval: number | null;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0a0b0d' }, textColor: '#848e9c' },
      grid: { vertLines: { color: 'rgba(35, 39, 46, 0.4)' }, horzLines: { color: 'rgba(35, 39, 46, 0.4)' } },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: '#1e293b'
        },
        horzLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: '#1e293b'
        }
      },
      rightPriceScale: { borderColor: '#23272e' },
      timeScale: { borderColor: '#23272e', timeVisible: true, secondsVisible: false }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00c087',
      downColor: '#ff3b30',
      borderVisible: false,
      wickUpColor: '#00c087',
      wickDownColor: '#ff3b30'
    });

    candlestickSeries.setData(candles.map(c => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    })));

    let smaseriesref: any = null;
    if (issmashown) {
      const smaserieslayer = chart.addSeries(LineSeries, {
        color: '#f59e0b',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        crosshairMarkerVisible: true
      });

      const calculatedsmadata = calculatesmaoverlay(candles, 20);
      smaserieslayer.setData(calculatedsmadata.map(item => ({
        time: item.time as any,
        value: item.value
      })));
      smaseriesref = smaserieslayer;
    }

    chart.subscribeCrosshairMove(param => {
      if (!param || !param.time || !param.seriesData) {
        sethoveredchartdata(null);
        return;
      }
      const candleval = param.seriesData.get(candlestickSeries) as any;
      if (!candleval) {
        sethoveredchartdata(null);
        return;
      }
      const smaval = smaseriesref ? (param.seriesData.get(smaseriesref) as any)?.value ?? null : null;
      const datetimestr = typeof param.time === 'number'
        ? new Date(param.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : String(param.time);

      sethoveredchartdata({
        time: datetimestr,
        open: candleval.open,
        high: candleval.high,
        low: candleval.low,
        close: candleval.close,
        smaval: smaval !== null ? Math.round(smaval * 100) / 100 : null
      });
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, issmashown]);

  return (
    <section className="flex-1 flex flex-col bg-canvas border-r border-canvas-border overflow-hidden">
      <div className="h-10 border-b border-canvas-border px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 mr-2 text-[11px] uppercase tracking-wider">Интервал:</span>
          {(['1m', '5m', '15m', '1h', '1d'] as Timeframe[]).map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                const curpair = PAIR_CONFIGS[selectedsymbol];
                setCandles(generateInitialCandles(120, tf, curpair.baseprice, curpair.baseprice * 0.005));
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                timeframe === tf ? 'bg-canvas-panel text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
          <div className="h-4 w-px bg-canvas-border mx-2" />
          <button
            type="button"
            onClick={() => setissmashown(prevval => !prevval)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition border ${
              issmashown
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${issmashown ? 'bg-amber-400' : 'bg-slate-600'}`} />
            <span>SMA (20)</span>
          </button>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">TradingView Lightweight Charts v5</div>
      </div>
      <div className="relative flex-1 w-full h-full">
        <div ref={chartContainerRef} className="w-full h-full" />
        {hoveredchartdata && (
          <div className="absolute top-3 left-4 z-10 flex items-center gap-3 px-3 py-1.5 rounded bg-[#0e1117]/90 border border-canvas-border backdrop-blur-sm font-mono text-[11px] pointer-events-none shadow-lg">
            <span className="text-slate-400">{hoveredchartdata.time}</span>
            <div className="flex items-center gap-2 text-slate-300">
              <span>О: <span className="text-white">${hoveredchartdata.open.toFixed(1)}</span></span>
              <span>В: <span className="text-emerald-400">${hoveredchartdata.high.toFixed(1)}</span></span>
              <span>Н: <span className="text-rose-400">${hoveredchartdata.low.toFixed(1)}</span></span>
              <span>З: <span className={hoveredchartdata.close >= hoveredchartdata.open ? 'text-trade-up font-medium' : 'text-trade-down font-medium'}>${hoveredchartdata.close.toFixed(1)}</span></span>
            </div>
            {hoveredchartdata.smaval !== null && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-canvas-border text-amber-400 font-medium">
                <span>SMA20:</span>
                <span>${hoveredchartdata.smaval.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
