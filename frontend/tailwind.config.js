/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        ink: '#1B2420',
        yolk: '#F2B705',
        tomato: '#E2492F',
        sage: '#4C7A5A',
        surface: '#FFFFFF',
        border: '#E4E2D8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
}
