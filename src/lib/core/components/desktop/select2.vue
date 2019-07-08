<style lang="scss">
  .select2-selection {
    outline: none;
  }
</style>


<template lang="pug">
  select
    slot(name="blank", v-if="includeBlank")
      option(value="", disabled="true") {{ $t('options.blank') }}
    slot
</template>


<script>
  const SCHEDULE_TIMEOUT = 50

  export default {
    props: {
      // flag para exibir opção "em branco"
      includeBlank: { type: Boolean, default: false },

      // flag para esconder o campo de busca padrão do select2
      hideSearch: { type: Boolean, default: false },

      // flag para alterar comportamento para "dentro de modal", utilizando
      // opção "dropdownParent" do Select2
      modal: { type: Boolean, default: false },

      // Opção do Select2 que cria os elementos <option> internos ao <select>
      options: { type: Array, default: () => [] },

      // flag para alterar comportamento para "dentro de overlay", utilizando
      // opção "dropdownParent" do Select2
      overlay: { type: Boolean, default: false },

      // Tipo de dado para "converter" o valor do select. (ex: "integer" -> parseInt)
      type: { type: String, default: 'string' },

      // valor inicial do select
      // - default '' para "bater" com o valor da opção em branco padrão
      value: { type: [String, Number], default: '' },

      placeholder: { type: String, default() { return this.$i18n.t('options.blank') } }
    },

    data() {
      return {
        initialized: false,
        select2:     null
      }
    },

    computed: {
      select2Options() {
        let options = {
          // data is the <option> tags for <select>
          data:        this.options,
          placeholder: this.placeholder,
          language: "pt-BR"
        }

        // see https://select2.github.io/examples.html#hide-search
        if (this.hideSearch) {
          options.minimumResultsForSearch = Infinity
        }

        // indica que o select2 está dentro de um modal
        if (this.modal) {
          // XXX classe padrão do componente modal - components/modal-wnd.vue
          options.dropdownParent = this.$el.closest('.modal-container')

          // OBS: poderíamos usar o método Element#closest (nativo com polyfill),
          // mas a opção do Select2 requer um valor jQuery Object. Então vamos
          // manter o jQuery#closest, que já retorna um jQuery object.
          // ```javascript
          // // ex: Element#closest
          // options.dropdownParent = this.$el.closest('.modal-container')
          // ```
        } else if (this.overlay) {
          // XXX classe padrão do componente modal - components/modal-wnd.vue
          options.dropdownParent = this.$el.closest('.overlay')

          // OBS: poderíamos usar o método Element#closest (nativo com polyfill),
          // mas a opção do Select2 requer um valor jQuery Object. Então vamos
          // manter o jQuery#closest, que já retorna um jQuery object.
          // ```javascript
          // // ex: Element#closest
          // options.dropdownParent = this.$el.closest('.overlay')
          // ```
        }

        return options
      }
    },

    mounted() {
      // init select2
      this.select2 = $(this.$el).select2(this.select2Options)
        // .on('change', (evt) => {
        .on('select2:select', (evt) => {
          const { id, text } = evt.params.data
          this.$emit('input', this.castVal(id))
        })

      if (this.value) this.setVal(this.value)

      this.initialized = true
    },

    beforeDestroy() {
      if (this.select2) this.select2.off().select2('destroy')
    },

    methods: {
      // Retorna o valor "transformado" ao tipo definido na prop "type"
      castVal(val) {
        // null or undefined early returning null!
        if (val == null) return null

        switch (this.type) {
          case 'integer': {
            return parseInt(val, 10)
          }
          case 'float': {
            return parseFloat(val)
          }
          case 'string':
          default: {
            // Nada a fazer. Já é uma String.
            return val
          }
        }
      },

      /**
       * Altera o valor do select2
       */
      setVal(val) {
        this.select2.val(val).trigger('change')
      },


      /**
       * Função auxiliar para garantir que as execuções aconteçam após a inicialização completa
       * do select2.
       */
      schedule(fn) {
        if (this.initialized) {
          fn()
          return
        }

        let fnSchedule = () => {
          if (this.initialized) {
            fn()
          } else {
            setTimeout(fnSchedule, SCHEDULE_TIMEOUT)
          }
        }

        setTimeout(fnSchedule, SCHEDULE_TIMEOUT)
      }
    },

    watch: {
      value(newValue) {
        this.schedule(() => {
          this.setVal(newValue)
        })
      },
      options(options) {
        this.schedule(() => {
          // - re-renderiza o select2 com as novas options - `#select2(options)`
          // - mantém o valor previamente selecionado - `#val(this.value)`
          this.select2.select2(this.select2Options).val(this.value)
        })
      },
      placeholder(placeholder) {
        this.schedule(() => {
          // re-renderiza select2 para que o novo placeholder apareça
          this.select2.select2(this.select2Options)
        })
      }
    }
  }
</script>
