import events from './events'

/**
 *  Singleton para controle de notificações da aplicação, disparando os eventos
 * necessários.
 *
 * IMPORTANT utilize o componente `notifications.vue` para integrar com a UI
 *
 * @type {Object}
 */
const notifications = {
  /**
   *   Remove todas as notificações existentes.
   */
  clear() {
    events.$emit('notifications:clear')
  },

  /**
   *  Adiciona uma notificação com level "error" - útil para informar falhas
   * em algum processamento (ex: salvar um cadastro)
   *
   * @param  {String}  message conteúdo da notificação
   * @param  {Boolean} dismiss requer remoção automática. Default: true.
   */
  error(message, dismiss = true) {
    events.$emit('notifications:error', message, dismiss)
  },

  /**
   *  Adiciona uma notificação com level "info" - útil para informar sucesso
   * de algum processamento (ex: salvar um cadastro)
   *
   * @param  {String}  message conteúdo da notificação
   * @param  {Boolean} dismiss requer remoção automática. Default: true.
   */
  info(message, dismiss = true) {
    events.$emit('notifications:info', message, dismiss)
  },

  /**
   *  Adiciona uma notificação com level "warn" - útil para informar alguma
   * "condição adversa" (ex: falha em API de terceiros)
   *
   * @param  {String}  message conteúdo da notificação
   * @param  {Boolean} dismiss requer remoção automática. Default: true.
   */
  warn(message, dismiss = true) {
    events.$emit('notifications:warning', message, dismiss)
  }
}

export default notifications
