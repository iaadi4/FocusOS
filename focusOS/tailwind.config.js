/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./popup.html",
    "./newtab.html",
    "./dashboard.html",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          hover: '#D9BA84',
          muted: '#8A7248',
          glow: 'rgba(201,169,110,0.12)',
        },
        surface: {
          base: '#0A0A0A',
          card: '#111111',
          elevated: '#1A1A1A',
          input: '#141414',
        },
        border: {
          DEFAULT: '#242424',
          subtle: '#1C1C1C',
          accent: '#3D3220',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#8A8A8A',
          muted: '#4A4A4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'md': ['15px', { lineHeight: '22px' }],
        'lg': ['18px', { lineHeight: '26px' }],
        'xl': ['22px', { lineHeight: '30px' }],
        '2xl': ['28px', { lineHeight: '36px' }],
        '3xl': ['36px', { lineHeight: '44px' }],
        'hero': ['52px', { lineHeight: '60px', fontWeight: '300' }],
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '6px',
        none: '0px',
      },
    },
  },
  plugins: [],
};
