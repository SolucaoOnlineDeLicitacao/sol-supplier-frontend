<template lang="pug">
  .edit-proposal-buttons
    template(v-if="lot.bidding_kind != 'global'")
      router-link.button.button-primary.router-link.mb-0.u-full-width(:to="{ name: 'editProposal', params: { bidding_id: this.biddingId, lot_id: this.params.id, id: currentProposal.proposal_id  } }")
        template(v-if="lot.proposal_status == 'draft'")
          | {{ $t('.button.edit_draft_proposal') }}
        template(v-else)
          | {{ $t('.button.edit_proposal') }}

    template(v-else)
      router-link.button.button-primary.router-link.mb-0.u-full-width(:to="{ name: 'editLotProposal', params: { bidding_id: this.biddingId, lot_id: this.params.id, id: currentProposal.id  } }")
        | {{ $t('.button.edit_proposal') }}

</template>

<script>
  export default {
    props: {
      lot: { type: Object },
      currentProposal: { type: Object },
      biddingId: { type: Number },
      params: { type: Object }
    },

    data() {
      return {
        i18nScope: 'biddings.lots._show.edit-proposal-buttons',
      }
    },
  }
</script>
