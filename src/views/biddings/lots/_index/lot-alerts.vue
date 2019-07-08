<style scoped lang="scss">
</style>

<template lang="pug">
  .alert-container
    template(v-if="biddingStatus == 'ongoing'")
      template(v-if="includesAbandonedProposal")
        .alert.alert-warning
          | {{ $t('.status.abandoned') }}

      template(v-else-if="proposalStatus == 'sent'")
        .alert.alert-success
          template(v-if="biddingModality == 'closed_invite'")
            | {{ $t('.status.sent_and_closed_invite') }}
          template(v-else)
            | {{ $t('.status.sent') }}
      template(v-else="proposalStatus != 'sent'")
        .alert.alert-warning
          | {{ $t('.status.not_sent') }}

        template(v-if="!lots[0].global_proposal_importing")
          .button.button-primary.router-link.u-full-width(v-if="lots[0].invited", @click="showFileProposalOverlay = true")
            | {{ $t('.button.new_proposal_from_file') }}

        template(v-else)
          .alert.alert-info
            i.fa.fa-spin.fa-spinner
            | {{ $t('.status.importing') }}

        template(v-if="allFilled")
          .button.button-submit.u-full-width(@click="submit")
            | {{ submitText }}

      .alert.alert-info(v-if="lots[0].proposal_price_total")
        | {{ $t('.total', { value: $asCurrency(lots[0].proposal_price_total) }) }}

    template(v-else-if="biddingStatus == 'draw'")
      template(v-if="proposalStatus == 'draw'")
        .alert.alert-warning
          | {{ $t('.status.draw', { day: lots[0].bidding_draw_at }) }}

        .alert.alert-info(v-if="lots[0].proposal_price_total")
          | {{ $t('.total', { value: $asCurrency(lots[0].proposal_price_total) }) }}

      template(v-else)
        .alert.alert-warning
          | {{ $t('.status.draw_waiting') }}

    proposal-import-overlay(:lots="lots", :showFileProposalOverlay="showFileProposalOverlay", :biddingId="biddingId", @closeOverlay="showFileProposalOverlay = false")

</template>

<script>
  import ProposalImportOverlay from './proposal-import-overlay'

  export default {
    props: {
      lots: { type: Array },
      biddingId: { type: Number },
      proposalId: { type: Number }
    },

    components: {
      ProposalImportOverlay
    },

    computed: {
      biddingStatus() {
        let lots = this.lots

        return lots && lots[0] && lots[0].bidding_status
      },

      proposalStatus() {
        return this.lots[0].proposal_status
      },

      biddingModality() {
        return this.lots[0].bidding_modality
      },

      includesAbandonedProposal() {
        return this.lots && _.includes(_.map(this.lots, function(e){ return e.proposal_status }), "abandoned")
      },

      allFilled() {
        if(!this.lots) return false
        let all = true

        _.filter(this.lots, function(lot) {
          if(!_.isPresent(lot.lot_proposals[0])) {
            all = false
          }
        })

        return all
      },

      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },
    },

    data() {
      return {
        i18nScope: 'biddings.lotsg._index.lot-alerts',

        submitting: false,
        showFileProposalOverlay: false,
        errors: {},
      }
    },

    methods: {
      submit() {
        this.submitting = true

        this.$http.patch('/supplier/biddings/' + this.biddingId + '/proposals/' + this.proposalId + '/finish')
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}
            this.$emit('submitSuccess')
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}
            this.$notifications.error(this.$t('.notifications.finish.failure'))
          })
          .then(() => {
            this.submitting = false
          })
      },
    }
  }
</script>
