/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { sage: { 50:'#f5f7f5',100:'#e9eeeb',200:'#d6e0da',300:'#bacac1',400:'#95ab9e',500:'#718a7b',600:'#587064',700:'#475b52',800:'#3b4b44',900:'#323f3a' }, cream:'#f5eee4', ink:'#31423a' },
      boxShadow: { soft:'0 12px 35px rgba(55,72,63,.09)', card:'0 6px 20px rgba(55,72,63,.07)', glow:'0 24px 70px rgba(113,138,123,.24)', float:'0 22px 55px rgba(42,61,53,.16)' },
      fontFamily: { sans:['DM Sans','ui-sans-serif','system-ui','sans-serif'], serif:['DM Sans','ui-sans-serif','system-ui','sans-serif'] }
    }
  },
  plugins: []
}
