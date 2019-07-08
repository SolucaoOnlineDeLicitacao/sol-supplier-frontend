<!--
<doc lang="markdown">
    Componente para campos textuais (`input`) em formulários, já derivando `label`
  e mensagem de `erro` (para validações).

  # Exemplo de uso:

  ## básico
  ```pug
  input-field(
    type="text",
    name="user[name]",
    v-model="user.name",
    :placeholder="$t('.something')",
    :error="errors.name"
  )
  ```

  ## avançado
  ```pug
  input-field(
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
  $input-error-color: red;
  $input-error-border-color: red;
  $input-disabled-color: #CCC;
  $input-disabled-border-color: #E3E3E3;

  .input-field {
    position: relative;
    margin-bottom: 1.5rem;

    input {
      width: 100%;
      // Sobrecarregando estilo do Skeleton, trocando a margem para o "container",
      // fazendo com que as mensagens de erro fiquem próximas ao input (antes da
      // margem)
      // margin-bottom: 1.5rem;
      margin-bottom: 0;

      &.input-icon {
        padding-left: 30px;
      }
    }
  }

  .icon {
    position: absolute;
    bottom: 13px;
    left: 8px;
  }

  // error
  .input-field.error {
    label {
      color: $input-error-color;
    }

    input {
      border-color: $input-error-border-color;
    }
  }

  // disabled
  .input-field.disabled,
  .input-field.readonly {
    label {
      color: $input-disabled-color;
    }

    input {
      border-color: $input-disabled-border-color;
      color: $input-disabled-color;
    }
  }
</style>


<template lang="pug">
  .input-field(:class="{ error, disabled, readonly }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    input(
      :id="inputId",
      ref="input",
      :autocomplete="autocomplete",
      :autofocus="autofocus",
      :disabled="disabled",
      :readonly="readonly",
      :name="name",
      :placeholder="placeholder",
      :type="type",
      :value="value",
      v-mask="mask",
      :class="inputClass",
      @input="$emit('input', $event.target.value)"
    )
    div.icon(:class="iconClass")
    input-error(:message="error" :attribute="errorAttribute")
</template>


<script>
  import _ from '@/lib/lodash-ext'

  export default {
    props: {
      autocomplete: { type: Boolean, default: false },
      autofocus:    { type: Boolean, default: false },
      disabled:     { type: Boolean, default: false },
      error:        { type: String },
      errorAttribute: { type: String, default: null },
      id:           { type: String },
      label:        { type: String },
      model:        { type: String },
      hideLabel:    { type: Boolean, default: false },
      hideIcon:     { type: Boolean, default: true },
      iconClass:    { type: String, default: null },
      mask:         { type: [String, Object] },
      name:         { type: String, required: true },
      placeholder:  { type: String },
      readonly:     { type: Boolean, default: false },
      type:         { type: String, default: 'text' },
      value:        { type: [String, Number] },
      require:      { type: Boolean, default: false },
    },

    computed: {
      inputClass() {
        return this.hideIcon ? '' : 'input-icon'
      },

      attrName() {
        let match = /\[([^\]]+)\]$/.exec(this.name)
        return match ? _.camelize(match[1]) : null
      },

      modelName() {
        if (this.model) return this.model

        let match = /^([^\[]+)\[/.exec(this.name)
        return match ? _.camelize(match[1]) : null
      },

      /**
       *   Attributo `id` do `input`, que é definido por property ou fallback
       * para a convenção.
       *
       *   Não é possível definir, de maneira simples, valores _default_ para
       * _properties_ usando outras _properties_ (ex: valor default para `id`
       * é inferido a partid de `name`).
       *   A alternativa foi mover os valores para _computed properties_, com
       * um prefixo `c`.
       *
       * @return {String} Atributo `id` a ser utilizado no `input`
       */
      inputId() {
        if (this.id) return this.id

        return _.snakeize(this.name)
      },

      /**
       *   Texto do `label`, que é definido por property ou fallback
       * para a convenção.
       *
       *   Não é possível definir, de maneira simples, valores _default_ para
       * _properties_ usando outras _properties_ (ex: valor default para `id`
       * é inferido a partid de `name`).
       *   A alternativa foi mover os valores para _computed properties_, com
       * um prefixo `c`.
       *
       * @return {String} Texto do `label` associado ao `input`
       */
      labelText() {
        let text = this.$i18n.t(`models.${this.modelName}.attributes.${this.attrName}`)

        if (this.label) return this.label
        if (!this.require) return text

        return  text + "*"
      }
    },

    methods: {
      select() {
        this.$refs.input.select()
      }
    }
  }
</script>
