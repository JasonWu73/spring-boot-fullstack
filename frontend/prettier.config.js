/** @type {import('prettier').Config} */
export default {
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  tailwindFunctions: ["clsx", "tw"],

  plugins: [
    "prettier-plugin-tailwindcss", // MUST come last
  ],
};
