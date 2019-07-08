<!--
<doc lang="markdown">
    Componente para campos de "data", com seletor de data com horário (datetimepicker) utilizando a lib Flatpickr (https://flatpickr.js.org).

    IMPORTANTE: por ser um _field_, é esperado que seja usado em tag:form. Assim, padronizamos o
  v-model no formato ISO08601 ('%Y-%m-T%H:%M:%S%z') - facilmente utilizado em frameworks backend - e
  deixamos a _apresentação_ do dado com uma máscara configurável, com padrão 'DD/MM/YYYY às HH:mm'.
  Altere a máscara pela _prop_ format (que usa `dateFormat` do Flatpickr).

  # Exemplos de uso

  ## básico
  ```pug
  datetime-field(
    name="user[registered_at]",
    v-model="user.registeredAt",
    :placeholder="$t('.something')",
    :error="errors.registeredAt"
  )
  ```


  ## TODO permitir "localização" diferente (ex: en-US)
  TEM A VER com usar a prop "dateFormat" do Flatpickr (veja prop comentada no datetimepicker.vue)
  ```pug
  datetime-field(
    name="user[registered_at]",
    v-model="user.registeredAt",
    format="%Y-%m-%d",
    :placeholder="$t('.something')",
    :error="errors.registeredAt"
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $error-color: red;
  $error-border-color: red;
  $disabled-color: #ABABAB;
  $disabled-border-color: #D9D6D5;

  .datetime-field {
    margin-bottom: 1.5rem;

    /deep/ input {
      width: 100%;
      // Sobrecarregando estilo do Skeleton, trocando a margem para o "container",
      // fazendo com que as mensagens de erro fiquem próximas ao input (antes da
      // margem)
      // margin-bottom: 1.5rem;
      margin-bottom: 0;
      padding-right: 38px; // XXX tamanho do ícone!
      font-family: "Open Sans", Arial, sans-serif;
      font-weight: 300;
    }

    .input-wrapper {
      position: relative;

      & > .icon {
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
  }

  // error
  .datetime-field.error {
    label {
      color: $error-color;
    }

    /deep/ input {
      border-color: $error-border-color;
    }
  }

  // disabled
  .datetime-field.disabled,
  .datetime-field.readonly {
    label {
      color: $disabled-color;
    }

    /deep/ input {
      border-color: $disabled-border-color;
      color: $disabled-color;
    }

    .icon {
      color: $disabled-color;
    }
  }
</style>

<template lang="pug">
  .datetime-field(:class="{ error, disabled, readonly }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    .input-wrapper
      datetimepicker(
        :id="inputId",
        :autocomplete="autocomplete",
        :autofocus="autofocus",
        :disabled="disabled",
        :readonly="readonly",
        :name="name",
        :placeholder="placeholder",
        v-model="lValue",
        :date-format="dateFormat",
        :modal="modal",
        :overlay="overlay"
      )
      //- E aqui o hidden input que "sobrepõe" o text input que o datecpiker representa, uma
      //- vez que fica "depois" na ordem do DOM, seguindo a especificação do form HTML.
      input(type="hidden", :name="name", :value="value")
    input-error(:message="error")
</template>


<script>
  import moment from 'moment'
  import Flatpickr from 'flatpickr'
  import InputField from './input-field.vue'
  import DatetimePicker from '@/lib/core/components/datetimepicker.vue'

  export default {
    extends: InputField,

    props: {
      // dateFormat @ https:// Flatpickr.js.org/options/ - '%d/%m/%Y às %H:%M'
      // format:      { type: String, default: () => app.i18n.t('time.formats.micro') },
      dateFormat:  DatetimePicker.props.dateFormat, // delegated to datetime-field
      placeholder: { type: String, default: 'DD/MM/AAAA às HH:mm' },
      modal:       DatetimePicker.props.modal,   // delegated to datetime-field
      overlay:     DatetimePicker.props.overlay  // delegated to datetime-field
    },

    computed: {
      // datetime 'localizado', para exibição no input, mas "retornando" (emit:input) valor em
      // string ISO8601 (~'YYYY-MM-DDTHH:mmz').
      lValue: {
        // o get retorna o dado em formato localizado - ex: DD/MM/YYYY às HH:mm para pt-BR - uma
        // vez que é usado para exibição no input
        get() {
          if (_.isBlank(this.value)) return null

          // Como esperamos datetime em formato ISO, não precisamos nos preocupar com TimeZone, uma
          // vez que a String contém esse dado (se necessário)

          // vamos, então, parsear o dado para exibição (no input)
          //   - vamos usar moment para ISO e flatpickr para formatação, reaproveitando a config/prop
          //   "dateFormat"!
          let date = moment(this.value).toDate()
          return Flatpickr.formatDate(date, this.dateFormat)
        },

        // o set define o dado em formato localizado - ex: DD/MM/YYYY às HH:mm para pt-BR - mas
        // "emite" (@input) o dado em formato canônico (iso8601 YYYY-MM-DDTHH:mmZ)
        set(value) {
          if (_.isBlank(value)) { // value pode ser `null` caso o usuário "limpe" o <input>
            this.$emit('input', null)
            return
          }

          // Como esperamos datetime em formato ISO, não precisamos nos preocupar com TimeZone, uma
          // vez que a String contém esse dado (se necessário)

          // vamos, então, parsear o dado para exibição (no input)
          //   - vamos usar flatpickr para parsing (pela prop `dateFormat`) e moment para traduzir
          //     para formato ISO

          // "exponha" o dado em formato canônico (ISO8601 - YYYY-MM-DD)
          let date = Flatpickr.parseDate(value, this.dateFormat)
          let dateAsISO08601 = moment(date).format() // or moment(date).toISOString()
          this.$emit('input', dateAsISO08601)
        }
      }
    }
  }
</script>
