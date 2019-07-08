<!--
<doc lang="markdown">
    Componente para campos textuais (`input`) em formulários que representem
  números de telefone.

  # Exemplo de uso:

  ## básico.

  A máscara se "adequa" entre telefone fixo (10 dígitos) ou celular (11 dígitos) conforme o número
  de dígitos inputados no campo.
  ```pug
  phone-field(
    name="user[phone]",
    v-model="user.phone",
    :placeholder="$t('.something')",
    :error="errors.phone"
  )
  ```
  > NOTA é o mesmo que usar o atributo `type="any"`

  ## fixando o "tipo" do telefone

  ### telefone fixo
  ```pug
  phone-field(
    type="landline",
    name="user[phone]",
    v-model="user.phone",
    :placeholder="$t('.something')",
    :error="errors.phone"
  )
  ```

  ### celular
  ```pug
  phone-field(
    type="cell",
    name="user[phone]",
    v-model="user.phone",
    :placeholder="$t('.something')",
    :error="errors.phone"
  )
  ```
</doc>
-->


<style scoped lang="scss">
  // TODO definir cor de erro!
  $phone-error-color: red;
  $phone-error-border-color: red;
  $phone-disabled-color: #ABABAB;
  $phone-disabled-border-color: #D9D6D5;

  .phone-field {
    margin-bottom: 1.5rem;

    input {
      width: 100%;
      // Sobrecarregando estilo do Skeleton, trocando a margem para o "container",
      // fazendo com que as mensagens de erro fiquem próximas ao input (antes da
      // margem)
      // margin-bottom: 1.5rem;
      margin-bottom: 0;
      padding-right: 38px; // XXX tamanho do ícone!
      // font-family: "Open Sans", Arial, sans-serif;
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
  .phone-field.error {
    label {
      color: $phone-error-color;
    }

    input {
      border-color: $phone-error-border-color;
    }
  }

  // disabled
  .phone-field.disabled,
  .phone-field.readonly {
    label {
      color: $phone-disabled-color;
    }

    input {
      border-color: $phone-disabled-border-color;
      color: $phone-disabled-color;
    }

    .icon {
      color: $phone-disabled-color;
    }
  }
</style>


<template lang="pug">

  .phone-field(:class="{ error, disabled, readonly }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    .input-wrapper
      input(
        :id="inputId",
        :autocomplete="autocomplete",
        :autofocus="autofocus",
        :disabled="disabled",
        :readonly="readonly",
        :name="name",
        :placeholder="placeholder",
        type="tel",
        :value="value",
        v-mask="phoneMask",
        @input="$emit('input', $event.target.value)"
      )
      i.icon.fa.fa-phone
    input-error(:message="error")

</template>


<script>
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    props: {
      placeholder: { type: String, default: '(99) 99999-9999' },
      type:        { type: String, default: 'any' }  // "any", "cell" or "landline"
    },

    computed: {
      phoneMask() {
        switch (this.type) {
          case 'cell':     return '(00) 00000-0000'
          case 'landline': return '(00) 0000-0000'

          default: // case 'any'
            if ((this.value + '').replace(/\D/g, '').length === 11) {
              return '(00) 00000-0000'
            }

            return '(00) 0000-00009'
        }
      }
    }
  }
</script>
