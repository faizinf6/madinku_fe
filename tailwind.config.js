/** @type {import('tailwindcss').Config} */
module.exports = {
  // corePlugins: {
  //   preflight: false,
  // },
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

