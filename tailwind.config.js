/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': {
          50: '#fefae0',
          100: '#fdf6d0',
          200: '#fbedb0',
          300: '#f9e490',
          400: '#f7db70',
          500: '#f5d250',
          600: '#ddb940',
          700: '#c5a030',
          800: '#ad8720',
          900: '#956e10',
        },
        'tan': {
          50: '#f9f4ed',
          100: '#f3e9db',
          200: '#e7d3b7',
          300: '#dda15e',
          400: '#d89548',
          500: '#d38932',
          600: '#be7b2d',
          700: '#a96d28',
          800: '#945f23',
          900: '#7f511e',
        },
        'brown': {
          50: '#f4edde',
          100: '#e9dbbd',
          200: '#ddc99c',
          300: '#d2b77b',
          400: '#bc6c25',
          500: '#a86221',
          600: '#94581d',
          700: '#804e19',
          800: '#6c4415',
          900: '#582b11',
        },
        'olive': {
          50: '#f2f4f0',
          100: '#e6e9e1',
          200: '#cdd3c3',
          300: '#b4bda5',
          400: '#9ba787',
          500: '#606c38',
          600: '#566132',
          700: '#4c562c',
          800: '#424b26',
          900: '#384020',
        },
        'forest': {
          50: '#f0f2ed',
          100: '#e1e5db',
          200: '#c3cbb7',
          300: '#a5b193',
          400: '#87976f',
          500: '#283618',
          600: '#243116',
          700: '#202c14',
          800: '#1c2712',
          900: '#182210',
        }
      }
    },
  },
  plugins: [],
}