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

<style scoped lang="scss">
  // TODO definir cor de erro!
  $select-error-color: red;
  $select-error-border-color: red;
  $select-disabled-color: #ABABAB;
  $select-disabled-border-color: #D9D6D5;

  .select-field {
    margin-bottom: 1.5rem;
  }

  // error
  .select-field.error {
    & > label {
      color: $select-error-color;
    }

    select {
      border-color: $select-error-border-color;
      color: $select-error-color;
    }

    .arrow {
      border-top-color: $select-error-border-color;
    }
  }

  // disabled
  .select-field.disabled {
    & > label {
      color: $select-disabled-color;
    }

    select {
      border-color: $select-disabled-border-color;
      color: $select-disabled-border-color;
    }

    .arrow {
      border-top-color: $select-disabled-border-color;
    }
  }

  .select-input {
    position: relative;
    width: 100%;

    select {
      background: transparent;
      padding: 5px 12px;
      padding-right: 27px;
      width: 100%;
      margin-bottom: 0;

      // Remove a seta do dropdown
      -webkit-appearance: none;
      -moz-appearance: none;

      /*Remove a seta do dropdown IE10*/
      &::-ms-expand {
          display: none;
      }

      &:focus + .arrow {
        border-top-color: $primary-color;
      }
    }

    .arrow {
      position: absolute;
      right: 12px;
      top: 17px;

      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;

      border-top: 6px solid #b9b9b9;
    }
  }
</style>


<template lang="pug">
  .field.select-field(:class="{ error, disabled }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    .select-input
      select(
        ref="select",
        :disabled="disabled",
        :id="inputId",
        :name="name",
        :placeholder="placeholder",
        :value="value",
        @change="$emit('input', cast($event.target.value))",
      )
        option(v-for="option in options", :value="option.id") {{ option.text }}
        slot
      .arrow
    input-error(:message="error")
</template>


<script>
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    // propriedades extras e/ou sobrecarregadas
    props: {
      options: null
    },

    methods: {
      cast(value) {
        switch (this.type) {
          case 'integer': {
            return parseInt(value, 10)
          }
          case 'float': {
            return parseFloat(value)
          }
          case 'string':
          default: {
            return value
          }
        }
      }
    },

    watch: {
      options(options) {
        let selectedValue = this.value

        this.$nextTick(() => {
          // XXX re-selecionando o valor que era o marcado antes da mudança de opções!
          this.$refs.select.value = selectedValue
        })
      }
    }
  }
</script>
