import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#070707',
        bg2: '#0c0c0c',
        text: '#F0E8D8',
        gold: '#C4A45A',
        'gold-dim': 'rgba(196,164,90,0.15)',
        mid: '#7a7a7a',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.23,1,0.32,1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'fade-up': 'fadeUp 1s ease forwards',
        'pulse-line': 'pulse 2s ease-in-out infinite',
        'load-bar': 'loadBar 1.6s cubic-bezier(0.25,1,0.5,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '50%': { opacity: '0.3' },
        },
        loadBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
