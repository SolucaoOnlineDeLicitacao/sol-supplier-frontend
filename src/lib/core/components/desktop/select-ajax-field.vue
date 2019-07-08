<template lang="pug">
  .field.select-field(:class="{ error, disabled }")
    label(v-if="!hideLabel", :for="inputId") {{ labelText }}
    select2-ajax(
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
      @input="val => { $emit('input', val) }",
      :url="url"
    )
      slot
    input-error(:message="error")
</template>


<script>
  import SelectField from './select-field.vue'

  export default {
    extends: SelectField,

    // propriedades extras e/ou sobrecarregadas
    props: {
      url: null
    }
  }
</script>
