//
// Based on https://github.com/igorescobar/jQuery-Mask-Plugin, and ported to
// ES6 and Vue (some extra `input` events).
//
// docs: https://igorescobar.github.io/jQuery-Mask-Plugin/
//


// helper functions
function notSameMaskObject(field, mask, opts) {
  let options = opts || {}
  let maskObject = field.dataset.mask
  let value = field.value || field.textContent
  let stringify = JSON.stringify

  try {
    let maskedValue = mask

    if (typeof mask === 'function') {
      maskedValue = mask(value)
    }

    return typeof maskObject !== 'object' ||
           stringify(maskObject.options) !== stringify(options) ||
           maskObject.mask !== maskedValue

  } catch (e) {}
}

function HTMLAttributes() {
  let input = this
  let options = {}
  // let prefix = 'data-mask-'
  let mask = input.dataset.mask

  if (input.dataset.maskReverse) {
    options.reverse = true
  }

  if (input.dataset.maskClearifnotmatch) {
    options.clearIfNotMatch = true
  }

  if (input.dataset.maskSelectonfocus) {
    options.selectOnFocus = true
  }

  if (notSameMaskObject(input, mask, options)) {
    return input.dataset.mask = new Mask(this, mask, options)
  }
}

function eventSupported(eventName) {
  let el = document.createElement('div')
  let isSupported = false
  let eventListenerAttribute = `on${eventName}`

  isSupported = (eventListenerAttribute in el)

  if (!isSupported) {
    el.setAttribute(eventListenerAttribute, 'return;')
    isSupported = typeof el[eventListenerAttribute] === 'function'
  }

  return isSupported
}


// global config options
const globals = {
  maskElements:  'input,td,span,div',
  dataMaskAttr:  '*[data-mask]',
  dataMask:      true,
  watchInterval: 300,
  watchInputs:   true,
  // old versions of chrome dont work great with input event
  useInput:      !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
  watchDataMask: false,
  byPassKeys:    [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],

  /* eslint-disable quote-props */
  translation: {
    '0': { pattern: /\d/ },
    '9': { pattern: /\d/, optional: true },
    '#': { pattern: /\d/, recursive: true },
    'A': { pattern: /[a-zA-Z0-9]/ },
    'S': { pattern: /[a-zA-Z]/ },
    'M': { pattern: /[-+]/, optional: true }
  },
  /* eslint-enable quote-props */

  clearIfNotMatch: null // TODO qual o valor default?!
}


class Mask {
  static get globals() {
    return globals
  }

  constructor(el, mask, options) {
    // data
    this.invalid = []

    // verificar necessidade do .bind(this) nos listeners
    this.eventListeners = [{
      events:   ['keydown'],
      listener: (evt) => {
        this.el.dataset.maskKeycode = evt.keyCode || evt.which
        this.el.dataset.maskPreviousValue = this.el.value
        this.el.dataset.maskPreviousCaretPos = this.getCaret()
        this.maskDigitPosMapOld = this.maskDigitPosMap
      }
    }, {
      events:   [Mask.globals.useInput ? 'input' : 'keyup'],
      listener: (evt) => {
        this.behaviour(evt)
      }
    }, {
      events:   ['paste', 'drop'],
      listener: (evt) => {
        setTimeout(() => {
          this.el.dispatchEvent(new Event('keydown'))
          this.el.dispatchEvent(new Event('keyup'))
        }, 100)
      }
    }, {
      events:   ['change'],
      listener: (evt) => {
        this.el.dataset.changed = true
      }
    }, {
      events:   ['blur'],
      listener: (evt) => {
        if (this.oldValue !== this.val() && !this.el.dataset.changed) {
          this.el.dispatchEvent(new Event('change'))
        }

        this.el.dataset.changed = false
      }
    }, {
      // TODO ENTENDER ESSE COMENTÁRIO
      // it's very important that this callback remains in this position
      // otherwhise oldValue it's going to work buggy
      events:   ['blur'],
      listener: (evt) => {
        this.oldValue = this.val()
      }
    }, {
      // select all text on focus
      events:   ['focus'],
      listener: (evt) => {
        if (this.options.selectOnFocus === true) {
          evt.target.dispatchEvent(new Event('select'))
        }
      }
    }, {
      // clear the value if it not complete the mask
      events:   ['focusout'],
      listener: (evt) => {
        if (this.options.clearIfNotMatch && !this.regexMask.test(this.val())) {
          this.val('')
        }
      }
    }]


    // init do jMask
    this.el = el
    this.options = options
    this.mask = typeof mask === 'function' ? mask(this.val(), undefined, this.el, this.options) : mask
    this.oldValue = this.val()

    this.clearIfNotMatch = Mask.globals.clearIfNotMatch
    this.byPassKeys = Mask.globals.byPassKeys
    this.translation = Object.assign({}, Mask.globals.translation, options.translation)

    Object.assign(this, options) // TODO ???
    // jMask = $.extend(true, {}, jMask, options);

    this.regexMask = this.getRegexMask()


    let init = (onlyMask) => {
      if (onlyMask) {
        this.events()
        this.val(this.getMasked())
      } else {
        if (options.placeholder) {
          this.el.setAttribute('placeholder', options.placeholder)
        }

        // this is necessary, otherwise if the user submit the form
        // and then press the "back" button, the autocomplete will erase
        // the data. Works fine on IE9+, FF, Opera, Safari.
        if (this.el.dataset.mask) {
          this.el.setAttribute('autocomplete', 'off')
        }

        // detect if is necessary let the user type freely.
        // for is a lot faster than forEach.
        let maxlength = true
        for (let i = 0; i < mask.length; i++) {
          let translation = this.translation[mask.charAt(i)]
          if (translation && translation.recursive) {
            maxlength = false
            break
          }
        }

        if (maxlength) {
          el.setAttribute('maxlength', mask.length)
        }

        this.destroyEvents() // ???
        this.events()

        let caret = this.getCaret()
        this.val(this.getMasked())
        this.setCaret(caret)

        setTimeout(() => {
          let nextCaretPosition = this.calculateCaretPosition()
          this.setCaret(nextCaretPosition)
        }, 10)
      }
    }
    init(this.el.nodeName !== 'INPUT')

  } // [end] constructor


  getCaret() {
    try {
      let sel
      let pos = 0
      let ctrl = this.el
      let dSel = document.selection
      let cSelStart = ctrl.selectionStart

      /* eslint-disable brace-style */
      // IE Support
      if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
        sel = dSel.createRange()
        sel.moveStart('character', -this.val().length)
        pos = sel.text.length
      }
      // Firefox support
      else if (cSelStart || cSelStart === '0') {
        pos = cSelStart
      }
      /* eslint-enable brace-style */

      return pos
    } catch (e) { return undefined }
  }


  setCaret(pos) {
    try {
      if (document.activeElement === this.el) { // is(':focus')
        let range
        let ctrl = this.el

        // Firefox, WebKit, etc..
        if (ctrl.setSelectionRange) {
          ctrl.setSelectionRange(pos, pos)
        } else { // IE
          range = ctrl.createTextRange()
          range.collapse(true)
          range.moveEnd('character', pos)
          range.moveStart('character', pos)
          range.select()
        }
      }
    } catch (e) {}
  }


  events() {
    this.eventListeners.forEach(({ events, listener }) => {
      events.forEach((eventName) => {
        this.el.addEventListener(eventName, listener)
      })
    })
  }

  destroyEvents() {
    this.eventListeners.forEach(({ events, listener }) => {
      events.forEach((eventName) => {
        this.el.removeEventListener(eventName, listener)
      })
    })
  }


  getRegexMask() {
    let maskChunks = []
    let translation
    let pattern
    let optional
    let recursive
    let oRecursive
    let r

    let mask = this.mask

    for (let i = 0; i < mask.length; i++) {
      translation = this.translation[mask.charAt(i)]

      if (translation) {
        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '')
        optional = translation.optional
        recursive = translation.recursive

        if (recursive) {
          maskChunks.push(mask.charAt(i))
          oRecursive = { digit: mask.charAt(i), pattern }
        } else {
          maskChunks.push(!optional && !recursive ? pattern : `${pattern}?`)
        }
      } else {
        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      }
    }

    r = maskChunks.join('')

    if (oRecursive) {
      // r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
      r = r.replace(new RegExp(`(${oRecursive.digit}(.*${oRecursive.digit})?)`), '($1)?')
           .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern)
    }

    return new RegExp(r)
  }



  // getter/setter
  val(v) {
    let isInput = this.el.nodeName === 'INPUT'
    let property = isInput ? 'value' : 'textContent'

    if (arguments.length > 0) { // setter
      if (this.el[property] !== v) {
        this.el[property] = v

        // XXX emitindo `input` para trocar valor no Vue (v-model para input)
        if (isInput) {
          this.el.dispatchEvent(new Event(Mask.globals.useInput ? 'input' : 'keyup'))
        }
      }
    } else { // getter
      return this.el[property]
    }
  }


  calculateCaretPosition() {
    let oldVal = this.el.dataset.maskPreviousValue || ''
    let newVal = this.getMasked()
    let caretPosNew = this.getCaret()

    // se não houve mudança, early return
    if (oldVal === newVal) return caretPosNew

    // senão, calcula posição do cursor
    let caretPosOld = this.el.dataset.maskPreviousCaretPos || 0
    let newValL = newVal.length
    let oldValL = oldVal.length
    let maskDigitsBeforeCaret = 0
    let maskDigitsAfterCaret = 0
    let maskDigitsBeforeCaretAll = 0
    let maskDigitsBeforeCaretAllOld = 0
    let i = 0

    // XXX garantindo a existencia dos mapas de posição
    this.maskDigitPosMap = this.maskDigitPosMap || {}
    this.maskDigitPosMapOld = this.maskDigitPosMapOld || {}

    for (i = caretPosNew; i < newValL; i++) {
      if (!this.maskDigitPosMap[i]) break

      maskDigitsAfterCaret++
    }

    for (i = caretPosNew - 1; i >= 0; i--) {
      if (!this.maskDigitPosMap[i]) break

      maskDigitsBeforeCaret++
    }

    for (i = caretPosNew - 1; i >= 0; i--) {
      if (this.maskDigitPosMap[i]) {
        maskDigitsBeforeCaretAll++
      }
    }

    for (i = caretPosOld - 1; i >= 0; i--) {
      if (this.maskDigitPosMapOld[i]) {
        maskDigitsBeforeCaretAllOld++
      }
    }

    if (caretPosNew > oldValL) {
      // if the cursor is at the end keep it there
      caretPosNew = newValL
    } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
      if (!this.maskDigitPosMapOld[caretPosNew]) {
        let caretPos = caretPosNew
        caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll
        caretPosNew -= maskDigitsBeforeCaret
        if (this.maskDigitPosMap[caretPosNew]) {
          caretPosNew = caretPos
        }
      }
    } else if (caretPosNew > caretPosOld) {
      caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld
      caretPosNew += maskDigitsAfterCaret
    }

    return caretPosNew
  }


  behaviour(evt) {
    // XXX ignorando evento "extra" de `input` para processar o Vue, emitido
    // no método val(v) [setter]!
    if (this.oldValue === this.val()) return

    let event = evt || window.event
    this.invalid = []

    let keyCode = this.el.dataset.maskKeycode

    if (this.byPassKeys.indexOf(keyCode) === -1) {
      let newVal   = this.getMasked()
      let caretPos = this.getCaret()

      setTimeout(() => {
        let nextCaretPosition = this.calculateCaretPosition()
        this.setCaret(nextCaretPosition)
      }, 10)

      this.val(newVal)
      this.setCaret(caretPos)
      return this.callbacks(event)
    }
  }

  getMasked(skipMaskChars, val) {
    let buf = []
    let value = val === undefined ? this.val() : (val + '')
    let m = 0
    let maskLen = this.mask.length
    let v = 0
    let valLen = value.length
    let offset = 1
    let addMethod = 'push'
    let resetPos = -1
    let maskDigitCount = 0
    let maskDigitPosArr = []
    let lastMaskChar
    let check

    if (this.options.reverse) {
      addMethod = 'unshift'
      offset = -1
      lastMaskChar = 0
      m = maskLen - 1
      v = valLen - 1
      check = () => m > -1 && v > -1
    } else {
      lastMaskChar = maskLen - 1
      check = () => m < maskLen && v < valLen
    }


    let lastUntranslatedMaskChar

    while (check()) {
      let maskDigit = this.mask.charAt(m)
      let valDigit = value.charAt(v)
      let translation = this.translation[maskDigit]

      if (translation) {
        if (valDigit.match(translation.pattern)) {
          buf[addMethod](valDigit)

          if (translation.recursive) {
            if (resetPos === -1) {
              resetPos = m
            } else if (m === lastMaskChar) {
              m = resetPos - offset
            }

            if (lastMaskChar === resetPos) {
              m -= offset
            }
          }

          m += offset

        } else if (valDigit === lastUntranslatedMaskChar) {
          // matched the last untranslated (raw) mask character that we encountered
          // likely an insert offset the mask character from the last entry; fall
          // through and only increment v
          maskDigitCount--
          lastUntranslatedMaskChar = undefined

        } else if (translation.optional) {
          m += offset
          v -= offset

        } else if (translation.fallback) {
          buf[addMethod](translation.fallback)
          m += offset
          v -= offset

        } else {
          this.invalid.push({ p: v, v: valDigit, e: translation.pattern })
        }

        v += offset

      } else {
        if (!skipMaskChars) {
          buf[addMethod](maskDigit)
        }

        if (valDigit === maskDigit) {
          maskDigitPosArr.push(v)
          v += offset
        } else {
          lastUntranslatedMaskChar = maskDigit
          maskDigitPosArr.push(v + maskDigitCount)
          maskDigitCount++
        }

        m += offset
      }
    }

    let lastMaskCharDigit = this.mask.charAt(lastMaskChar)
    if (maskLen === valLen + 1 && !this.translation[lastMaskCharDigit]) {
      buf.push(lastMaskCharDigit)
    }

    let newVal = buf.join('')
    this.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen)

    return newVal
  }


  mapMaskdigitPositions(newVal, maskDigitPosArr, valLen) {
    let maskDiff = this.options.reverse ? newVal.length - valLen : 0
    this.maskDigitPosMap = {}

    for (let i = 0; i < maskDigitPosArr.length; i++) {
      this.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1
    }
  }

  callbacks(evt) {
    let val = this.val()
    let changed = val !== this.oldValue
    let defaultArgs = [val, evt, this.el, this.options]
    let callback = (name, criteria, args) => {
      if (typeof this.options[name] === 'function' && criteria) {
        this.options[name].apply(this, args)
      }
    }

    callback('onChange', changed === true, defaultArgs)
    callback('onKeyPress', changed === true, defaultArgs)
    callback('onComplete', val.length === this.mask.length, defaultArgs)
    callback('onInvalid', this.invalid.length > 0, [val, evt, this.el, this.invalid, this.options])
  }



  // jMask public methods
  remove() {
    let caret = this.getCaret()
    this.destroyEvents()
    this.val(this.getCleanVal())
    this.setCaret(caret)
  }

  // get value without mask
  getCleanVal() {
    return this.getMasked(true)
  }
  // TODO renomear para cleanVal ou unmaskedVal()


  // get masked value without the value being in the input or element
  getMaskedVal(val) {
    return this.getMasked(false, val)
  }
  // TODO renomear para maskedVal(value)
}


export default Mask
