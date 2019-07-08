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
  overlay-wnd(v-if="showOverlay", @close="close")
    .container(v-if="item")
      h4.mt-2.text-center {{ $t('.title') }}
      hr.mt-0.mb-2.o-container
      h4 {{ this.item.lot_group_item.item_short_name }}

      div.alert.alert-info(v-if="this.item.lot_group_item.lot_group_item_count > 1")
        | {{ $t('.lot_group_item_count', { count: this.item.lot_group_item.lot_group_item_count }) }}

      label.mt-2
        | {{ $t('models.group_item.attributes.quantity') }}:
      span
        | {{ $asNumber(this.item.lot_group_item.quantity, { precision: 0}) }}
        | {{ this.item.lot_group_item.item_unit }}

      label.mt-2
        | {{ $t('models.group_item.attributes.itemName') }}:
      span
        | {{ this.item.lot_group_item.item_name }}

      hr

      .price-container
        input-field(
          type="text",
          v-model="item.priceStr",
          name="proposal[lot_proposals_attributes][][lot_group_item_lot_proposals_attributes][][price]",
          :label="$t('.label')",
          :mask="{ mask: '000000000000000,00', options: { reverse: true } }"
        )

        i.unit
          | / {{ this.item.lot_group_item.item_unit }}

      div
        | {{ $t('.total') }}
        strong
          |  {{ $asCurrency(totalPrice) }}

      .text-center
        .button.button-submit.mt-3(@click="close")
          | {{ $t('.button') }}

</template>

<script>

  export default {
    props: {
      item: { type: Object },
      showOverlay: { type: Boolean, default: false },
    },

    data() {
      return {
        i18nScope: 'biddings.lots.lot_proposals._form.lot-group-item-proposal-overlay',
      }
    },

    computed: {
      totalPrice() {
        this.item.total_price = this.moneyToFloat(this.item.price) * this.item.lot_group_item.quantity

        return this.item.total_price
      },
    },

    methods: {
      close() {
        this.$emit('closeOverlay')
      },

      moneyToFloat(value) {
        if (!value) return ''
        if( typeof value === 'number') return value
        return Number(value.split(',').join('.'))
      },
    },
  }

</script>
