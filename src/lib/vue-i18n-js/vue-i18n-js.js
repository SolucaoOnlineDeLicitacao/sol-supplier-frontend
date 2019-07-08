// Veja como cria um plugin em https://vuejs.org/v2/guide/plugins.html

/**
 *   Plugin para utilização de um módulo de I18n dentro de instâncias Vue,
 * fornecendo métodos simples `$t` para "translate" e `$l` para "localize"
 *

 *   Assim, nos seus templates, faça:
 * ```pug
 *   button(type="button") {{ $t('btn.subscribe') }}
 *   span.date {{ $l('date.formats.short', new Date()) }}
 *   span.money {{ $l("currency", 1990.99) }}
 *   span.number {{ $l("number", 1990.99) }}
 * ```
 *
 *   Ainda, é possível fazer "lazu lookup" de traduções. Veja:
 * ```javascript
 * data() {
 *   return {
 *     i18nScope: 'meu.componente'
 *   }
 * },
 *
 * methods: {
 *   successMessage() {
 *     // chave iniciando com '.' indica lazy lookup
 *     return this.$t('.success') // -> recupera tradução de 'meu.componente.success'
 *   }
 * }
 *
 * @type {VuePlugin}
 */
const VueI18nJS = {
  installed: false,

  install(Vue, options) {
    if (VueI18nJS.installed) return
    VueI18nJS.installed = true

    const i18n = options.i18n

    // adiciona propriedade `$i18n` (getter) nas instâncias Vue
    Object.defineProperty(Vue.prototype, '$i18n', {
      get() { return i18n }
    })

    // "delegando" métodos ao módulo de i18n
    Vue.prototype.$l = i18n.l.bind(i18n)
    Vue.prototype.$t = function vue$t(key, tOptions = {}) {
      // lazy lookup de tradução baseando-se no escopo padrão definido
      // em `this.i18nScope` - que deve ser definido no `data()`
      // de um componente!
      if (key && key.startsWith('.') && this.i18nScope) {
        tOptions.scope = this.i18nScope
        key = key.replace(/^\./, '')
      }

      const translation = i18n.t(key, tOptions)
      return translation
    }

    Vue.prototype.$asCurrency = i18n.toCurrency.bind(i18n)
    Vue.prototype.$asDate = i18n.strftime.bind(i18n)
    Vue.prototype.$asHumanSize = i18n.toHumanSize.bind(i18n)
    Vue.prototype.$asNumber = i18n.toNumber.bind(i18n)
    Vue.prototype.$asPercentage = i18n.toPercentage.bind(i18n)
    Vue.prototype.$fromNow = i18n.fromNow.bind(i18n)
  }
}

export default VueI18nJS
