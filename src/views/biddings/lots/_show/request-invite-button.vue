<template lang="pug">
  .mt-1.button.button-primary(@click="requestInvite")
    template(v-if="submittingInvite")
      i.fa.fa-spin.fa-spinner
    template(v-else)
      | {{ $t('.button.invite') }}

</template>

<script>
  export default {
    props: {
      lot: { type: Object },
      biddingId: { type: Number }
    },

    data() {
      return {
        i18nScope: 'biddings.lots._show.request-invite-button',
        submittingInvite: false,
      }
    },

    methods: {

      requestInvite() {
        this.submittingInvite = true

        if(this.lot.bidding_modality == 'open_invite') {
          this.requestOpenInvite()
        } else {
          this.requestClosedInvite()
        }
      },

      requestOpenInvite() {
        this.$http.post('/supplier/biddings/' + this.biddingId + '/invites/open', {})
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.invite.success'))

            this.$emit('success')
          })
          .catch((err) => {
            console.log(err)
            this.$notifications.error(this.$t('.notifications.invite.failure'))

          })
          .then(() => {
            this.submittingInvite = false
          })
      },

      requestClosedInvite() {
        this.$http.post('/supplier/biddings/' + this.biddingId + '/invites/closed', {})
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.invite.success'))

            this.$emit('success')
            // this.getLot()
          })
          .catch((err) => {
            console.log(err)
            this.$notifications.error(this.$t('.notifications.invite.failure'))

          })
          .then(() => {
            this.submittingInvite = false
          })
      },

    }
  }
</script>
