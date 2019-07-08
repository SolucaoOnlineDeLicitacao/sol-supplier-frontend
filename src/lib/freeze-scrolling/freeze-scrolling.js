/*
  Singleton para controle de "interrupção de scroll" em elementos.
  Foi criado para apoiar os componentes Vue `overlay-wnd` e `modal-wnd`, que
  interrompem o scroll no `body`. Mas, em teoria, deve funcionar para qualquer
  elemento DOM.

  Estamos usando uma combinação de `overflow: hidden`, com `position: fixed` e
  ajustando `top` e o scroll da janela com `window.scrollTo(x, y)`.`

  Assim, para interromper o scroll em um elemento, faça:
  ```javascript
  import freezeControlling from '@/lib/freeze-controlling'

  // "congelando" o scroll do body ou alguma div
  freezeControlling.freeze(document.body)
  freezeControlling.freeze(document.querySelector('.special-container'))


  // para verificar programaticamente se estão "congelados", faça:
  freezeControlling.isFrozen(document.body) // true ou false

  // E, após algum processamento, "libere" o scroll novamente
  freezeControlling.release(document.body)
  freezeControlling.release(document.querySelector('.special-container'))
  ````

  ## advanced (internals)
  O singleton cria ids únicos (para ele) para qualquer elemento "gerenciado".
  Esses `id` ficam no `dataset.freezeScrollingId` (que aparecem como atributo
  `data-freeze-scrolling-id` no elemento).
  Enquanto houver esse `id` (e data-attr*), o elemento deve estar "congelado".
  A partir do momento em que ele seja "liberado" (`freezeControlling.release(elem)`),
  ele perde esse (data-attr*).
 */

const data = {
  gid:   1,
  elems: {}
}


function freezingStyle() {
  return {
    position: 'fixed',
    top:      `-${window.scrollY}px`,
    left:     '0',
    right:    '0',
    overflow: 'hidden',
    webkitOverflowScrolling: 'auto'  // -webkit-overflow-scrolling: auto; (@https://stackoverflow.com/a/44761635)
  }
}

// getset id for element
function idFor(elem) {
  return elem.dataset.freezeScrollingId
}

function eraseDataFor(elem) {
  let id = idFor(elem)

  delete data.elems[id]
  delete elem.dataset.freezeScrollingId
}

function fetchDataFor(elem) {
  let id = idFor(elem)
  return data.elems[id]
}

function storeDataFor(elem) {
  let id = idFor(elem)

  if (!data.elems[id]) data.elems[id] = {}

  data.elems[id].releaseStyle = {
    position: elem.style.position,
    top:      elem.style.top,
    left:     elem.style.left,
    right:    elem.style.right,
    overflow: elem.style.overflow,
    webkitOverflowScrolling: elem.style.webkitOverflowScrolling
  }

  data.elems[id].scroll = {
    x: window.scrollX,
    y: window.scrollY
  }
}

/**
 * Componente para controle de "scroll" em elementos.
 */
const freezeScrolling = {
  freeze(elem) {
    // já tem id, então está congelado e sendo gerenciado!
    if (idFor(elem)) return

    // se não houver id, ainda não estamos gerenciando o elemento.
    // vamos gerar um id para ele.
    let id = data.gid++
    elem.dataset.freezeScrollingId = id

    storeDataFor(elem)
    Object.assign(elem.style, freezingStyle())
  },

  release(elem) {
    let id = idFor(elem)
    // se não houver id, não estamos gerenciando o elemento (congelamento). ignore-o!
    if (!id) return

    let { releaseStyle, scroll } = fetchDataFor(elem)
    Object.assign(elem.style, releaseStyle)
    window.scrollTo(scroll.x, scroll.y)

    eraseDataFor(elem)
  },

  isFrozen(elem) {
    // se tiver id, então está congelado e sendo gerenciado!
    return !!idFor(elem)
  }
}

export default freezeScrolling
