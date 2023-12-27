/** @type {import('prettier').Config} */
export default {
  printWidth: 90,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',

  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  tailwindFunctions: ['clsx', 'tw'],

  plugins: [
    'prettier-plugin-tailwindcss' // MUST come last
  ]
}
