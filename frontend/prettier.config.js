/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',

  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  tailwindFunctions: ['clsx', 'tw'],

  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss' // MUST come last
  ]
}

export default config
