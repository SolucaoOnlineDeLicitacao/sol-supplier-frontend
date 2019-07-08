// Veja como cria um plugin em https://vuejs.org/v2/guide/plugins.html

/**
 *   Vue Plugin para facilitar a verificação de se o elemento está visível no
 * viewport, fornecendo o método de instância `$isVisible(options = {})`
 *
 * @type {VuePlugin}
 */
const VueIsVisible = {
  installed: false,

  install(Vue, options) {
    if (VueIsVisible.installed) return
    VueIsVisible.installed = true

    // adiciona método $isVisible()
    /**
     * [$isVisible description]
     * @param  {DOMElement}  options.el     Elemento a ser verificado. Default para $el (Vue).
     * @param  {String}      options.offset Valores possíveis: 'width' ou 'height',
     *                                      para usar o tamanho do elemento.
     *
     * @return {Boolean}                    Indica a visibilidade no viewport
     */
    Vue.prototype.$isVisible = function $isVisible({ el, offset } = {}) {
      let elem = el || this.$el

      let rect = elem.getBoundingClientRect()
      // permitindo um offset para "pre-carregar" os elementos próximos à borda
      // do viewport. Os possíveis valores são
      let offsetSize = offset ? rect[offset] : 0

      let viewportHeight = (window.innerHeight || document.documentElement.clientHeight)
      let viewportWidth = (window.innerWidth || document.documentElement.clientWidth)

      let isVisible = (
        ( // verificação vertical
          ((rect.top >= 0) && (rect.top <= viewportHeight + offsetSize)) ||
          ((rect.bottom >= -offsetSize) && (rect.bottom <= viewportHeight))
        ) && ( // verificação horizontal
          ((rect.left >= 0) && (rect.left <= viewportWidth + offsetSize)) ||
          ((rect.right >= -offsetSize) && (rect.right <= viewportWidth))
        )
      )

      return isVisible
    }
  }
}

export default VueIsVisible
