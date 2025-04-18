import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        main: {
          50: '#edfef1',
          100: '#dcfee4',
          200: '#cafdd7',
          300: '#b9fdca',
          400: '#a7fcbd',
          500: '#96fcaf',
          600: '#84fba2',
          700: '#72fb95',
          800: '#61fa88',
          900: '#50fa7b',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
