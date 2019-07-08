// Carrega todos os polyfills em ordem alfabética! (Webpack)

const polyfills = require.context('.', true, /\.js$/)
polyfills.keys().forEach(polyfills)
