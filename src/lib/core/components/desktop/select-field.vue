<!--
<doc lang="markdown">
    Componente para campos de seleção (`select`) em formulários, já derivando
  `label` e mensagem de `erro` (para validações).

  # Exemplo de uso:

  ## básico
  ```pug
  select-field(
    name="user[role]",
    v-model="user.role",
    :options="[{ id: 0, text: 'guest' }, { id: 1, text: 'operator' }]",
    :placeholder="$t('.something')",
    :error="errors.role"
  )
  ```

  ## avançado
  ```pug
  select-field(
    id="secret",
    name="special",
    label="Meu label específico",
    value="1",
    :options="[{ id: 0, text: 'guest' }, { id: 1, text: 'operator' }]"
    :placeholder="$t('.something')",
    :disabled="flagControlandoEstadoDeDesabilitado",
    :error="mensagemDeErroControlandoEstadoDeErro"
  )
  ```
</doc>
-->

<style lang="scss">
  // XXX sem scoped por causa do select2!

  // TODO definir cor de erro!
  $select-error-color: red;
  $select-error-border-color: red;
  $select-disabled-color: #ABABAB;
  $select-disabled-border-color: #D9D6D5;

  .select-field {
    margin-bottom: 1.5rem;

    .select2.select2-container--default {
      width: 100%;
      // Sobrecarregando estilo do Skeleton, trocando a margem para o "container",
      // fazendo com que as mensagens de erro fiquem próximas ao input (antes da
      // margem)
      // margin-bottom: 1.5rem;
      margin-bottom: 0;
    }
  }

  // error
  .select-field.error {
    & > label {
      color: $select-error-color;
    }

    .select2.select2-container--default {
      border-color: $select-error-border-color;
    }
  }

  // disabled
  .select-field.disabled {
    & > label {
      color: $select-disabled-color;
    }

    .select2.select2-container--default {
      border-color: $select-disabled-border-color;
    }
  }
</style>


<template lang="pug">
  .field.select-field(:class="{ error, disabled }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    select2(
      :id="inputId",
      :disabled="disabled",
      :name="name",
      :options="options",
      :overlay="overlay",
      :placeholder="placeholder",
      :type="type",
      :value="value",
      :include-blank="includeBlank",
      :hide-search="hideSearch",
      @input="val => { $emit('input', val) }"
    )
      slot
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    // propriedades extras e/ou sobrecarregadas
    props: {
      hideSearch:   { type: Boolean, default: true },
      includeBlank: null,
      type:         null,
      modal:        null,
      options:      null,
      overlay:      null
    }
  }
</script>
