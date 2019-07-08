import _ from 'lodash'

/**
 * Cria um novo objeto transformando todas as propriedades em nomes no formato
 * 'snake_case'. Bastante útil na adaptação de objetos para envio de parâmetros
 * a APIs.
 *
 * Ex: let json = { first: 1, secondPlace: 2, ThirdOne: 3 }
 *     =>
 *     _.snakeizeKeys(json) == { first: 1, second_place: 2, third_one: 3 }
 *
 * @param  {Object} object objeto a ter suas "chaves" transformadas
 * @return {Object}        objeto "clone", com todas as "chaves" em formato "snake_case"
 */
function deepSnakeizeKeys(object) {
  let snakeized = _.cloneDeep(object)

  Object.keys(object).forEach((key) => {
    let value = object[key]

    // checks that a value is a plain object or an array - for recursive key conversion
    // recursively update keys of any values that are also objects
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = deepSnakeizeKeys(value)
      snakeized[key] = value
    }

    const snakeizedKey = _.snakeCase(key)
    if (snakeizedKey !== key) {
      snakeized[snakeizedKey] = value
      delete snakeized[key]
    }
  })

  return snakeized
}

function snakeizeKeys(value) {
  if (typeof (value) === 'object') {
    return deepSnakeizeKeys(value)
  }
  return _.snakeCase(value)
}

export default snakeizeKeys
