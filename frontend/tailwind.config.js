import animatePlugin from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  // 启用深色模式
  darkMode: ['class'],

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      height: {
        // 因手机浏览器的地址栏会占用部分高度，导致 `100vh` 会出现垂直滚动条，故使用 `100dvh`
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh']
      },

      /* 添加新的颜色 */
      colors: {
        'one-dark': {
          DEFAULT: 'rgb(var(--color-one-dark) / <alpha-value>)',
          1: 'rgb(var(--color-one-dark-1) / <alpha-value>)',
          2: 'rgb(var(--color-one-dark-2) / <alpha-value>)'
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

  plugins: [animatePlugin]
}
