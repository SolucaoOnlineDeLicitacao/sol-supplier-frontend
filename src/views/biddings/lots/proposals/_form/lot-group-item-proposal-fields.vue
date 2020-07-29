<style scoped lang="scss">
  .error {
    display: block;
    font-size: 12px;
    color: #FF0000;
  }

  .small {
    font-size: 75%;
  }

  .proposal-container {
    color: $primary-color;
  }

  .price-container {
    position: relative;

    .unit {
      position: absolute;
      right: 10px;
      top: 35px;
      text-align: right;
      color: gray;
    }
  }

</style>

<template lang="pug">
  ul.mb-0.o-container
    li.list-item.row(v-for="(item, index) in items" @click="toggleOverlay(item)")
      .container
        .list-title
          | {{ item.lot_group_item.item_short_name }}

        input(type="hidden", name="proposal[lot_proposals_attributes][][lot_group_item_lot_proposals_attributes][][id]", :value="item.id")

        input(type="hidden", name="proposal[lot_proposals_attributes][][lot_group_item_lot_proposals_attributes][][_destroy]", :value="item._destroy")

        input(type="hidden", name="proposal[lot_proposals_attributes][][lot_group_item_lot_proposals_attributes][][lot_group_item_id]", :value="item.lot_group_item.id")

        input(type="hidden", name="proposal[lot_proposals_attributes][][lot_group_item_lot_proposals_attributes][][price]", :value="item.price")

        label.inline-block.mr-0-5.ml-0
          | {{ $t('models.group_item.attributes.quantity') }}:
        span
          | {{ $asNumber(item.lot_group_item.quantity, { precision: 2 }) }}
          | {{ item.lot_group_item.item_unit }}

        .proposal-container(v-if="item.price")
          hr.mb-1.mt-1

          strong
            | {{ $t('.my_quote') }}
          span
            | {{ $asCurrency(item.price) }}
            i.small
              | {{ $t('.per_unit', { unit: item.lot_group_item.item_unit}) }}

        .proposal-container(v-else-if="errors.lot_group_item_proposals[index] && errors.lot_group_item_proposals[index]['price']")
          hr.mb-1.mt-1
          span.error
            | {{ errors.lot_group_item_proposals[index]["price"] }}

        .proposal-container(v-else)
          hr.mb-1.mt-1
          span.small {{ $t('.inform_proposal') }}

    lot-group-item-proposal-overlay(:showOverlay="showOverlay", @closeOverlay="showOverlay = false", :item="overlayItem")

</template>

<script>
  import LotGroupItemProposalOverlay from '../../lot_proposals/_form/lot-group-item-proposal-overlay'

  export default {
    props: {
      items: { type: Array },
      errors: { type: Object, default: () => {} },
    },

    components: {
      LotGroupItemProposalOverlay
    },

    data() {
      return {
        i18nScope: 'biddings.lots.proposals._form.lot-group-item-proposal-fields',
        showOverlay: false,
        overlayItem: {},
      }
    },

    computed: {
      totalPrice() {
        this.overlayItem.total_price = this.moneyToFloat(this.overlayItem.price) * this.overlayItem.lot_group_item.quantity

        return this.overlayItem.total_price
      }
    },

    methods: {
      toggleOverlay(item) {
        this.overlayItem = item
        this.showOverlay = true
      }
    }
  }

</script>
