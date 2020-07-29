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
  .mt-2
    .container
      .card
        div(v-if="proposals && proposals[0]")
          h4.mt-0 Lista de propostas

          hr.mt-2.mb-2.o-container

        template(v-if="isLoading")
          ul.blink-50
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

        template(v-else-if="proposalsCount")
          proposal-list-fields(:bidding="bidding", :proposals="proposals", routeName="globalProposal")

        template(v-else-if="!seeProposals")
          ul.mb-0
            li.list-item
              | {{ $t('.cant_see') }}

        template(v-else)
          ul.mb-0
            li.list-item
              | {{ $t('.empty') }}

</template>

<script>
  import ProposalListFields from '../lots/proposals/_index/proposal-list-fields'

  export default {
    name: 'proposals',

    components: {
      ProposalListFields
    },

    data () {
      return {
        i18nScope: 'biddings.proposals.index',

        // resource
        isLoading: true,
        bidding: null,
        proposals: null,
        proposalsCount: null,

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
            text: this.$t('biddings.tabs.lots'),
            active: true,
          }
        ]
      }
    },

    computed: {
      seeProposals() {
        return this.bidding.supp_can_see || this.biddingUnderReviewAndUnrestricted
      },

      biddingUnderReviewAndUnrestricted() {
        return this.biddingModality == 'unrestricted' && this.biddingStatus == 'under_review'
      },

      biddingStatus() {
        return this.bidding.status
      },

      biddingModality() {
        return this.bidding.modality
      }
    },

    methods: {
      fetch() {
        let params = this.params

        this.isLoading = true

        return this.$http.get('/supplier/biddings/' + this.biddingId)
          .then((response) => {
            this.bidding = response.data
            return response
          })
          .then((response) => {
            if(this.seeProposals) {
              this.$http.get('/supplier/biddings/' + this.biddingId + '/proposals', { params })
                .then((response) => {
                  this.proposals = response.data
                  this.proposalsCount = this.proposals.length

                  this.isLoading = false

                }).catch((_err) => {
                  this.error = _err
                  console.error(_err)
                })
            }else{
              this.isLoading = false
            }

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
