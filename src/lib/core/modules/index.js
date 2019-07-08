import _ from '@/lib/lodash-ext'

let modules = {}

// Se fôssemos carregar de JS (.js), com `export default { pt-BR: { key: 'text' } }``:
// ----
//
let moduleFiles = require.context('.', true, /\.js$/)

moduleFiles.keys().forEach((filepath) => {
  let basename = filepath.replace(/^(.+\/)*/, '')
  let moduleName = _.camelize(basename.replace('.js', ''))

  if (moduleName == 'index') return // skipping webpack index file

  // XXX camelize i18n => i18N
  if (moduleName == 'i18N') moduleName = 'i18n'

  let module = moduleFiles(filepath).default
  modules[moduleName] = module
})

export default modules
