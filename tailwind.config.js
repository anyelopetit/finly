/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary — Lavanda / Violeta
        'primary': '#5d39ae',
        'on-primary': '#ffffff',
        'primary-container': '#7653c8',
        'on-primary-container': '#f0e6ff',
        'primary-fixed': '#e9ddff',
        'primary-fixed-dim': '#d0bcff',
        'on-primary-fixed': '#23005c',
        'on-primary-fixed-variant': '#522ca2',
        'inverse-primary': '#d0bcff',

        // Secondary — Limón Neón
        'secondary': '#4d6700',
        'on-secondary': '#ffffff',
        'secondary-container': '#bef532',
        'on-secondary-container': '#526d00',
        'secondary-fixed': '#bef532',
        'secondary-fixed-dim': '#a3d700',
        'on-secondary-fixed': '#151f00',
        'on-secondary-fixed-variant': '#394d00',

        // Tertiary — Púrpura
        'tertiary': '#574397',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#705cb1',
        'on-tertiary-container': '#efe7ff',
        'tertiary-fixed': '#e8deff',
        'tertiary-fixed-dim': '#cdbdff',
        'on-tertiary-fixed': '#20005e',
        'on-tertiary-fixed-variant': '#4c388b',

        // Error
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Surface & Background
        'background': '#f8f9ff',
        'on-background': '#0d1d2d',
        'surface': '#f8f9ff',
        'on-surface': '#0d1d2d',
        'surface-variant': '#d4e4fa',
        'on-surface-variant': '#494452',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eef4ff',
        'surface-container': '#e4efff',
        'surface-container-high': '#dae9ff',
        'surface-container-highest': '#d4e4fa',
        'surface-dim': '#ccdbf2',
        'surface-bright': '#f8f9ff',
        'surface-tint': '#6b47bc',

        // Inverse
        'inverse-surface': '#233242',
        'inverse-on-surface': '#e9f1ff',

        // Outline
        'outline': '#7a7484',
        'outline-variant': '#cbc3d4',
      },
      borderRadius: {
        'DEFAULT': '1rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px',
      },
      spacing: {
        'margin': '1.25rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'gutter': '1rem',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '38px', fontWeight: '700' }],
        'headline-lg': ['26px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '22px', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg': ['15px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '500' }],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(93, 57, 174, 0.06)',
        'hero': '0 12px 40px rgba(93, 57, 174, 0.15)',
        'fab': '0 8px 20px rgba(190, 245, 50, 0.4)',
        'fab-hover': '0 12px 28px rgba(190, 245, 50, 0.55)',
        'nav': '0 12px 32px rgba(11, 27, 43, 0.08)',
        'sm': '0 1px 4px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'orb-breathing': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 8px 16px rgba(190, 245, 50, 0.3))' },
          '50%': { filter: 'drop-shadow(0 14px 24px rgba(190, 245, 50, 0.6))' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bar-grow': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
      },
      animation: {
        'orb-breathing': 'orb-breathing 5s ease-in-out infinite',
        'subtle-float': 'subtle-float 3.8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'bar-grow': 'bar-grow 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}
