/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    // tambahkan jalur lain jika perlu
  ],
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ],
};

