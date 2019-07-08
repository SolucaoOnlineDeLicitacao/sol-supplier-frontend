import _ from 'lodash'
import camelizeKeys from './camelize-keys'
import deleteBlanks from './delete-blanks'
import dig from './dig'
import { isBlank, isPresent } from './is-blank'
import snakeizeKeys from './snakeize-keys'

const lodashExt = Object.assign({}, _, {

  // transformando keys/props de objetos, facilitando trânsito Rails <-> JS
  camelizeKeys,
  snakeizeKeys,
  deleteBlanks,
  dig,

  // rails like #blank? and #present?
  isBlank,
  isPresent,

  // alguns alias para facilitar o trânsito Rails <-> JS
  camelize:   _.camelCase,
  capitalize: _.capitalize, // para deixar explícito
  dasherize:  _.kebabCase,
  underscore: _.snakeCase,
  snakeize:   _.snakeCase,

  clone:    _.cloneDeep,
  extend:   _.extend,     // para deixar explícito
  merge:    _.merge,      // para deixar explícito
  equals:   _.isEqual,
  contains: _.isMatch

})

export default lodashExt
