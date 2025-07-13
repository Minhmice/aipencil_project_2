// tailwind.config.js
module.exports = {
  // tell Tailwind to look for dark:… classes on the `class` attribute
  darkMode: 'class',

  content: [
    // adjust these globs to match your folders
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
