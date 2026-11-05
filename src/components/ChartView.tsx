import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { Candle, Timeframe } from '../types/market';

interface ChartViewProps {
  candles: Candle[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

export const ChartView: React.FC<ChartViewProps> = ({ candles, timeframe, onTimeframeChange }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0b0d' },
        textColor: '#848e9c',
      },
      grid: {
        vertLines: { color: 'rgba(35, 39, 46, 0.6)' },
        horzLines: { color: 'rgba(35, 39, 46, 0.6)' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#23272e',
      },
      timeScale: {
        borderColor: '#23272e',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00c087',
      downColor: '#ff3b30',
      borderVisible: false,
      wickUpColor: '#00c087',
      wickDownColor: '#ff3b30',
    });

    const formattedData = candles.map(c => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candlestickSeries.setData(formattedData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles]);

  const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '1d'];

  return (
    <section aria-label="Interactive Candlestick Chart" className="flex-1 flex flex-col bg-canvas border-r border-canvas-border overflow-hidden">
      {/* Top Bar / Timeframe selector */}
      <div className="h-10 border-b border-canvas-border px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 mr-2 text-[11px] uppercase tracking-wider">Interval:</span>
          {timeframes.map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                timeframe === tf
                  ? 'bg-canvas-panel text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          TradingView Lightweight Core
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div ref={chartContainerRef} className="flex-1 w-full h-full relative" />
    </section>
  );
};
