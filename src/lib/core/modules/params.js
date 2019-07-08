import _ from '@/lib/lodash-ext'

/**
 * Singleton de utilidades para parsear valores da URL (params, query string).
 *
 * Por padrão, provê facilidades para, em caso de o valor ser "vazio", retornar
 * `undefined` ou algum valor padrão desejado - muito útil em definir properties
 * a partir de rotas (VueRouter).
 *
 * @type {Object}
 */
const params = {
  /**
   * Interpreta o valor como Boolean. Caso não consiga, retorna
   * options.defaultValue - que por padrão é `undefined`.
   *
   * @param  {[type]} value   [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  asBoolean(value, options = {}) {
    const { defaultValue } = options
    let boolean = defaultValue

    if (value === 'false' || value === false) {
      boolean = false
    } else if (value === 'true' || value === true) {
      boolean = true
    }

    return boolean
  },

  /**
   * Interpreta o valor como Float. Caso não consiga, retorna
   * options.defaultValue - que por padrão é `undefined`.
   *
   * @param  {[type]} value   [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  asFloat(value, options = {}) {
    const { defaultValue } = options
    const float = parseFloat(value)

    return isNaN(float) ? defaultValue : float
  },

  /**
   * Interpreta o valor como Integer. Caso não consiga, retorna
   * options.defaultValue - que por padrão é `undefined`.
   *
   * @param  {[type]} value   [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  asInteger(value, options = {}) {
    const { defaultValue } = options
    const int = parseInt(value, 10)

    return isNaN(int) ? defaultValue : int
  },


  asObject(value, options = {}) {
    const { defaultValue } = options

    let object = defaultValue

    if (typeof value === 'object') {
      object = value
    }

    return object
  },

  /**
   * Interpreta o valor como String. Caso seja String vazia (`''`), retorna
   * options.defaultValue - que por padrão é `undefined`.
   *
   * @param  {[type]} value   [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  asString(value, options = {}) {
    const { defaultValue } = options

    return (value && value.toString()) || defaultValue
  },

  /**
   *  Interpreta múltiplos valores de um objeto de acordo com um objeto de
   * configuração - utilizando os métodos de interpretação de tipos desse módulo.
   * Ex:
   *   params.parse({ number: '11' }, { number: 'integer' })
   *   // retornará a propriedade 'number' parseada como 'integer' (usando `asInteger`)
   *
   * Bastante útil para interpretar parâmetros de rota (VueRouter).
   * Ex:
   * ```javascript
   * // num componente Vue:
   * let params = {}
   * Object.assign(
   *   params,
   *   this.$params.parse(this.$route.query, {
   *     address:   'string',
   *     available: 'string',
   *     code:      'integer',
   *     phone:     'string',
   *     since:     'string',
   *     state:     'string',
   *     type:      'string',
   *
   *     // paging and sorting
   *     page:  'integer',
   *     sort:  'string',
   *     order: 'string'
   *   })
   * )
   * ````
   *
   * @param  {Object} object Objeto com valores a serem interpretados
   * @param  {Object} config Objeto de configuração. Mapa <nomePropriedade,tipo>
   * @return {Object}        Objeto resultado da interpretação definida
   */
  parse(object, config = {}) {
    let params = {}

    Object.keys(config).forEach((param) => {
      let type = config[param]

      let cast = this[`as${_.capitalize(type)}`]
      if (!cast) throw `[module params] cannot parse unknown type ${type}`

      params[param] = cast(object[param])
    })

    return params
  },

  /**
   * Prepara parametros que serão enviados para o servidor.
   * Transforma as 'keys' em snake_case e remove 'keys' vazias
   *
   * @param  {Object} params  a ser "limpado"
   * @return {[type]}         [description]
   */
  toRouteParams(params) {
    let snakeized = _.snakeizeKeys(params)
    return _.deleteBlanks(snakeized)
  }
}

export default params
