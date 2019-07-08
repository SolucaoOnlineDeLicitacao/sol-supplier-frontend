//
// Carrega todos os initializers em ordem alfabética! (Webpack)
// - initializer: arquivos .js nesse diretório
//
const initializers = require.context('.', true, /\.js$/)
initializers.keys().forEach(initializers)
