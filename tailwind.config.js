/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb', dark: '#1d4ed8' },
        surface: { DEFAULT: '#f8fafc', dark: '#1e293b' },
        card: { DEFAULT: '#ffffff', dark: '#334155' },
        border: { DEFAULT: '#e2e8f0', dark: '#475569' },
        muted: { DEFAULT: '#64748b', dark: '#94a3b8' },
        success: '#16a34a',
        warning: '#ca8a04',
        error: '#dc2626',
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};
