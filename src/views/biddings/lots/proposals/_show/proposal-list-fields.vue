<style scoped lang="scss">

</style>

<template lang="pug">
  .proposal-container
    ul.mb-0
      li(v-for="(lot_group_item_lot_proposal, index) in lot_group_item_lot_proposals" @click="toggleOverlay(lot_group_item_lot_proposal.lot_group_item)")
        h5.mb-0 {{ lot_group_item_lot_proposal.lot_group_item.item_short_name }}

        div
          label.inline-block.mr-0-5
            | {{ $t('models.group_item.attributes.quantity') }}:
          span
            | {{ $asNumber(lot_group_item_lot_proposal.lot_group_item.quantity, { precision: 2 }) }}
            | {{ lot_group_item_lot_proposal.lot_group_item.item_unit }}
        div
          label.inline-block.mr-0-5
            | {{ $t('.price') }}
          span
            | {{ $asCurrency(lot_group_item_lot_proposal.price) }}

        hr.mt-0.mb-2.o-container

      li
        label
          | {{ $t('.delivery') }}
        span
         | {{ $asCurrency(proposal.delivery_price) }}

    lot-group-item-overlay(:showOverlay="showOverlay", :overlayItem="overlayItem", @closeOverlay="showOverlay = false")

</template>
<script>
  export default {
    props: {
      proposal: { type: Object },
      lot_group_item_lot_proposals: { type: Array }
    },

    data() {
      return {
        i18nScope: 'biddings.lots.proposals._show.proposal-list-fields',
        showOverlay: false,
        overlayItem: {},
      }
    },

    methods: {
      toggleOverlay(item) {
        this.overlayItem = item
        this.showOverlay = true
      },
    }
  }
</script>
