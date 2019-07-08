<style lang="scss" scoped>
  $touch-switch-core-size: 34px;
  $touch-switch-height: 38px;
  $touch-switch-width: 50px;
  $touch-switch-small-width: 80px;
  $touch-switch-medium-width: 100px;
  $touch-switch-large-width: 120px;

  .touch-switch {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    user-select: none;
    cursor: pointer;
    line-height: $touch-switch-height;
    height: $touch-switch-height;

    .input {
      display: none;
    }

    .label {
      position: absolute;
      top: 0;
      font-size: 14px;
      font-weight: 600;
      line-height: $touch-switch-height;
      height: $touch-switch-height;
      color: white;

      &.left {
        left: 10px;
      }

      &.right {
        right: 10px;
      }
    }

    .core,
    .core.none {
      margin: 0;
      display: inline-block;
      position: relative;
      outline: 0;
      border-radius: 25px;
      box-sizing: border-box;
      background: #bfcbd9;
      transition: border-color .3s, background-color .3s;
      width: $touch-switch-width;
      height: $touch-switch-height;

      &.small {
        width: $touch-switch-small-width;
      }

      &.medium {
        width: $touch-switch-medium-width;
      }

      &.large {
        width: $touch-switch-large-width;
      }

      &:before {
        display: block;
        content: '';
        overflow: hidden;
        transform: translate(2px, 2px);
        top: 2px;
        left: 1px;
        position: absolute;
        border-radius: 100%;
        transition: transform .3s;
        width: 30px;
        height: 30px;
        z-index: 20;
        background-color: #fff;
      }
    }

    &.checked {
      .core,
      .core.none {
        &:before {
          transform: translate(30px, 2px);
          transform: translate(calc(#{$touch-switch-width} - #{$touch-switch-core-size}), 2px);
        }
      }
      .core.small {
        &:before {
          transform: translate(50px, 2px);
          transform: translate(calc(#{$touch-switch-small-width} - #{$touch-switch-core-size}), 2px);
        }
      }
      .core.medium {
        &:before {
          transform: translate(70px, 2px);
          transform: translate(calc(#{$touch-switch-medium-width} - #{$touch-switch-core-size}), 2px);
        }
      }
      .core.large {
        &:before {
          transform: translate(90px, 2px);
          transform: translate(calc(#{$touch-switch-large-width} - #{$touch-switch-core-size}), 2px);
        }
      }
    }

    &.disabled,
    &.readonly {
      cursor: not-allowed;
      opacity: 0.5;

      & > input[type="checkbox"] {
        pointer-events: none;
      }
    }
  }
</style>


<template lang="pug">
  label.touch-switch(:class='{ checked, disabled, readonly }')
    //- Usando um hidden input para envio de "false" caso o checkbox não esteja preenchido
    input(type='hidden', :name='name', value='false', :disabled='checked')
    input.input(
      type='checkbox',
      :id="inputId",
      :name='name',
      v-model='checked',
      value='true',
      :disabled='disabled',
      :readonly="readonly",
      @click="ensureNotReadonly"
    )

    span.core(:class="labelSize", :style='coreStyle')

    div(v-if='labels')
      span.label.left(v-if='checked') {{ labelChecked }}
      span.label.right(v-else='') {{ labelUnchecked }}
</template>


<script>
  import _ from '@/lib/lodash-ext'

  // cores idênticas ao componente `toggle-switch` (para desktop)
  const DEF_CHECKED_COLOR = '$primary-color'
  const DEF_UNCHEKED_COLOR = '#bfcbd9'
  const DEF_CHECKED_LABEL = 'on'
  const DEF_UNCHECKED_LABEL = 'off'

  const objectHas = (object, title) => (
    typeof object === 'object' && object.hasOwnProperty(title)
  )

  export default {
    props: {
      disabled: { type: Boolean, default: false },
      id:       { type: String },
      name:     { type: String, default: '' },
      readonly: { type: Boolean, default: false },
      value:    { type: Boolean, default: true },

      color: {
        type: [String, Object],
        validator(value) {
          if (typeof value === 'object') {
            return value.checked || value.unchecked
          }
          return typeof value === 'string'
        }
      },

      labels: {
        type:    [Boolean, Object],
        default: false,
        validator(value) {
          if (typeof value === 'object') {
            return value.checked || value.unchecked
          }
          return typeof value === 'boolean'
        }
      },

      /**
       * Tamanho do texto do label, para dimensionar o checkbox. Opções:
       * - none   -  50px: tamanho 0 para quando não quisermos labels
       * - small  -  70px: tamanho pequeno, para palavras de 3 letras ("Sim" e "Não")
       * - medium -  90px: tamanho médio, para palavras de 6 letras ("Talvez")
       * - large  - 110px: tamanho grande, para palavras de 9 letras ("Tanto faz")
       */
      labelSize: { type: String, default: 'none' }
    },

    computed: {
      inputId() {
        if (this.id) return this.id

        return _.snakeize(this.name)
      },

      colorChecked() {
        if (typeof this.color !== 'object') {
          return this.color || DEF_CHECKED_COLOR
        }
        return objectHas(this.color, 'checked')
          ? this.color.checked
          : DEF_CHECKED_COLOR
      },

      colorUnchecked() {
        return objectHas(this.color, 'unchecked')
          ? this.color.unchecked
          : DEF_UNCHEKED_COLOR
      },

      colorCurrent() {
        return this.checked ? this.colorChecked : this.colorUnchecked
      },

      labelChecked() {
        return objectHas(this.labels, 'checked')
          ? this.labels.checked
          : DEF_CHECKED_LABEL
      },

      labelUnchecked() {
        return objectHas(this.labels, 'unchecked')
          ? this.labels.unchecked
          : DEF_UNCHECKED_LABEL
      },

      coreStyle() {
        return {
          'background-color': this.colorCurrent,
          'border-color':     this.colorCurrent
        }
      }
    },

    methods: {
      ensureNotReadonly(evt) {
        // evita o "click" - e a mudança do valor - caso esteja em estado "readonly"
        if (this.readonly) evt.preventDefault()
      }
    },

    watch: {
      value(value) {
        this.checked = value
      },

      checked(value, oldValue) {
        if (value !== oldValue) {
          this.$emit('input', value)
        }
      }
    },

    data() {
      return {
        checked: this.value
      }
    }
  }
</script>
