import Mask from './mask'


function createMask(el, binding) {
  let options = {}
  let mask

  if (typeof binding.value === 'object') {
    mask = binding.value.mask
    options = binding.value.options || {}
  } else { // string ou function
    mask = binding.value // string pronta
  }

  // Usando mesmo dataset do Mask.js - é usado internamente para previnir
  // sobrescrita de `autocomplete`, por ex.
  el.dataset.mask = mask
  el.$vMask = new Mask(el, mask, options)
}

function removeMask(el) {
  el.$vMask.remove()
  delete el.dataset.mask
}


/**
 * Vue directive definition
 */
const VueMaskDirective = {
  /**
   * Called only once, when the directive is first bound to the element.
   * This is where you can do one-time setup work.
   */
  bind(el, binding, vnode) {
    // ignorando diretivas com valores vazios
    if (!binding.value) return

    // 'name: '       + s(binding.name) + '<br>' +
    // 'value: '      + s(binding.value) + '<br>' +
    // 'value: '      + s(binding.oldValue) + '<br>' +
    // 'expression: ' + s(binding.expression) + '<br>' +
    // 'argument: '   + s(binding.arg) + '<br>' +
    // 'modifiers: '  + s(binding.modifiers) + '<br>' +
    // 'vnode keys: ' + Object.keys(vnode).join(', ')
    createMask(el, binding)
  },

  /**
   * Called after the containing component has updated,
   * but possibly before its children have updated.
   * The directive’s value may or may not have changed,
   * but you can skip unnecessary updates by comparing the
   * binding’s current and old values.
   */
  componentUpdated(el, binding, vnode, oldVnode) {
    // ignorando diretivas com valores vazios
    if (!el.$vMask) return

    let isChanged = JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)

    // update mask first if changed
    if (isChanged) {
      removeMask(el)
      createMask(el, binding)
    }
  },

  /**
   * Called only once, when the directive is unbound from the element.
   */
  unbind(el, binding, vnode) {
    // ignorando diretivas com valores vazios
    if (!el.$vMask) return

    removeMask(el)
  }
}


/**
 * Vue plugin definition
 * @param {Vue} Vue
 */
const VueMaskPlugin = function vueMaskPlugin(Vue) {
  Vue.directive('mask', VueMaskDirective)
}


export { VueMaskPlugin as default, VueMaskPlugin, VueMaskDirective }
