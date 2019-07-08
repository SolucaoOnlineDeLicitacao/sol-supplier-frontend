import _ from 'lodash'

/**
 * Cria um novo objeto transformando todas as propriedades em nomes no formato
 * 'camelCase'. Bastante útil na adaptação de objetos JSON provenientes de API.
 *
 * Ex: let json = { first: 1, second-place: 2, third_one: 3 }
 *     =>
 *     _.camelizeKeys(json) == { first: 1, secondPlace: 2, thirdOne: 3 }
 *
 * @param  {Object} object objeto a ter suas "chaves" transformadas
 * @return {Object}        objeto "clone", com todas as "chaves" em formato "camelCase"
 */
function deepCamelizeKeys(object) {
  let camelized = _.cloneDeep(object)

  Object.keys(object).forEach((key) => {
    let value = object[key]

    // checks that a value is a plain object or an array - for recursive key conversion
    // recursively update keys of any values that are also objects
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = deepCamelizeKeys(value)
      camelized[key] = value
    }

    const camelizedKey = _.camelCase(key)
    if (camelizedKey !== key) {
      camelized[camelizedKey] = value
      delete camelized[key]
    }
  })

  return camelized
}

function camelizeKeys(value) {
  if (typeof (value) === 'object') {
    return deepCamelizeKeys(value)
  }
  return _.camelCase(value)
}

export default camelizeKeys
