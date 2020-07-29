<template lang="pug">
  .destroy-proposal-buttons
    template(v-if="lot.bidding_kind != 'global'")
      .mt-1.button.button-destroy.u-full-width(@click="destroyDialog(currentProposal.proposal_id)")
        | {{ this.$t('.destroy.title') }}

    template(v-else)
      .mt-1.button.button-destroy.u-full-width(@click="destroyLotProposalDialog(currentProposal.id)" )
        | {{ this.$t('.destroy.title') }}

</template>

<script>
  export default {
    props: {
      lot: { type: Object },
      currentProposal: { type: Object },
      biddingId: { type: Number },
    },

    data() {
      return {
        i18nScope: 'biddings.lots._show.destroy-proposal-buttons',
      }
    },

    methods: {

      destroy(id) {
        return this.$http.delete('/supplier/biddings/' + this.biddingId + '/proposals/' + id)
          .then((_response) => {
            this.$notifications.info(this.$t('.notifications.destroy.success', { id }))
            this.$router.replace({ name: 'lots', params: { bidding_id: this.biddingId }})
          })
          .catch((_err) => {
            this.$notifications.error(this.$t('.notifications.destroy.failure', { id }))
          })
      },

      destroyLotProposal(id) {
        return this.$http.delete('/supplier/biddings/' + this.biddingId + '/lots/' + this.lot.id + '/lot_proposals/' + id)
          .then((_response) => {
            this.$notifications.info(this.$t('.notifications.destroy.success', { id }))
            this.$router.replace({ name: 'lotsg', params: { bidding_id: this.biddingId }})
          })
          .catch((_err) => {
            this.$notifications.error(this.$t('.notifications.destroy.failure', { id }))
          })
      },

      destroyDialog(id) {
        let message = {
          title: this.$t('.destroy.title'),
          body: this.$t('.destroy.body')
        }

        let options = {
          cancelText: this.$t('dialog.back'),
          okText: this.$t('dialog.destroy'),
          customClass: 'dg-delete'
        }

        this.$dialog.confirm(message, options)
          .then((dialog) => {
            this.destroy(id)
          })
          .catch(function (err) {
            console.log(err)
            console.log('nop!')
          });
      },

      destroyLotProposalDialog(id) {
        let message = {
          title: this.$t('.destroy.title'),
          body: this.$t('.destroy.body')
        }

        let options = {
          cancelText: this.$t('dialog.back'),
          okText: this.$t('dialog.destroy'),
          customClass: 'dg-delete'
        }

        this.$dialog.confirm(message, options)
          .then((dialog) => {
            this.destroyLotProposal(id)
          })
          .catch(function (err) {
            console.log(err)
            console.log('nop!')
          });
      },

    }
  }
</script>
