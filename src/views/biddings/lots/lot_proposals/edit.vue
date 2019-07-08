<style scoped lang="scss">
</style>

<template lang="pug">
  .mt-2(v-if="lot_proposal")
    .container
      template(v-if="errors.price_total")
        .alert.alert-danger {{ errors.price_total }}

      .card
        h4.mb-0 {{ lot_proposal.bidding_title }}
        h5.mb-0 Lote: {{ lot.name }}

        div(v-if="lot.deadline")
          | {{ $t('models.lot.attributes.deadline') }}: {{ lot.deadline }}

        div(v-if="lot.address")
          | {{ $t('models.lot.attributes.address') }}: {{ lot.address }}

        hr.mt-2.mb-2.o-container

        form.mb-0(ref="form", method="patch", @submit.prevent="submit" v-if="lot_group_item_lot_proposals")
          input(type="hidden", name="lot_proposal[id]", :value="lot_proposal.id")

          lot-group-item-proposal-fields(:items="lot_group_item_lot_proposals", :errors="errors")

          hr.mt-2.mb-2.o-container

          input-field(
            type="text",
            v-model="lot_proposal.delivery_price",
            name="lot_proposal[delivery_price]",
            :mask="{ mask: '000000000000000,00', options: { reverse: true } }",
            :error="errors.delivery_price"
          )

          .text-center
            button.mb-0.button-primary(
              type="submit",
              :disabled="submitting"
            )
              | {{ submitText }}

        ul.blink-50(v-else)
          li.list-item
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x
          li.list-item.loading-2
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

          li.list-item.loading-3
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

          li.list-item.loading-4
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

</template>


<script>
  import LotGroupItemProposalFields from './_form/lot-group-item-proposal-fields'

  export default {
    name: 'editProposal',

    components: {
      LotGroupItemProposalFields
    },

    data () {
      return {
        i18nScope: 'biddings.lots.lot_proposals.edit',
        submitting: false,

        errors: { lot_group_item_proposals: {} },

        lot: null,
        proposal: null,
        lot_proposal: null,
        lot_proposals: null,
        lot_group_item_lot_proposals: null,
        params: null,
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },
    },

    methods: {
      getLotProposal() {
        return this.$http.get('/supplier/biddings/' + this.biddingId + '/lots/' + this.lotId + '/lot_proposals/' + this.params.id)
          .then((response) => {
            let that = this

            this.lot_proposal = response.data
            this.lot = this.lot_proposal.lot

            this.lot_group_item_lot_proposals = this.lot_proposal.lot_group_item_lot_proposals

            this.$emit('navbarTitleChanged', this.$t('.title'))

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.patch('/supplier/biddings/' + this.biddingId + '/lots/' + this.lotId + '/lot_proposals/' + this.params.id, formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'lotsg', params: { bidding_id: this.biddingId } }

            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'proposal' })

            if (_.isPresent(errors.lot_group_item_lot_proposals_errors)) {
              let customErrors = errors.lot_group_item_lot_proposals_errors

              for(let i = 0; i < customErrors.length; i++) {
                customErrors[i] = this.$i18n.errify(customErrors[i], { model: 'lot_group_item_proposal' })
              }

              this.errors.lot_group_item_proposals = customErrors
            }

          })
          .then(() => {
            this.submitting = false
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
        this.lotId = this.$params.asInteger(this.$route.params.lot_id)

        this.params = params
      },
    },

    created: function () {
      this.parseRoute()
      this.getLotProposal()
    }
  }

</script>
