<!--
<doc lang="markdown">
    Componente para campos assinaláveis (`checkbox`) em formulários, já derivando
  `label` e mensagem de `erro` (para validações).

  # Exemplo de uso:

  ## básico
  ```pug
  switch-field(
    name="user[admin]",
    v-model="user.admin",
    :error="errors.admin"
  )
  ```

  ## avançado
  ```pug
  switch-field(
    id="user_is_admin",
    name="flags[admin]",
    :label="$t('.something.admin')",
    :value="false",
    :disabled="flagControlandoEstadoDeDesabilitado",
    :error="mensagemDeErroControlandoEstadoDeErro"
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $switch-error-color: red;
  // $switch-error-border-color: red;
  $switch-disabled-color: #ABABAB;
  // $switch-disabled-border-color: #D9D6D5;

  .switch-field {
    margin-bottom: 10px; //1.5rem => era 15px;

    label {
      font-size: 16px; // tamanho do "texto" em inputs

      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      font-weight: normal;
      margin: 0;
    }

    .toggle-switch {
      margin-right: 8px;
      vertical-align: middle;
    }
  }

  // error
  .switch-field.error {
    label {
      color: $switch-error-color;
    }

    .toggle-switch {
      // border-color: $switch-error-border-color;
    }
  }

  // disabled
  .switch-field.disabled,
  .switch-field.readonly {
    label {
      color: $switch-disabled-color;
    }

    .toggle-switch {
      // border-color: $switch-disabled-border-color;
    }
  }
</style>


<template lang="pug">
  .switch-field(:class="{ error, disabled, readonly }")
    toggle-switch(
      :id="inputId",
      :disabled="disabled",
      :readonly="readonly",
      :name="name",
      :value="value",
      @input="val => { $emit('input', val) }"
    )
    label.label(:for="inputId") {{ labelText }}
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'

  export default {
    // XXX sem as props `type` e `placeholder`
    extends: InputField,

    // sobrecarregando props
    props: {
      value: { type: Boolean }
    }
  }
</script>
