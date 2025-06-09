// tailwind.config.js
import index from '@/pages/help/index';
import tailwind.config from '@/tailwind.config';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // You can add custom colors here if needed
      },
    },
  },
  plugins: [],
}
