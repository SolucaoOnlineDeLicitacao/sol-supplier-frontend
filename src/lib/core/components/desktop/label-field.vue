<!--
<doc lang="markdown">
    Componente para campos textuais que não podem ser editados em formulários,
    já derivando `label`

  # Exemplo de uso:

  ## básico
  ```pug
  label-field(
    name="user[name]",
    v-model="user.name",
    :placeholder="$t('.something')",
  )
  ```

  ## avançado
  ```pug
  label-field(
    id="secret",
    name="special",
    label="Meu label específico",
    value="Valor inicial não reativo",
    :placeholder="$t('.something')",
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $label-error-color: red;

  .label-field {
    margin-bottom: 1.5rem;
  }

  // error
  .input-field.error {
    label {
      color: $label-error-color;
    }

    span.value {
      color: $label-error-color;
    }
  }

  .empty {
    font-size: 12px;
    font-style: italic;
    color: #cfcfcf;
  }
</style>


<template lang="pug">
  .label-field(:class="{ error }")
    label(:for="inputId") {{ labelText }}
    span.value(:id="inputId", :class="{ empty: !value }") {{ valueText }}
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'


  export default {
    extends: InputField,

    computed: {
      valueText() {
        if (isPresent(this.value)) return this.value
        return "Não Informado"
      }
    }
  }
</script>
