<!--
<doc lang="markdown">
  Componente para seletor de datas com horário, utilizando a lib Flatpickr (https://flatpickr.js.org).
  Veja um exemplo de uso em client/application/operator/tools/properties/visit_requests/new.vue.

  template:
  ```
  //- - name é o atributo HTML mesmo. Útil para envio de form.
  //- - v-model terá o valor do input - valor textual (String)
  datetimepicker(name="at", v-model="lAt")
  ```

  Para ter o valor canônico da data - que, caso contrário, será localizada
  (ex: 'DD/MM/YYYY') - use uma _computed property_:
  ```
  computed: {
    // Data `at` 'localizada', para exibição no input do Flatpickr.
    // Assim, teremos `at` com o valor ISO8601 ('YYYY-MM-DD'), e `lAt`
    // com o valor localizado ('DD/MM/YYYY').
    lAt: {
      get() {
        if (!this.at) return null

        return this.$l('time.formats.micro', this.at)
      },
      set(value) {
        let date = moment(value, 'L').toDate()
        this.at = this.$l('date.formats.iso', date)
      }
    }
  }
  ```
</doc>
-->

<style lang="scss">
  .datetimepicker {
    position: relative;

    & > input {
      padding-right: 35px;
      width: 100%;
      cursor: pointer;
    }

    & > .fa {
      font-size: 16px;
      color: #777;

      position: absolute;
      top: 0;
      right: 0;

      // XXX essas são as medidas do input no SkeletonCSS
      // height: 38px;
      // padding: 6px 10px;
      // -> então, calculamos o padding para alinhar o ícone:
      padding: 11px;

      pointer-events: none;
    }
  }

</style>


<template lang="pug">
  .datetimepicker
    input(
      ref="input",
      type="tel",
      :id="id",
      :name="name",
      :value="value",
      :autocomplete="autocomplete",
      :autofocus="autofocus",
      :disabled="disabled",
      :readonly="readonly",
      :placeholder="placeholder",
      @change="onChange"
    )
    i.fa.fa-calendar
</template>


<script>
  import Flatpickr from 'flatpickr'
  import ConfirmPlugin from '@/lib/flatpickr-confirm-plugin'

  export default {
    props: {
      // opções de controle do input
      autocomplete: { type: Boolean, default: false },
      autofocus:    { type: Boolean, default: false },
      disabled:     { type: Boolean, default: false },
      readonly:     { type: Boolean, default: false },

      id:          String,
      name:        String,
      value:       String,
      placeholder: String,

      // define se o datetimepicker deve ficar "dentro de um modal", garantindo
      // a criação dos <div> corretamente (opção "appendTo" do Kalendar)
      modal: { type: Boolean, default: false },

      // define se o datetimepicker deve ficar "dentro de um overlay", garantindo
      // a criação dos <div> corretamente (opção "appendTo" do Kalendar)
      overlay: { type: Boolean, default: false },


      // Flatpickr options. Veja mais: https://flatpickr.js.org/options/

      // dateFormat @ https:// flatpickr.js.org/options/ - https://flatpickr.js.org/formatting/
      // dateFormat: { type: String, default: () => app.i18n.t('time.formats.micro') },
      dateFormat: { type: String, default: 'd\/m\/Y \\à\\s H:i' },
      // appendTo: { type: String, default: ? }
      mode: { type: String, default: 'single' }
    },

    data() {
      return {
        // instância do Flatpickr
        flatpickr: null,
        listeners: [],
        __lastVal: this.value
      }
    },


    computed: {
      flatpickrOptions() {
        // Flatpickr options. Veja mais: https://flatpickr.js.org/options/

        let options = {
          defaultDate: this.value,
          mode:        this.mode,
          dateFormat:  this.dateFormat,
          // clickOpens: true, // default value
          allowInput:  true,
          enableTime:  true, // enabling time picker
          time_24hr:   true, // removing AM/PM
          plugins:     [
            new ConfirmPlugin()
            // new ConfirmPlugin({
            //   confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
            //   confirmText: 'Done ',
            //   theme:       'light' // or "dark"
            // })
          ]
        }

        // indica que o datetimepicker está dentro de um modal
        if (this.modal) {
          // XXX classe padrão do componente modal - components/modal-wnd.vue
          options.appendTo = this.$el.closest('.modal-container')
        } else if (this.overlay) {
          // XXX classe padrão do componente modal - components/modal-wnd.vue
          options.appendTo = this.$el.closest('.overlay')
        }

        return options
      }
    },

    methods: {
      clear() {
        this.flatpickr.clear()
      },

      close() {
        this.flatpickr.close()
      },

      open() {
        this.flatpickr.open()
      },

      onChange(evt) {
        // @see https://github.com/flatpickr/flatpickr/issues/828

        if (this.__supressChange) {
          this.__supressChange = false
          return
        }

        let value = evt.target.value

        if (value === this.__lastVal) return

        this.__lastVal = value

        let date = Flatpickr.parseDate(value, this.dateFormat)

        if (date) {
          this.flatpickr.setDate(date, true /* trigger change events */)
        }
      }
    },

    mounted() {
      let vm = this
      this.flatpickr = new Flatpickr(this.$refs.input, Object.assign(this.flatpickrOptions, {
        // hooks @ https://flatpickr.js.org/events/

        // ensuring time picker is always visible
        // @see https://github.com/flatpickr/flatpickr/issues/1047#issuecomment-334319201
        onReady() { this.showTimeInput = true },

        onChange(selectedDates, dateStr, instance) {
          // XXX flag para evitar duplo-processamento do evento @change, uma vez que liberamos
          // a edição do input manualmente (input-teclado)
          vm.__supressChange = true

          // selectedDates - array of Date objects
          // dateStr - the current input showing string (defined by dateFormat and other options)
          // instance - current flatpickr instance (also available, in this component, as this.flatpickr)
          vm.$emit('input', dateStr)
        }
        // onOpen(selectedDates, dateStr, instance) {},
        // onClose(selectedDates, dateStr, instance) {}
        // onValueUpdate:
      }))
    },

    beforeDestroy() {
      if (this.flatpickr) this.flatpickr.destroy()
    }
  }
</script>
