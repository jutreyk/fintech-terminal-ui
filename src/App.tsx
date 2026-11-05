import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChartView } from './components/ChartView';
import { OrderBookView } from './components/OrderBookView';
import { RecentTradesView } from './components/RecentTradesView';
import { OrderForm } from './components/OrderForm';
import { useMarketStream } from './hooks/useMarketStream';
import type { Timeframe } from './types/market';

export const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');
  const { ticker, candles, trades, orderBook } = useMarketStream();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas text-slate-100">
      <Header ticker={ticker} />

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Interactive Real-time Chart */}
        <ChartView
          candles={candles}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        {/* Center-Left: Order Book Depth */}
        <OrderBookView orderBook={orderBook} />

        {/* Center-Right: Tape / Recent Trades */}
        <RecentTradesView trades={trades} />

        {/* Right: Order Entry Panel */}
        <OrderForm currentPrice={ticker.price} />
      </main>
    </div>
  );
};

export default App;
