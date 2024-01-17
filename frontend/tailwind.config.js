import animatePlugin from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  // 启用暗色模式
  darkMode: ['class'],

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    /* 由 shad-cn/ui 生成 */
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },

    extend: {
      height: {
        // 因手机浏览器的地址栏会占用部分高度，导致 `100vh` 会出现垂直滚动条，故使用 `100dvh`
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh']
      },

      /* 扩展自定义颜色 */
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
        },
        predawn: {
          DEFAULT: 'rgb(var(--color-predawn) / <alpha-value>)'
        }
      },

      /* 由 shad-cn/ui 生成 */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },

  /* 由 shad-cn/ui 生成 */
  plugins: [animatePlugin]
}
