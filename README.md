# fintech-terminal-ui

Интерфейс спотового терминала криптовалютной биржи. Стек: React 19, TypeScript, Tailwind CSS, TradingView Lightweight Charts v5.

## Возможности

- Свечной график TradingView с таймфреймами (1m, 5m, 15m, 1h, 1d).
- Индикатор SMA-20 с тумблером отображения в панели инструментов.
- Кастомный тултип перекрестия курсора (OHLC + SMA20) в темной теме.
- Поддержка торговых пар BTC/USD, ETH/USD, SOL/USD с изолированным стаканом и 24ч статистикой.
- Биржевой стакан (Order Book) с расчетом спреда, шкалой дисбаланса объемов (Imbalance Bar) и автоподстановкой цены по клику.
- Лента сделок (Trades Tape) с цветовой вспышкой новых транзакций и синтезом аудиотиков через Web Audio API.
- Модульная архитектура с кастомным хуком useTerminalData.

## Стек

- React 19
- TypeScript 5
- Vite 8
- Tailwind CSS 3
- Lightweight Charts 5
- Lucide React

## Запуск

```bash
npm install
npm run dev
```

Сборка продакшен бандла:

```bash
npm run build
```
