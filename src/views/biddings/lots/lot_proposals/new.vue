<style scoped lang="scss">

</style>

<template lang="pug">
  .mt-2(v-if="lot")
    .container
      .card
        h4.mb-0 {{ lot.bidding_title }}
        h5.mb-0 Lote: {{ lot.name }}

        div(v-if="lot.deadline")
          | {{ $t('models.lot.attributes.deadline') }}: {{ lot.deadline }}

        div(v-if="lot.address")
          | {{ $t('models.lot.attributes.address') }}: {{ lot.address }}

        hr.mt-2.mb-2.o-container

        form.mb-0(ref="form", method="post", @submit.prevent="submit" v-if="lot_group_item_proposals")
          input(type="hidden", name="lot_proposal[lot_id]", :value="lot.id")

          lot-group-item-proposal-fields(:items="lot_group_item_proposals", :errors="errors")

          hr.mt-0.mb-2.o-container

          numeric-field(
            v-model="lot_proposal.delivery_price",
            name="lot_proposal[delivery_price]",
            :error="errors.delivery_price",
            :label="$t('models.lotProposal.attributes.deliveryPrice')"
          )

          .text-center
            button.mb-0.button-primary(
              type="submit",
              :disabled="submitting"
            )
              | {{ submitText }}

        ul.blink-50(v-else)
          li.list-item.mb-1
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x
          li.list-item.mb-1.loading-2
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

          li.list-item.mb-1.loading-3
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

          li.list-item.mb-1.loading-4
            .container
              .list-title
              i.fas.fa-spinner.fa-pulse.fa-2x

</template>


<script>
  import LotGroupItemProposalFields from './_form/lot-group-item-proposal-fields'

  export default {
    name: 'newProposal',

    components: {
      LotGroupItemProposalFields
    },

    data () {
      return {
        i18nScope: 'biddings.lots.lot_proposals.new',
        submitting: false,

        errors: { lot_group_item_proposals: {} },

        lot_proposal: {},
        lot: null,
        lot_group_items: null,
        lot_group_item_proposals: null,
        params: null,

        tabs: [
          {
            route: { name: 'bidding', params: {} },
            icon: 'fa-file',
            text: this.$t('models.bidding.one'),
            active: true,
          },

          {
            route: { name: 'lots', params: {} },
            icon: 'fa-list',
            text: this.$t('biddings.tabs.lots'),
            active: false,
          }
        ]
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },
    },

    methods: {
      getLot() {
        return this.$http.get('/supplier/biddings/' + this.biddingId + '/lots/' + this.lotId)
          .then((response) => {
            let that = this

            this.lot = response.data
            this.lot_group_items = response.data.lot_group_items || []

            this.lot_group_item_proposals = _.map(this.lot_group_items, function(lot_group_item) {

              let current = _.filter(lot_group_item.lot_group_item_lot_proposals, { bidding_id: that.biddingId })
              let price = current[0] && parseFloat(current[0].price).toFixed(2) || null


              let hash = { lot_group_item: lot_group_item, price: price, _destroy: false, total_price: null, already_priced: price !== null }

              return hash
            });

            this.changeTabs()
            this.$emit('navbarTitleChanged', this.$t('.title'))

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.post('/supplier/biddings/' + this.biddingId + '/lots/' + this.lotId + '/lot_proposals', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'lotsg', params: { bidding_id: this.biddingId } }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

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

      changeTabs() {
        // add resource id to router tab
        this.tabs[0].route.params = { id: this.biddingId }
        this.tabs[1].route.params = { bidding_id: this.biddingId }

        // update default lot route if global bidding
        if(this.lot.bidding_kind == 'global') {
          this.tabs[1].route.name = 'lotsg'
        }

        this.$emit('tabChanged', this.tabs)
      }

    },

    created: function () {
      this.parseRoute()
      this.getLot()
    }
  }

</script>
