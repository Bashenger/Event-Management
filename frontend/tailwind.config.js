/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sunset: {
          cream: '#FAFAF9',
          borderLight: '#E7E5E4',
          crimson: '#E11D48',
          crimsonHover: '#BE123C',
          tangerine: '#F59E0B',
          charcoal: '#1C1917',
          mutedLight: '#78716C',
          obsidian: '#0F1117',
          slateDark: '#181B26',
          borderDark: '#262B3D',
          coral: '#FF4D6D',
          coralHover: '#FF3358',
          goldenTangerine: '#FF9E00',
          whiteDark: '#F8FAFC',
          mutedDark: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin-slow 18s linear infinite',
      },
      boxShadow: {
        'sunset-crimson': '0 8px 30px -4px rgba(225, 29, 72, 0.35)',
        'sunset-coral': '0 8px 30px -4px rgba(255, 77, 109, 0.4)',
        'sunset-tangerine': '0 8px 30px -4px rgba(245, 158, 11, 0.35)',
      },
    },
  },
  plugins: [],
};
