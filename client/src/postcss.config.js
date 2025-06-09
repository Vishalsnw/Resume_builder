// postcss.config.js
import postcss.config from '@/postcss.config';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
