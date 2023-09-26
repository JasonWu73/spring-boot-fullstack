const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',

  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  tailwindFunctions: ['clsx', 'tw'],

  plugins: [
    'prettier-plugin-tailwindcss' // `prettier-plugin-tailwindcss` must be loaded last
  ]
}

export default config
