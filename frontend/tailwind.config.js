import animatePlugin from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'], // 启用暗色模式
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        night: {
          DEFAULT: 'rgb(var(--color-night) / <alpha-value>)',
          1: 'rgb(var(--color-night-1) / <alpha-value>)',
          2: 'rgb(var(--color-night-2) / <alpha-value>)',
          3: 'rgb(var(--color-night-3) / <alpha-value>)',
          4: 'rgb(var(--color-night-4) / <alpha-value>)'
        },
        snow: {
          DEFAULT: 'rgb(var(--color-snow) / <alpha-value>)'
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animatePlugin]
}
