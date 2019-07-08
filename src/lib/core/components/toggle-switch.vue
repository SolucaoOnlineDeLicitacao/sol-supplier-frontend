<style lang="scss" scoped>
  // para ajustar o tamanho do switch, altere essas 3 variáveis abaixo
  $toggle-switch-width: 24px;
  $toggle-switch-height: 16px;
  $toggle-switch-btn-margin: 2px;

  // cores idênticas ao componente `touch-switch` (para phone)
  $toggle-switch-bg-on: $primary-color;
  $toggle-switch-bg-off: #bfcbd9;
  $toggle-switch-btn-size: $toggle-switch-height - (2 * $toggle-switch-btn-margin);
  $toggle-switch-btn-color: #fff;

  .toggle-switch {
    display: inline-block;
    height: $toggle-switch-height;
  }

  input[type=checkbox]{
    height: 0;
    width: 0;
    display: none;
    margin: 0;
  }

  label {
    cursor: pointer;
    width: $toggle-switch-width;
    height: $toggle-switch-height;
    background: $toggle-switch-bg-off;
    display: block;
    border-radius: 150px;
    position: relative;
    margin: 0;

    &:after {
      content: '';
      position: absolute;
      top: $toggle-switch-btn-margin;
      left: $toggle-switch-btn-margin;
      width: $toggle-switch-btn-size;
      height: $toggle-switch-btn-size;
      background: $toggle-switch-btn-color;
      border-radius: 150px;
      transition: 0.3s;
    }

  }

  input:checked + label {
    background: $toggle-switch-bg-on;
  }

  input:checked + label:after {
    left: calc(100% - #{$toggle-switch-btn-margin});
    transform: translateX(-100%);
  }

  input:disabled,
  input[readonly] {
    pointer-events: none;

    & + label {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>


<template lang="pug">
  .toggle-switch(:class="{ disabled, readonly }")
    input(
      :disabled="checked",
      :name="name",
      type="hidden",
      value="false"
    )

    //- TODO permitir customizar o valor do checkbox para além de `true`/`false`.
    //- Veja mais em https://vuejs.org/v2/guide/forms.html#Checkbox-1
    input(
      :disabled="disabled",
      :readonly="readonly",
      :id="inputId",
      :name="name",
      type="checkbox",
      value="true",
      v-model="checked",
      @click="ensureNotReadonly"
    )

    label(:for="id")
</template>


<script>
  import _ from '@/lib/lodash-ext'

  export default {
    data() {
      return {
        checked: this.value
      }
    },

    props: {
      disabled: { type: Boolean, default: false },
      id:       { type: String },
      name:     { type: String, required: true },
      readonly: { type: Boolean, default: false },
      value:    { type: Boolean, default: false }
    },

    methods: {
      ensureNotReadonly(evt) {
        // evita o "click" - e a mudança do valor - caso esteja em estado "readonly"
        if (this.readonly) evt.preventDefault()
      },

      toggle() {
        this.checked = !this.checked
      }
    },

    computed: {
      inputId() {
        if (this.id) return this.id

        return _.snakeize(this.name)
      }
    },

    watch: {
      checked(value, oldValue) {
        if (value !== oldValue) {
          this.$emit('input', value)
        }
      },

      value(value) {
        this.checked = value
      }
    }
  }
</script>
