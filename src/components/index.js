/*
 * Registra todos os componentes globais para a app phone
 */
import Vue from 'vue'

// global phone components
import '@/lib/core/components/phone'


// não recursivo em sub diretórios - segundo argumento `false`
const components = require.context('.', false, /\.vue$/)

/**
 * Registra todos os componentes do diretório, como se fizesse:
 * ```javascript
 * import component from './action-input.vue'
 *
 * // nome do componente é idêntico ao nome do arquivo .vue
 * Vue.component('action-input', component)
 * ````
 */
components.keys().forEach((filepath) => {
  let basename = filepath.replace(/^(.+\/)*/, '')
  let componentName = basename.replace('.vue', '')
  let component = components(filepath).default

  Vue.component(componentName, component)
})
