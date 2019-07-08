<style scoped lang="scss">
</style>

<template lang="pug">
  .mt-2
    .container(v-if="isLoading")
      .card

        h4.mt-2 ...

        ul.blink-50
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

    .container(v-else)
      general-fields(:proposal="proposal", :bidding="bidding")

      .card.mt-2.mb-2(v-for="(lot_proposal, index) in lot_proposals")
        h4 {{ lot_proposal.lot.name }}
        hr.mt-0.mb-2.o-container

        proposal-list-fields(:lot_group_item_lot_proposals="lot_proposal.lot_group_item_lot_proposals", :proposal='lot_proposal')

</template>

<script>
  import GeneralFields from '../lots/proposals/_show/general-fields'
  import ProposalListFields from '../lots/proposals/_show/proposal-list-fields'

  export default {
    name: 'globalProposal',

    components: {
      GeneralFields,
      ProposalListFields
    },

    data () {
      return {
        i18nScope: 'biddings.proposals.show',

        // resource
        isLoading: true,
        bidding: null,
        proposal: null,
        lot_proposals: {},

        params: {},

        tabs: [
          {
            route: { name: 'bidding', params: {} },
            icon: 'fa-file',
            text: this.$t('models.bidding.one'),
            active: false,
          },

          {
            route: { name: 'lotsg', params: { bidding_id: null } },
            icon: 'fa-list',
            text: this.$t('biddings.lots.index.tabs.lots'),
            active: true,
          }
        ]
      }
    },

    methods: {
      fetch() {
        let params = this.params

        this.isLoading = true

        return this.$http.get('/supplier/biddings/' + this.biddingId)
          .then((response) => {
            this.bidding = response.data
            this.$emit('navbarTitleChanged', this.bidding.title)
            return response
          })
          .then((response) => {
            this.$http.get('/supplier/biddings/' + this.biddingId + '/proposals/' + params.id)
              .then((response) => {
                this.proposal = response.data
                this.lot_proposals = response.data.lot_proposals

                this.isLoading = false

              }).catch((_err) => {
                this.error = _err
                console.error(_err)
              })

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
        this.lotId = this.$params.asInteger(this.$route.params.lot_id)
        this.params = params
      },

      updateTabsRoutes() {
        this.tabs[0].route.params = { id: this.biddingId }
        this.tabs[1].route.params = { bidding_id: this.biddingId }
      },

      init() {
        this.parseRoute()
        this.updateTabsRoutes()
        this.fetch()
        this.$emit('tabChanged', this.tabs)
      }
    },

    created: function () {
      this.init();
    },

  }

</script>
