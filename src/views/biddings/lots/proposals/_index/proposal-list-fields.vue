<style scoped lang="scss">
  .proposal-actions {
    text-align: center;

    .button {
      padding: 0 10px;
      margin-right: 10px;

      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .success-text {
    color: $apple-green;

    .fa-star {
      color: gold;
    }
  }

  .danger-text {
    color: $danger-color;
  }

</style>

<template lang="pug">
  ul.mb-0.mt-4.o-container
    li.list-item.row(v-for="(proposal, index) in proposals")

      .lowest-badge(v-if="index == 0")
        | {{ $t('.badge') }}
      .container
        .list-title
          | {{ $t('.provider', { name: proposal.provider.name }) }}
        span.list-span
          | {{ $t('.total', { value: $asCurrency(proposal.price_total) }) }}

        template(v-if="seeFullProposals")
          .proposal-actions.mt-1(v-if="proposal.status == 'accepted'")
            span.success-text
              i.fa.fa-star.mr-1
              | {{ $t('.status.accepted') }}

            router-link.button.ml-1(:to='showRoute(proposal.id)')
              | {{ $t('.button') }}

          .proposal-actions.mt-1(v-else-if="proposal.status == 'refused'")
            span.danger-text
              | {{ $t('.status.refused') }}

            router-link.button.ml-1(:to='showRoute(proposal.id)')
              | {{ $t('.button') }}

          .proposal-actions.mt-1(v-else-if="seeProposals")
            router-link.button.ml-1(:to='showRoute(proposal.id)')
              | {{ $t('.button') }}

</template>
<script>
  export default {
    props: {
      bidding: { type: Object },
      proposals: { type: Array },
      routeName: { type: String, default: 'proposal' }
    },

    computed: {
      seeFullProposals() {
        return this.bidding.supp_can_see
      }
    },

    data() {
      return {
        i18nScope: 'biddings.lots.proposals._index.proposal-list-fields',
        showOverlay: false,
        overlayItem: {},
      }
    },

    methods: {
      showRoute(id) {
        return { name: this.routeName, params: { id: id } }
      }
    }
  }
</script>
