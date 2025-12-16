/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif KR', 'Georgia', 'serif'],
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#e63946',
        background: '#fafafa',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: '#1a1a1a',
            h1: {
              fontFamily: 'Noto Serif KR, Georgia, serif',
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'Noto Serif KR, Georgia, serif',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
