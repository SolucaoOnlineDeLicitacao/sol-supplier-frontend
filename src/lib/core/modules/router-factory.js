import _         from '@/lib/lodash-ext'
import qs        from 'qs'
import Router from 'vue-router'
import auth      from './auth'

/**
 * Router factory.
 * Use it to create your router.
 * usage:
 * ```js
 * // in config/routes.js
 *
 * const routes = [{}, ...]
 * router = routerFactory.init(routes)
 *
 * app.router = router
 * ```
 * @type {Object}
 */
const routerFactory = {
  init(routes, { afterLoginRoute, namespace = null } = {}) {

    // Adicionando o namespace como prefixo a todas as rotas, se houver namespace
    if (_.isPresent(namespace)) {
      routes.forEach((route) => {
        route.path = `${namespace}/${route.path}`.replace(/\/\//g, '/')

        if (typeof route.alias !== 'undefined') {
          route.alias = `${namespace}${route.alias}`
        }
      })
    }


    let router = new Router({
      mode: 'hash',
      routes,

      parseQuery(query) {
        return qs.parse(query)
      },

      stringifyQuery(query) {
        let result = qs.stringify(query, { arrayFormat: 'brackets' })
        return result ? (`?${result}`) : ''
      }
    })


    //
    // HACK mantendo registro da URL anterior!
    // Acompanhar issue https://github.com/vuejs/vue-router/issues/883 para ver
    // quando essa funcionalidade é agregada ao Router!
    router.referrer = null
    const fnOriginalPush = router.push
    router.push = function routerPushKeepingReferrer(...args) {
      this.referrer = router.history.current
      fnOriginalPush.call(router, ...args)
    }

    // Como toda a app requer autenticação, registremos um "navigation guard"
    // global para ela.
    // Veja mais em https://router.vuejs.org/en/advanced/navigation-guards.html
    //   e https://router.vuejs.org/en/advanced/meta.html
    router.beforeEach((to, from, next) => {
      // Se o usuário estiver autenticado e tenta acessar a rota de "login",
      // redirecione-o para a rota "padrão" da app
      if ((to.name === 'login') && auth.isAuthenticated()) {
        next({ name: afterLoginRoute })
        return // early return
      }


      if (to.matched.some(record => record.meta.auth)) {
        // Se a rota necessitar de autenticação (pelo atributo meta.auth), então
        // verificamos se o usuário está autenticado, redirecionando-o à página
        // de login se for o caso.
        if (!auth.isAuthenticated()) {
          next({
            name:  'login',
            query: { redirect: to.fullPath }
          })
          return // early return
        }
      }

      next() // garantindo a invocação de next()!
    })

    // Guardando a rota acessada de maneira navegacional, permitindo que dados
    // sejam carregados de maneira síncrona
    router.afterEach((to, from) => {
      if (!router.navigationalRoute) {
        router.navigationalRoute = to
      }
    })

    return router
  }
}

export default routerFactory
