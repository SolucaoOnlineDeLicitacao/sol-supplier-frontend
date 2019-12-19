<!-- lot-group-item-overlay(:showOverlay="showOverlay", :overlayItem="overlayItem", @closeOverlay="showOverlay = false") -->


<style scoped lang="scss">
</style>

<template lang="pug">

  overlay-wnd(v-if="showOverlay", @close="close")
    .container(v-if="overlayItem")
      h4.mt-2.text-center {{ $t('.title') }}
      hr.mt-0.mb-2.o-container

      h4 {{ this.overlayItem.item_short_name }}

      label.mr-0-5.mt-2
        | {{ $t('models.group_item.attributes.quantity') }}:
      span
        | {{ $asNumber(this.overlayItem.quantity, { precision: 2 }) }}
        | {{ this.overlayItem.item_unit }}

      label.mr-0-5.mt-2
        | {{ $t('models.group_item.attributes.itemName') }}:
      span
        | {{ this.overlayItem.item_name }}
</template>


<script>

  export default {
    props: {
      overlayItem: { type: Object },
      showOverlay: { type: Boolean, default: false }
    },

    data() {
      return {
        i18nScope: 'components.lot-group-item-overlay',
      }
    },

    methods: {
      close() {
        this.$emit('closeOverlay')
      }
    }
  }

</script>
