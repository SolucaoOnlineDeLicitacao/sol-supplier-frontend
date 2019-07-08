import _ from 'lodash'

/**
 * Remove 'keys' com valores 'null', 'undefined' ou objetos vazios
 *
 * Ex: let obj = { value1: "valor1", value2: undefined, value3: null, value4: {} }
 *     =>
 *     _.deleteBlanks(obj) === { value1: "valor1" }
 *
 * @param  {Object}    object Objeto a ser "limpado"
 * @return {Object}           Cópia do objeto sem os elementos em branco.
 */
function deleteBlanks(object) {
  let presents = _.cloneDeep(object)

  Object.keys(presents).forEach((key) => {
    let value = presents[key]

    if (_.isPlainObject(value) || _.isArray(value)) {
      presents[key] = deleteBlanks(value)
      if (_.isEmpty(presents[key])) delete presents[key]

    } else if (value === null || value === undefined) {
      delete presents[key]
    }
  })
  return presents
}

export default deleteBlanks
