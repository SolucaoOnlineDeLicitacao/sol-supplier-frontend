import events from './events'


// dados privados
const data = {
  count: 0
}

/**
 * Singleton para controle de status de carregamento da aplicação.
 *
 * Eventos:
 *   - @loading:start
 *       Início de carregamento
 *
 *   - @loading:stop
 *       Encerramento de carregamento
 *
 * @type {Object}
 */
const loading = {
  /**
   * Informa o estado de carregamento da aplicação
   * @return {Boolean} estado de carregamento
   */
  get active() {
    return data.count > 0
  },

  /**
   * Inicia um carregamento.
   * IMPORTANTE isso acrescenta um novo carregamento (contador) ao controle
   * interno do módulo.
   */
  start() {
    data.count++

    events.$emit('loading:start')
  },

  /**
   * Encerra um carregamento. Se a opção `all` for definida como `true`,
   * encerra todos os carregamentos em andamento (contador). Senão, encerra
   * apenas um na contagem
   *
   * @param  {Boolean} all Controla o encerramento de todos os carregamentos. Default - false.
   */
  stop(all = false) {
    if (all) {
      data.count = 0
    } else {
      data.count--
    }

    events.$emit('loading:stop')
  }
}

export default loading
