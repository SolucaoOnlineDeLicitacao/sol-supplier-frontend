<style scoped lang="scss">
</style>


<template lang="pug">
  .container
    .row
      .six.columns
        label Pure
        input(id='pure-mask', ref="masked", v-model="maskedValue")
        label {{ maskedValue }}
      .six.columns
        label Pure directive
        input(v-mask="'0000 0000 0000'", v-model="directiveMaskedValue")
        label {{ directiveMaskedValue }}

    .row
      .six.columns
        label Dynamic with directive
        input(v-mask="dynamicMask", v-model="directiveDynamicMaskedValue", @click="toggleDynamicMask")
        label {{ directiveDynamicMaskedValue }}
</template>

<script>
  import Mask from './mask'
  import MaskDirective from './v-mask'

  export default {
    directives: {
      mask: MaskDirective
    },

    data() {
      return {
        maskedValue: '11invalid',

        directiveMaskedValue: 'invalid11',

        dynamicMask: '0000-0000',

        directiveDynamicMaskedValue: '1111-2222'
      }
    },

    mounted() {
      // programmatically applying mask
      this.mask = new Mask(this.$refs.masked, '00/0000', { placeholder: '__/____' })
    },

    methods: {
      toggleDynamicMask() {
        if (this.dynamicMask.indexOf('-') !== -1) {
          this.dynamicMask = this.dynamicMask.replace('-', '/')
        } else {
          this.dynamicMask = this.dynamicMask.replace('/', '-')
        }
      }
    }
  }
</script>
