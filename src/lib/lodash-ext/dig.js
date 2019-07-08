import _ from 'lodash'

/**
 * Busca por propriedades aninhadas em um Objeto, verificando a existência
 * do "caminho" todo.
 * Inspirado no método Ruby Object#dig
 *
 * Ex: let family = { parent: { child: "Okay!" } }
 *     =>
 *     _.dig(family, 'parent', 'child')  === "Okay!"
 *     _.dig(family, 'parent', 'child', 'grandchild')  === undefined
 *     _.dig(family, 'no', 'not really') === undefined
 *
 * @param  {Object}    object Objeto a ser "perfurado"
 * @param  {...String} keys   Chaves sequenciais que definem o caminho da "perfuração"
 * @return {Object}           Valor da propriedade aninhada ou `undefined` se não existir
 */
function dig(object, ...keys) {
  let dug = object

  for (let i = 0; i < keys.length; i++) {
    if (!_.isObjectLike(dug)) {
      return dug
    }

    const key = keys[i]
    dug = dug[key]
  }

  return dug
}

export default dig
