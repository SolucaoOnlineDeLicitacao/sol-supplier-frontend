import i18n from 'i18n-js'
import store from 'store'
import translations from '@/config/locales'
import moment from 'moment'

/**
 * Nosso módulo de I18n é basicamente a lib i18n-js (@https://github.com/fnando/i18n-js)
 */
i18n.availableLocales = ['pt-BR', 'en-US', 'es-PY', 'fr-FR']
i18n.defaultLocale = 'pt-BR'

let locale = store.get('user') && store.get('user').locale || i18n.defaultLocale

i18n.locale = locale

i18n.translations = translations

moment.locale(locale)

// Sobrecarregando método i18n.localize(), para que repasse corretamente as
// opções aos métodos `toCurrency()`, `toNumber()` e `toPercentage()`
//   - TODO abrir PR para i18n-js (https://github.com/fnando/i18n-js)
i18n.__localize = i18n.localize
i18n.localize = function overridenLocalize(scope, value, options) {
  options = options || {}

  switch (scope) {
    case 'currency':
      return this.toCurrency(value, options)
    case 'number':
      options = this.prepareOptions(
        options,
        this.lookup('number.format')
      )
      return this.toNumber(value, options)
    case 'percentage':
      return this.toPercentage(value, options)
    default:
      // default implementation
      return this.__localize(scope, value, options)
  }
}

// XXX atualizando alias, uma vez que sobrecarregamos o método
i18n.l = i18n.localize

/**
 * Traduz (i18n) mensagens de erro baseada em seu código e possível escopo
 *
 * @param  {String} code      Código de erro a ser traduzido.
 * @param  {String} attribute Nome do atributo que gerou o erro.
 * @param  {String} model     Nome do model que gerou o erro.
 * @return {String}           Mensagem de erro traduzida.
 */
i18n.error = function i18nError(code, attribute, model) {
  let scope = 'errors'
  if (attribute) scope += `.${attribute}`
  if (model) scope = `models.${model}.${scope}`

  return this.t(`${scope}.${code}`, { defaults: [{ scope: `errors.${code}` }] })
}


i18n.fromNow = function i18nFromNow(value) {
  return moment(value).fromNow()
}

/**
 * Transforma um payload JSON de erros em um mapa de erros traduzidos, usando
 * `i18n.error()`.
 * Exemplo de uso:
 * ```javascript
 * http.patch('users/13', { name: 'Nome corrigido '})
 *   .then((response) => { facaAlgoComSucesso(response.data) })
 *   .catch((err) => {
 *      // `{ name: 'invalid' }` -> código de erro 'invalid' para atributo 'name'
 *      let responseErrors = _.camelize(_.dig(err, 'response', 'data', 'errors') || {})
 *      // `{ name: 'não é válido' }` -> mensagem de erro 'não é válido' para atributo 'name'
 *      let errorMessages = this.$i18n.errify(errors, { model: 'user' })
 *      facaAlgoComErro(errorMessages)
 *   })
 * ````
 *
 * @param  {Object} errors          Retorno de endpoints JSON, com mapa de erros <attribute,code>
 * @param  {Object} options.model } Nome do model que gerou os erros.
 * @return {Object}                 Mapa <attribute,i18nMessage> com mensagens de erro traduzidas.
 */
i18n.errify = function i18nErrify(errors, { model } = {}) {
  let messages = {}

  Object.keys(errors).forEach((attrName) => {
    let code = errors[attrName]
    messages[attrName] = i18n.error(code, attrName, model)
  })

  return messages
}

export default i18n
