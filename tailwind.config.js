/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scope utilities so global storefront CSS is unchanged
  important: ".admin-tw-root",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
