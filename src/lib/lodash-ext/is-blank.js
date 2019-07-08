import _ from 'lodash'

var isBlank = function isBlank(value) {
  return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value);
}

var isPresent = function isPresent(obj) {
  return !isBlank(obj);
};

export { isBlank, isPresent }
