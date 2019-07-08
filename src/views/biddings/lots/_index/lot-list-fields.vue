<style scoped lang="scss">
  .badge {
    &.draft {
      background-color: $greyish-brown;
    }

    &.failure {
      background-color: $danger-color;
    }

    &.accepted {
      background-color: $apple-green;
    }

    &.desert {
      background-color: $peach;
    }
  }

  .proposal-status {
    position: absolute;
    right: 10px;
    bottom: 0;

    font-size: 12px;
    text-align: center;

    i {
      padding: 5px;
      width: 22px;
      background-color: $cerulean;
      border-radius: 100%;
      color: white;

      &.sent {
        background-color: $apple-green;
      }
    }

    &.empty {
      i {
        background-color: $brownish-grey;
      }
    }

    &.abandoned {
      i {
        background-color: $peach;
      }
    }
  }

</style>

<template lang="pug">
  ul.mb-0.o-container
    li.list-item.row(v-for="lot in lots")
      router-link(:to="{ name: 'lot', params: { bidding_id: lot.bidding_id, id: lot.id } }")
        .container.lot-container
          .list-title
            | {{ lot.name }}
          span.list-span
            | {{ $t('.lot_group_items_count', { value: lot.lot_group_items_count }) }}
          span.badge(:class="lot.status" v-if="lot.bidding_status == 'finnished'")
            | {{ $t('models.lot.attributes.statuses.' + lot.status) }}
          .proposal-status.importing(v-if="lot.proposal_importing || lot.global_proposal_importing")
            | {{ $t('.status.importing') }}
            i.fa.fa-spinner.fa-spin.ml-1

          .proposal-status.abandoned(v-else-if="lot.proposal_status == 'abandoned' || (lot.abandoned_proposal && lot.bidding_kind == 'global')")
            | {{ $t('.status.abandoned') }}
            i.fa.fa-close-thin.ml-1
          .proposal-status(v-else-if="lot.lot_proposals[0]")
            template(v-if="lot.proposal_status == 'draft'")
              | {{ $t('.status.draft') }}
              i.fa.fa-check.ml-1

            template(v-else)
              | {{ $t('.status.sent') }}
              i.fa.fa-check-double.ml-1.sent

          .proposal-status.empty(v-else)
            | {{ $t('.status.empty') }}
            i.fa.fa-exclamation.ml-1

</template>

<script>
  export default {
    props: {
      lots: { type: Array },
    },

    data() {
      return {
        i18nScope: 'biddings.lots._index.lot-list-fields',
        showOverlay: false,
        overlayItem: {},
      }
    }
  }
</script>
