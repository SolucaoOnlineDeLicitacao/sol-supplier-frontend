<!--
<doc lang="markdown">
    Componente para campos textuais (`input`) em formulários que representem
  emails.

  # Exemplo de uso:

  ## básico
  ```pug
  email-field(
    name="user[email]",
    v-model="user.email",
    :placeholder="$t('.something')",
    :error="errors.email"
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $email-error-color: red;
  $email-error-border-color: red;
  $email-disabled-color: #ABABAB;
  $email-disabled-border-color: #D9D6D5;

  .email-field {
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
  .email-field.error {
    label {
      color: $email-error-color;
    }

    input {
      border-color: $email-error-border-color;
    }
  }

  // disabled
  .email-field.disabled,
  .email-field.readonly {
    label {
      color: $email-disabled-color;
    }

    input {
      border-color: $email-disabled-border-color;
      color: $email-disabled-color;
    }

    .icon {
      color: $email-disabled-color;
    }
  }
</style>

<template lang="pug">
  .email-field(:class="{ error, disabled, readonly }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    .input-wrapper
      input(
        type="email",
        :id="inputId",
        :autocomplete="autocomplete",
        :autofocus="autofocus",
        :disabled="disabled",
        :readonly="readonly",
        :name="name",
        :placeholder="placeholder",
        :value="value",
        @input="$emit('input', $event.target.value)"
      )
      i.icon.fa.fa-envelope-o
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    props: {
      placeholder: { type: String, default: 'email@example.com' }
    }
  }
</script>
