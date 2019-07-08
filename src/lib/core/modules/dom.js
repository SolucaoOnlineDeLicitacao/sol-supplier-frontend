/**
 * Singleton de utilidades para manipulação do DOM
 *
 * @type {Object}
 */
const dom = {
  fetchMeta(name, defaultValue = null) {
    const tag = document.querySelector(`meta[name="${name}"]`)

    return tag ? tag.getAttribute('content') : defaultValue
  },

  fetchMetaJSON(name, defaultValue = null) {
    let stringJSON = this.fetchMeta(name)

    return stringJSON ? JSON.parse(stringJSON) : defaultValue
  },

  setMeta(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`)

    // Esse mecanismo existe para "receber dados do servidor". Assim, caso a
    // <meta> não exista, falharemos com uma exceção!

    tag.setAttribute('content', content)
  },

  /**
   * Gets complete height of element, including margins (top and bottom).
   * Works like jQuery `outerHeight()` method.
   *
   * ref: https://stackoverflow.com/a/23749355
   *
   * @param  {String|DOMElement} el the target element
   * @return {Integer}     the complete height, in pixels.
   */
  outerHeight(el) {
    // Get the DOM Node if you pass in a string
    let elem = (typeof el === 'string') ? document.querySelector(el) : el

    let styles = window.getComputedStyle(elem)
    let margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)

    return Math.ceil(el.offsetHeight + margin)
  }
}

export default dom
