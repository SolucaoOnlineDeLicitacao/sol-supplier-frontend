// módulos da app
import modules from './modules'

// TODO criar essas variáves para exibir banners?
// const APP_ENV = dom.fetchMeta('rails-env')
// const APP_STAGE = dom.fetchMeta('stage')


const cache = {
  started: false
}


const app = {
  env:   modules.secrets.env,
  stage: modules.secrets.stage,

  // módulos da app
  ...modules,

  // "Proxy" para métodos bastante usados do módulo `events`
  $emit(...args) {
    return modules.events.$emit(...args)
  },
  $on(...args) {
    return modules.events.$on(...args)
  },
  $off(...args) {
    return modules.events.$off(...args)
  },
  $once(...args) {
    return modules.events.$once(...args)
  },


  /**
   * Estado de carregamento inicial (navegacional) da app.
   * É definido pelo Vue Mixin Tool, após o primeiro carregamento navegacional
   * de uma ferramenta - consumindo o payload em `app.data`.
   *
   * @return {Boolean} Carregamento navegacional inicial da app.
   */
  get started() {
    return cache.started
  },

  /**
   * Define o estado de carregamento inicial navegacional da app.
   * Não deve ser manipulado programaticamente! Quem o define é o Vue Mixin
   * `tool.js` - responsável pelo controle de carregamento síncrono
   * (navegacional - consome `app.data`) ou assíncrono (interativo - consome
   * uma XHR).
   *
   * @param  {Boolean} value Estado do carregamento inicial
   * @return {Boolean}       Novo estado de carregamento inicial
   */
  set started(value) {
    cache.started = !!value
    return cache.started
  }
}

export default app
