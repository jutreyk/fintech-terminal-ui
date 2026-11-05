/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0a0b0d', // Coinbase dark base
          subtle: '#121417',
          panel: '#181a1f',
          border: '#23272e',
          hover: '#2a2f38'
        },
        coinbase: {
          blue: '#0052ff',
          hover: '#0045d8'
        },
        trade: {
          up: '#00c087',
          upBg: 'rgba(0, 192, 135, 0.12)',
          down: '#ff3b30',
          downBg: 'rgba(255, 59, 48, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace']
      }
    }
  },
  plugins: []
};
