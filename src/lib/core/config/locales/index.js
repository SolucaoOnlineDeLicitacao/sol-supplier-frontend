import merge from 'webpack-merge'

let messages = {}

// Se fôssemos carregar de JS (.js), com `export default { pt-BR: { key: 'text' } }``:
// ----
//
// const locales = require.context('.', true, /\.js$/)
//
// locales.keys().forEach((key) => {
//   messages = merge(messages, locales(key).default)
// })


// Se fôssemos carregar de JSON (.json), com `{ pt-BR: { key: 'text' } }``:
// ----
//
// const locales = require.context('json-loader!.', true, /\.json$/)
//
// locales.keys().forEach((key) => {
//   // veja que não tem `.default` no fim! pois não há `export` (JS)
//   messages = merge(messages, locales(key))
// })


// Carregando de YAML, o que diminui em muito o tamanho dos arquivos
// ----
const locales = require.context('json-loader!yaml-loader!.', true, /\.ya?ml$/)
locales.keys().forEach((key) => {
  messages = merge(messages, locales(key))
})

export default messages
