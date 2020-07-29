<!-- <doc lang="markdown">
  Numeric field

  # Usage:

  ----
  ```pug
  numeric-field(
    name="interaction[investment_amount]",
    v-model="interaction.investmentAmount"
  )
  ```

</doc> -->


<style scoped lang="scss">

.numeric-field {
  margin-bottom: 1.5rem;
  /deep/ .input-field {
    margin-bottom: 0;
  }
}

.input-field {
  width: 100%;
}

</style>


<template lang="pug">
  .input-field(:class="{ error, disabled, readonly }")
    input(:name="name", type="hidden", :value="value")

    .fields
      input-field.input-field(
        ref="input",
        :id="inputId",
        :autocomplete="autocomplete",
        :autofocus="autofocus",
        :disabled="disabled",
        :readonly="readonly",
        :placeholder="placeholder",
        :class="inputClass",
        :mask="numericMask",
        name="name",
        :hideLabel="hideLabel",
        :value="initValue",
        :label="label",
        @paste.native="onPaste"
      )

    input-error(:message="error" :attribute="errorAttribute")
</template>


<script>

import InputField from '@/lib/core/components/desktop/input-field.vue'

export default {
  extends: InputField,

  props: {
    value: { type: Number, default: null },
    raw:   { type: Boolean, default: true }
  },

  data() {
    return {
      i18nScope: 'components.numeric-field',

      initValue: null,
    }
  },

  computed: {
    // thousands delimiter
    delimiter() {
      return this.$t('number.currency.format.delimiter')
    },

    // decimal separator
    separator() {
      return this.$t('number.currency.format.separator')
    },

    numericMask() {
      return {
        // "000.000.000,00" - finite number
        // "#.##0,00" - infinite number
        mask: `#${this.delimiter}##0${this.separator}00`,
        options: {
          reverse: true,
          placeholder: `0${this.separator}00`,

          onChange: (maskedValue) => {
            this.onValueChanged(maskedValue)
          }
        }
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        // setting initial value for editing fields
        if(this.initValue === null ) {
          // skip setting initial value for new fields
          if(newValue === null) return

          this.initValue = newValue.toFixed(2)
        }
      }
    }
  },

  methods: {
    //
    // Returns string representation of "value".
    // ${integer}.${twoDecimals}
    //
    asNumber(maskedValue, { separator = null, delimiter = null } = {}) {
      if (separator == null) separator = this.separator
      if (delimiter == null) delimiter = this.delimiter

      // number without thousands delimiter
      let number = _.chain(maskedValue).split(delimiter).join('').value()

      if (!_.includes(number, separator)) { // ensuring it has decimal separator
        number = `${number}.00`
      }

      let pieces = _.split(number, separator)
      let integer = pieces[0]
      let decimals = _.padEnd(pieces[1], 2, '0') // fixing 2 decimal places

      return `${integer}.${decimals}` // fixed to 2 decimal places
    },

    onInput(maskedValue) {
      if (_.isBlank(maskedValue)) {
        this.$emit('input', null)
        return
      }

      let asNumber = this.asNumber(maskedValue)

      let number = null
      try {
        number = parseFloat(asNumber)
      } catch (e) {
        number = null
      }

      this.$emit('input', number)
    },

    onPaste(event) {
      let value = (event.clipboardData || window.clipboardData).getData('text')

      let separator = null
      let delimiter = null

      if (/\.\d+$/.test(value)) { // decimal separator is '.'
        separator = '.'
        delimiter = ','
      } else if (/\,\d+$/.test(value)) { // decimal separator is ','
        separator = ','
        delimiter = '.'
      } else { // has no decimal separator
        separator = '.'
        delimiter = ','
        value = `${value}.${_.padEnd('', 2, '0')}` // adding two decimal places
      }

      let number = this.asNumber(value, { separator, delimiter })
      event.stopPropagation()
      event.preventDefault()

      this.__pasting = true
    },

    onValueChanged(maskedValue) {
      // maskedValue is a String, with a "masked number"
      // we must parse it as Number and emit input event to make Vue parent-comonent react
      if (_.isBlank(maskedValue)) {
        this.$emit('input', null)
        return
      }

      let asNumber = this.asNumber(maskedValue)

      let number = null
      try {
        number = parseFloat(asNumber)
      } catch (e) {
        number = null
      }

      this.$emit('input', number)
    }
  }


}

</script>
