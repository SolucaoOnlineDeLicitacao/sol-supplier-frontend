<template lang="pug">
  .text-center
    .alert.alert-warning(v-if="lot.proposal_status == 'abandoned'")
      | {{ $t('.proposal.abandoned.alert') }}

    .draw-container(v-else-if="draw")
      .alert.alert-info.mb-1
        | {{ $t('.proposal.draw.alert') }}

      template(v-if="!lot.proposal_importing")
        edit-proposal-buttons(:lot="lot", :currentProposal="currentProposal", :biddingId="biddingId", :params="params")

      template(v-else)
        .alert.alert-info
          i.fa.fa-spin.fa-spinner
          | {{ $t('.proposal.importing.alert') }}

    .alert.alert-info(v-else-if="defaultStatus")
      template(v-if="draw")
        | {{ $t('.draw_with_proposal') }}
      template(v-else)
        | {{ $t('.' + lot.bidding_status ) }}

    .alert.alert-info(v-else-if="lot.pending")
      | {{ $t('.invites.pending') }}

    .invite-container(v-else-if="!lot.invited")
      .alert.alert-info
        | {{ $t('.invites.not_invited') }}

      request-invite-button(:lot="lot", :biddingId="biddingId", @success="successInvite")

    .text-center(v-else-if="currentProposal && lot.bidding_status != 'draw'")
      template(v-if="cannotEdit")
        .alert.alert-info
          | {{ $t('.proposal.cannot_edit.alert') }}

      template(v-else)
        template(v-if="!lot.proposal_importing")
          edit-proposal-buttons(:lot="lot", :currentProposal="currentProposal", :biddingId="biddingId", :params="params")

      template(v-if="!lot.proposal_importing")
        destroyProposalButtons(:lot="lot", :currentProposal="currentProposal", :biddingId="biddingId")

      template(v-else)
        .alert.alert-info
          i.fa.fa-spin.fa-spinner
          | {{ $t('.proposal.importing.alert') }}

    .text-center(v-else-if="lot.bidding_status == 'ongoing'")
      template(v-if="lot.abandoned_proposal && lot.bidding_kind == 'global' && lot.bidding_modality == 'closed_invite'")
        .container
          .alert.alert-warning
            | {{ $t('.proposal.abandoned.alert') }}

      template(v-else)
        template(v-if="!(lot.proposal_importing || lot.global_proposal_importing)")
          template(v-if="lot.bidding_kind != 'global'")
            router-link.button.button-primary.router-link.mb-1.u-full-width(:to="{ name: 'newProposal', params: { bidding_id: this.biddingId, lot_id: this.params.id } }")
              | {{ $t('.button.new_proposal') }}

            template(v-if="notUnitary")
              .button.button-primary.router-link.mb-1.u-full-width(@click="showFileProposalOverlay = true")
                | {{ this.$t('.button.new_proposal_from_file') }}

          template(v-else)
            router-link.button.button-primary.router-link.mb-0.u-full-width(:to="{ name: 'newLotProposal', params: { bidding_id: this.biddingId, lot_id: this.params.id } }")
              | {{ $t('.button.new_global_proposal') }}

        template(v-else)
          .alert.alert-info
            i.fa.fa-spin.fa-spinner
            |  {{ $t('.proposal.importing.alert') }}

    proposal-import-overlay(:lot="lot", :showFileProposalOverlay="showFileProposalOverlay", :biddingId="biddingId", @closeOverlay="showFileProposalOverlay = false")

</template>

<script>
  import EditProposalButtons from './edit-proposal-buttons'
  import DestroyProposalButtons from './destroy-proposal-buttons'
  import RequestInviteButton from './request-invite-button'
  import ProposalImportOverlay from './proposal-import-overlay'

  export default {
    props: {
      lot: { type: Object },
      currentProposal: { type: Object },
      biddingId: { type: Number },
      params: { type: Object }
    },

    components: {
      EditProposalButtons,
      DestroyProposalButtons,
      RequestInviteButton,
      ProposalImportOverlay
    },

    data() {
      return {
        i18nScope: 'biddings.lots._show.lot-actions',
        showFileProposalOverlay: false,
      }
    },

    computed: {
      defaultStatus() {
        if(!this.lot) return
        return _.includes(this.allowedStatuses, this.lot.bidding_status)
      },

      allowedStatuses() {
        return ['under_review', 'finnished', 'reopened', 'failure', 'canceled']
      },

      draw() {
        return this.lot && this.lot.proposal_status == 'draw'
      },

      notUnitary() {
        return this.lot.bidding_kind != "unitary"
      },

      cannotEdit() {
        return this.lot.bidding_modality == 'closed_invite' && this.lot.proposal_status == 'sent'
      }
    },

    methods: {
      successInvite() {
        this.$emit('successInvite')
      }
    }
  }
</script>
