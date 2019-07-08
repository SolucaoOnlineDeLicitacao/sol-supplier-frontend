<!--
<doc lang="markdown">
    Componente para campos textuais longos (`textarea`) em formulários, já
  derivando `label` e mensagem de `erro` (para validações).

  # Exemplo de uso:

  ## básico
  ```pug
  textarea-field(
    name="user[name]",
    v-model="user.name",
    :placeholder="$t('.something')",
    :error="errors.name"
  )
  ```

  ## avançado
  ```pug
  textarea-field(
    id="secret",
    type="number",
    name="special",
    label="Meu label específico",
    value="Valor inicial não reativo",
    :placeholder="$t('.something')",
    :disabled="flagControlandoEstadoDeDesabilitado",
    :error="mensagemDeErroControlandoEstadoDeErro"
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $textarea-error-color: red;
  $textarea-error-border-color: red;
  $textarea-disabled-color: #ABABAB;
  $textarea-disabled-border-color: #D9D6D5;

  .textarea-field {
    margin-bottom: 1.5rem;

    textarea {
      width: 100%;
      height: inherit;
      // Sobrecarregando estilo do Skeleton, trocando a margem para o "container",
      // fazendo com que as mensagens de erro fiquem próximas ao input (antes da
      // margem)
      // margin-bottom: 1.5rem;
      margin-bottom: 0;

      resize: none;
    }
  }

  // error
  .textarea-field.error {
    label {
      color: $textarea-error-color;
    }

    textarea {
      border-color: $textarea-error-border-color;
    }
  }

  // disabled
  .textarea-field.disabled {
    label {
      color: $textarea-disabled-color;
    }

    textarea {
      border-color: $textarea-disabled-border-color;
    }
  }

  textarea.resize {
    resize: both;
  }
</style>


<template lang="pug">
  .textarea-field(:class="{ error, disabled }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    textarea(
      :id="inputId",
      :disabled="disabled",
      :name="name",
      :placeholder="placeholder",
      :rows="rows",
      :cols="cols",
      :value="value",
      :class="{ resize }"
      @input="$emit('input', $event.target.value)"
    )
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    // sobrecarregando props
    props: {
      value:  null,
      resize: { type: Boolean, default: false },
      rows:   { type: Number },
      cols:   { type: Number }
    }
  }
</script>
