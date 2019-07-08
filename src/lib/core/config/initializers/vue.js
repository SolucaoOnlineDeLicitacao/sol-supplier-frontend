// Vue
// --
import Vue from 'vue'
import VueI18nJS from '@/lib/vue-i18n-js'
import VueIsVisible from '@/lib/vue-is-visible'
import VueMaskPlugin from '@/lib/mask.js/v-mask'
import VueRouter from 'vue-router'
// TODO: import VueInitProps from '@/lib/vue-init-props'
// TODO: import Raven from 'raven-js'
// TODO: import RavenVue from 'raven-js/plugins/vue'


// expondo globalmente, para helpers do Capybara
window.Vue = Vue


// Desabilitando alerta de "You are running Vue in development mode"
if (!app.envIsProduction) {
  Vue.config.productionTip = false
}

// configurando VueI18n
Vue.use(VueI18nJS, { i18n: app.i18n })

// instalando VueInitProps
// Vue.use(VueInitProps)

// instalando VueIsVisible
Vue.use(VueIsVisible)

// instalando v-mask
Vue.use(VueMaskPlugin)

// configurando VueRouter
Vue.use(VueRouter)

// TODO: depende de Raven e RaveuVue (sentry.io)
// // Configurando error handler do Vue para o Sentry (production)
// // Caso não seja definido, o fallback é para console.error() (development).
// const SENTRY_DSN = $("meta[name='sentry-vue-dsn']").attr('content')

// if (SENTRY_DSN) {
//   Raven.config(SENTRY_DSN)
//     .addPlugin(RavenVue, Vue)
//     .install()
// }


// Adicionando módulo http.js ao Vue, facilitando seu uso nos componentes
Vue.use({
  install(Vue, options) {
    // add global method or property
    Vue.$http = app.http

    // add an instance method
    Vue.prototype.$http = app.http
  }
})

// Adicionando módulo params.js ao Vue, facilitando seu uso nos componentes
Vue.use({
  install(Vue, options) {
    // add global method or property
    Vue.$params = app.params

    // add an instance method
    Vue.prototype.$params = app.params
  }
})



// Adicionando módulo notifications.js ao Vue, facilitando seu uso nos componentes
Vue.use({
  install(Vue, options) {
    // add global method or property
    Vue.$notifications = app.notifications

    // add an instance method
    Vue.prototype.$notifications = app.notifications
  }
})


// Adicionando módulo auth.js ao Vue, facilitando seu uso nos componentes
Vue.use({
  install(Vue, options) {
    // add global method or property
    Vue.$auth = app.auth

    // add an instance method
    Vue.prototype.$auth = app.auth
  }
})


// XXX para debugging: habilita o método `$log` em componentes Vue.
// Vue.use({
//   install(Vue, options) {
//     let logger = console // deixando caminho aberto para "flexibilizar" logger
//     Vue.$log = (...args) => logger.log(...args)
//     Vue.prototype.$log = (...args) => logger.log(...args)
//   }
// })



// TODO: revisar essas configs abaixo
// @see https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/12379/diffs
const isHeadlessChrome = /\bHeadlessChrome\//.test(navigator.userAgent)
Vue.config.devtools = !isHeadlessChrome
// Vue.config.productionTip = false

// if (app.env === 'test') {
//   Vue.config.devtools = false
//   Vue.config.productionTip = false
// }
