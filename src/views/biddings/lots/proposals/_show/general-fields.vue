<style scoped lang="scss">
  .proposal-actions {
    text-align: center;
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
  .card
    h4 {{ $t('.title') }}
    hr.mt-0.mb-2.o-container

    div
      label {{ $t('.provider', { name: proposal.provider.name }) }}

    div
      | {{ $t('.total', { value: $asCurrency(proposal.price_total) }) }}

    template(v-if="seeProposals")
      .proposal-actions.mt-1(v-if="proposal.status == 'refused'")
        span.danger-text
          | {{ $t('.proposal.refused') }}

      .proposal-actions.mt-1(v-else-if="proposal.status == 'accepted'")
        span.success-text
          i.fa.fa-star.mr-1
          | {{ $t('.proposal.accepted') }}

</template>
<script>
  export default {
    props: {
      proposal: { type: Object },
      bidding: { type: Object }
    },

    computed: {
      seeProposals() {
        return this.bidding && this.bidding.supp_can_see
      }
    },

    data() {
      return {
        i18nScope: 'biddings.lots.proposals._show.general-fields'
      }
    },
  }
</script>
