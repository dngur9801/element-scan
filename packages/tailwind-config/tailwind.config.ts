import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        main: {
          50: '#e3fafc',
          100: '#c5f6fa',
          200: '#99e9f2',
          300: '#66d9e8',
          400: '#3bc9db',
          500: '#22b8cf',
          600: '#15aabf',
          700: '#1098ad',
          800: '#0c8599',
          900: '#0b7285',
        },
        sub: {
          200: '#f48eb1',
          500: '#e91e63',
        },
        'main-200-opacity': 'rgba(153, 233, 242, 0.15)',
        'sub-200-opacity': 'rgba(244, 142, 177, 0.15)',
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
