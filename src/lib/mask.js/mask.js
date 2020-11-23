//
// Based on https://github.com/igorescobar/jQuery-Mask-Plugin, and ported to
// ES6 and Vue (some extra `input` events).
//
// docs: https://igorescobar.github.io/jQuery-Mask-Plugin/
//


// helper functions

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
  maskElements: 'input,td,span,div',
  watchInterval: 300,
  watchInputs: true,
  keyStrokeCompensation: 10,
  // old versions of chrome dont work great with input event
  useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
  byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
  translation: {
    /* eslint-disable quote-props */
    '0': { pattern: /\d/ },
    '9': { pattern: /\d/, optional: true },
    '#': { pattern: /\d/, recursive: true },
    'A': { pattern: /[a-zA-Z0-9]/ },
    'S': { pattern: /[a-zA-Z]/ },
    'M': { pattern: /[-+]/, optional: true }
    /* eslint-enable quote-props */
  },
  clearIfNotMatch: false
}


class Mask {
  static get globals() {
    return globals
  }

  constructor(el, mask, options) {
    // data
    this.invalid = []
    this.$data = {}


    // init do jMask
    this.el = el
    this.oldValue = this.val()
    this.options = options || {}
    this.mask = typeof mask === 'function' ? mask(this.val(), undefined, this.el, this.options) : mask


    let onlyMask = this.el.nodeName !== 'INPUT'

    this.clearIfNotMatch = this.constructor.globals.clearIfNotMatch
    this.byPassKeys = this.constructor.globals.byPassKeys
    this.translation = Object.assign({}, this.constructor.globals.translation, options.translation)

    Object.assign(this, options)

    this.regexMask = this.getRegexMask()


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
        this.data('mask-maxlength', true)
      }

      this.destroyEvents() // ???
      this.events()

      let caret = this.getCaret()
      this.val(this.getMasked())
      this.setCaret(caret)
    }

  } // [end] constructor


  data(name, value) {
    // checking if it's a "get"
    if (arguments.length === 1) {
      return this.$data[name]
    }

    // otherwise, it works as a setter
    this.$data[name] = value
    return this.$data[name]
  }

  trigger(evtName) {
    this.el.dispatchEvent(new Event(evtName))
  }

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
    } catch (e) {} // eslint-disable-line no-empty
  }


  setCaret(pos) {
    try {
      if (document.activeElement === this.el) {
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
    } catch (e) {} // eslint-disable-line no-empty
  }


  get listeners() {
    return [{
      events: ['keydown'],
      handler: (evt) => {
        this.data('mask-keycode', evt.keyCode || evt.which)
        this.data('mask-previus-value', this.val())
        this.data('mask-previus-caret-pos', this.getCaret())
        this.maskDigitPosMapOld = this.maskDigitPosMap
      }
    }, {
      events: [this.constructor.globals.useInput ? 'input' : 'keyup'],
      handler: (evt) => {
        this.behaviour(evt)
      }
    }, {
      events: ['paste', 'drop'],
      listeners: (evt) => {
        setTimeout(() => {
          this.trigger('keydown')
          this.trigger('keyup')
        }, 100)
      }
    }, {
      events: ['change'],
      handler: (evt) => {
        this.data('changed', true)
      }
    }, {
      events: ['blur'],
      handler: (evt) => {
        if (this.oldValue !== this.val() && !this.data('changed')) {
          this.trigger('change')
        }
        this.data('changed', false)
      }
    }, {
      // it's very important that this callback remains in this position
      // otherwhise oldValue it's going to work buggy
      events: ['blur'],
      handler: (evt) => {
        this.oldValue = this.val()
      }
    }, {
      // select all text on focus
      events: ['focus'],
      handler: (evt) => {
        if (this.options.selectOnFocus === true) {
          this.trigger('select')
        }
      }
    }, {
      // clear the value if it not complete the mask
      events: ['focusout'],
      handler: (evt) => {
        if (this.options.clearIfNotMatch && !this.regexMask.test(this.val())) {
          this.val('')
        }
      }
    }]
  }

  events() {
    this.listeners.forEach(({ events, handler }) => {
      events.forEach((eventName) => {
        this.el.addEventListener(eventName, handler)
      })
    })
  }

  destroyEvents() {
    this.listeners.forEach(({ events, handler }) => {
      events.forEach((eventName) => {
        this.el.removeEventListener(eventName, handler)
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
      r = r.replace(new RegExp(`(${oRecursive.digit}(.*${oRecursive.digit})?)`), '($1)?')
        .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern)
    }

    return new RegExp(r)
  }



  // getter/setter
  val(v) {
    let isInput = this.el.nodeName === 'INPUT'
    let property = isInput ? 'value' : 'textContent'

    // if it's a "get"
    if (arguments.length === 0) {
      return this.el[property]
    }

    // otherwise it's a setter
    if (this.el[property] !== v) {
      this.el[property] = v
    }

    // XXX emitting `input` to follow Vue reaction data-flow (v-model, @input, sync...)
    if (this.__lastEmittedVal !== v) {
      let eventName = this.constructor.globals.useInput ? 'input' : 'keyup'
      this.__lastEmittedVal = v
      this.trigger(eventName)
    }

  }


  calculateCaretPosition(oldVal) {
    let newVal = this.getMasked()
    let caretPosNew = this.getCaret()

    // if not changed, early return
    if (oldVal === newVal) return caretPosNew

    // otherwise, calculates the new caret position

    // XXX ensuring position maps do exist
    this.maskDigitPosMap = this.maskDigitPosMap || {}
    this.maskDigitPosMapOld = this.maskDigitPosMapOld || {}

    let caretPosOld = this.data('mask-previus-caret-pos') || 0
    let newValL = newVal.length
    let oldValL = oldVal.length
    let maskDigitsBeforeCaret = 0
    let maskDigitsAfterCaret = 0
    let maskDigitsBeforeCaretAll = 0
    let maskDigitsBeforeCaretAllOld = 0
    let i = 0

    for (i = caretPosNew; i < newValL; i++) {
      if (!this.maskDigitPosMap[i]) {
        break
      }
      maskDigitsAfterCaret++
    }

    for (i = caretPosNew - 1; i >= 0; i--) {
      if (!this.maskDigitPosMap[i]) {
        break
      }
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

    // if the cursor is at the end keep it there
    if (caretPosNew > oldValL) {
      caretPosNew = newValL * 10
    } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
      if (!this.maskDigitPosMapOld[caretPosNew])  {
        let caretPos = caretPosNew
        caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll
        caretPosNew -= maskDigitsBeforeCaret

        if (this.maskDigitPosMap[caretPosNew])  {
          caretPosNew = caretPos
        }
      }
    }
    else if (caretPosNew > caretPosOld) {
      caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld
      caretPosNew += maskDigitsAfterCaret
    }

    return caretPosNew
  }


  behaviour(evt) {
    let event = evt || window.event
    this.invalid = []

    let keyCode = this.data('mask-keycode')

    if (this.byPassKeys.indexOf(keyCode) === -1) {
      let newVal   = this.getMasked()
      let caretPos = this.getCaret()
      let oldVal   = this.data('mask-previus-value') || ''

      // this is a compensation to devices/browsers that don't compensate
      // caret positioning the right way
      setTimeout(() => {
        this.setCaret(this.calculateCaretPosition(oldVal))
      }, this.constructor.globals.keyStrokeCompensation)

      this.val(newVal)
      this.setCaret(caretPos)
      return this.callbacks(event)
    }
  }

  getMasked(skipMaskChars, val) {
    let buf = []
    let value = val === undefined ? this.val() : `${val}`
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
            } else if (m === lastMaskChar && m !== resetPos) {
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
    let maskDiff = this.options.reverse ? (newVal.length - valLen) : 0
    this.maskDigitPosMap = {}

    for (let i = 0; i < maskDigitPosArr.length; i++) {
      this.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1
    }
  }

  callbacks(evt) {
    let val = this.val()
    // XXX: handling "cleared input" too! (!null && !empty)
    let changed = (val !== this.oldValue) || (val == null) || (val === '')

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
    if (this.options.placeholder) {
      this.el.removeAttribute('placeholder')
    }
    if (this.data('mask-maxlength')) {
      this.el.removeAttribute('maxlength')
    }

    this.destroyEvents()
    this.val(this.getCleanVal())
    this.setCaret(caret)

    return this.el
  }

  // get value without mask
  getCleanVal() {
    return this.getMasked(true)
  }

  // XXX extra: an alias with better name
  unmaskedVal() {
    return this.getCleanVal()
  }

  // get masked value without the value being in the input or element
  getMaskedVal(val) {
    return this.getMasked(false, val)
  }
}


export default Mask
