import React from 'react';
import { useTerminalData } from './hooks/useTerminalData';
import { Header } from './components/Header';
import { TradingChart } from './components/TradingChart';
import { OrderBookView } from './components/OrderBookView';
import { TradesTape } from './components/TradesTape';
import { OrderForm } from './components/OrderForm';

export const App: React.FC = () => {
  const {
    selectedsymbol,
    setselectedsymbol,
    activepair,
    timeframe,
    setTimeframe,
    issmashown,
    setissmashown,
    isdropdownopen,
    setisdropdownopen,
    isaudioenabled,
    setisaudioenabled,
    lasttradedid,
    ticker,
    candles,
    setCandles,
    trades,
    orderBook,
    side,
    setSide,
    orderType,
    setOrderType,
    priceInput,
    setPriceInput,
    amountInput,
    setAmountInput,
    estimatedTotal
  } = useTerminalData();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas text-slate-100 select-none">
      <Header
        ticker={ticker}
        selectedsymbol={selectedsymbol}
        activepair={activepair}
        isdropdownopen={isdropdownopen}
        setisdropdownopen={setisdropdownopen}
        setselectedsymbol={setselectedsymbol}
      />

      <main className="flex-1 flex overflow-hidden">
        <TradingChart
          candles={candles}
          setCandles={setCandles}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          issmashown={issmashown}
          setissmashown={setissmashown}
          selectedsymbol={selectedsymbol}
        />

        <OrderBookView
          orderBook={orderBook}
          selectedsymbol={selectedsymbol}
          activepair={activepair}
          setPriceInput={setPriceInput}
        />

        <TradesTape
          trades={trades}
          activepair={activepair}
          isaudioenabled={isaudioenabled}
          setisaudioenabled={setisaudioenabled}
          lasttradedid={lasttradedid}
        />

        <OrderForm
          selectedsymbol={selectedsymbol}
          activepair={activepair}
          side={side}
          setSide={setSide}
          orderType={orderType}
          setOrderType={setOrderType}
          priceInput={priceInput}
          setPriceInput={setPriceInput}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          estimatedTotal={estimatedTotal}
        />
      </main>
    </div>
  );
};

export default App;
