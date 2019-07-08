// Singleton de eventos - Vue Bus Event
//   bus para eventos entre componentes (não pai-filho)
//   Veja mais em https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
import Vue from 'vue'

// Esse é o bus "de fato"
const bus = new Vue()

// events é um Proxy para o bus!
const events = {

  /**
   * Emite evento globalmente
   * @param  {...[type]} args [description]
   * @return {[type]}         [description]
   */
  $emit(...args) {
    return bus.$emit(...args)
  },

  /**
   * Registra observer para evento
   * @param  {...[type]} args [description]
   * @return {[type]}         [description]
   */
  $on(...args) {
    return bus.$on(...args)
  },

  /**
   * Registra observer para evento uma única vez
   * @param  {...[type]} args [description]
   * @return {[type]}         [description]
   */
  $once(...args) {
    return bus.$once(...args)
  },

  /**
   * Remove observer para evento
   * @param  {...[type]} args [description]
   * @return {[type]}         [description]
   */
  $off(...args) {
    return bus.$off(...args)
  }
}

export default events
