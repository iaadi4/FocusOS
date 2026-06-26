/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          hover:   '#D9BA84',
          dim:     '#8A7248',
          bg:      'rgba(201,169,110,0.06)',
        },
        surface: {
          base:     '#0A0A0A',
          card:     '#111111',
          elevated: '#1A1A1A',
          nav:      '#0D0D0D',
        },
        border: {
          DEFAULT: '#242424',
          subtle:  '#1C1C1C',
        },
        text: {
          primary:   '#F5F5F5',
          secondary: '#8A8A8A',
          muted:     '#4A4A4A',
          inverse:   '#0A0A0A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
