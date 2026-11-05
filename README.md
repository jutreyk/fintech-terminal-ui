# fintech-terminal-ui

Institutional-grade spot trading terminal engineered with React 19, TypeScript, Tailwind CSS, and TradingView Lightweight Charts. Design architecture strictly adheres to Coinbase and Stripe professional financial surface specifications.

## Architecture & Features

- **Semantic HTML & a11y**: Standard `<header>`, `<main>`, `<section>`, `<aside>` hierarchy with dedicated ARIA labels and keyboard accessibility for order placement.
- **Real-Time Candlestick Charting**: Hardware-accelerated canvas rendering powered by TradingView Lightweight Charts v5 with dynamic interval switching (1m, 5m, 15m, 1h, 1d).
- **High-Density Order Book**: Visual depth bars calculating cumulative volume on asks/bids with real-time mid-market spread indicators.
- **Simulated WebSocket Feed**: Live price ticks emitting trades, updating the tape, and recalculating 24h high/low metrics without memory leaks.
- **Order Execution Panel**: Limit and market order routing interface with fee calculations and position percentage presets (25%, 50%, 75%, 100%).

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom dark canvas palette `#0a0b0d`, `#121417`, `#23272e`)
- **Graphics**: TradingView Lightweight Charts (Canvas API)
- **Icons**: Lucide React
- **Optimization**: Tabular numeric fonts (`JetBrains Mono`), subpixel borders, and zero unnecessary re-renders.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

## License

MIT © [Arkadiy Gazizov](https://arkadiygazizov.ru)
