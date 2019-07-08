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

          span.small(v-if="item.lot_group_item.lot_group_item_count > 1")
            | {{ $t('.count', { count: item.lot_group_item.lot_group_item_count}) }}

        input(type="hidden", name="lot_proposal[lot_group_item_lot_proposals_attributes][][id]", :value="item.id")

        input(type="hidden", name="lot_proposal[lot_group_item_lot_proposals_attributes][][_destroy]", :value="item._destroy")

        input(type="hidden", name="lot_proposal[lot_group_item_lot_proposals_attributes][][lot_group_item_id]", :value="item.lot_group_item.id")

        input(type="hidden", name="lot_proposal[lot_group_item_lot_proposals_attributes][][price]", :value="item.price | stringfy")

        label.inline-block.mr-0-5.ml-0
          | {{ $t('models.group_item.attributes.quantity') }}:
        span
          | {{ $asNumber(item.lot_group_item.quantity, { precision: 0}) }}
          | {{ item.lot_group_item.item_unit }}

        .proposal-container(v-if="item.price")
          hr.mb-1.mt-1

          strong
            | {{ $t('.my_quote') }}
          span
            | {{ $asCurrency(item.price) }}
            i.small
              | {{ $t('.per_unit', { unit: item.lot_group_item.item_unit}) }}

          div.unique-price-alert.small(v-if="item.already_priced")
            .alert.alert-info
              | {{ $t('.unique_price') }}

        .proposal-container(v-else-if="errors.lot_group_item_proposals[index]")
          span.error
            | {{ errors.lot_group_item_proposals[index]["price"] }}

        .proposal-container(v-else)
          span.small {{ $t('.inform_proposal') }}

    lot-group-item-proposal-overlay(:showOverlay="showOverlay", @closeOverlay="showOverlay = false", :item="overlayItem")

</template>

<script>

  import LotGroupItemProposalOverlay from './lot-group-item-proposal-overlay'

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
        i18nScope: 'biddings.lots.lot_proposals._form.lot-group-item-proposal-fields',
        showOverlay: false,
        overlayItem: {},
      }
    },

    filters: {
      stringfy(value) {
        if(!value) return value

        let splited = Number(value).toFixed(2).split('.')
        let decimalPart = splited[0]
        let integerPart = splited[1]

        return [decimalPart, integerPart].join(',')
      },
    },

    methods: {
      toggleOverlay(item) {
        let priceStr = this.stringfy(item.price)

        this.overlayItem = item
        this.$set(this.overlayItem, 'priceStr', priceStr)

        this.showOverlay = true
      },

      stringfy(value) {
        if(!value) return value

        let splited = Number(value).toFixed(2).split('.')
        let decimalPart = splited[0]
        let integerPart = splited[1]

        return [decimalPart, integerPart].join(',')
      },

      moneyToFloat(value) {
        if (!value) return ''
        if( typeof value === 'number') return value
        return Number(value.split(',').join('.'))
      },
    },

    watch: {
      overlayItem: {
        handler: function(item) {
          if(this.showOverlay) item.price = this.moneyToFloat(item.priceStr)
        },
        deep: true
      }
    }
  }

</script>
