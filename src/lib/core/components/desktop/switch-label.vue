<!--
<doc lang="markdown">

</doc>
-->

<style scoped lang="scss">
  /deep/ .switch-field {
    &.disabled,
    &.readonly {
      label.label {
        color: initial;
      }
    }
  }
</style>


<template lang="pug">
  .switch-label
    switch-field.switch-field(
      :readonly="true",
      :value="value",
      :name="name",
      :label="label"
    )
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
