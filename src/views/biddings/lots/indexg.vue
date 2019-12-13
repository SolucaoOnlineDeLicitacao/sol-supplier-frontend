<style scoped lang="scss">
</style>

<template lang="pug">
  .mt-2
    .container
      template(v-if="proposalId")
        router-link.button.button-primary.u-full-width(:to="{ name: 'globalProposal', params: { id: proposalId } }")
          | {{ $t('.button.my_proposal') }}

      template(v-if="showProposals")
        router-link.mb-1.button.button-primary.router-link.u-full-width.mb-0(:to="{ name: 'globalProposals', params: { bidding_id: this.biddingId } }")
          | {{ $t('.button.proposals') }}

      lot-alerts(:lots="lots", :biddingId="biddingId", :proposalId="proposalId", @submitSuccess="submitSuccess")

      .card.mt-2
        h4 {{ $t('.title') }}
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

        template(v-else-if="lotsCount")
          lot-list-fields(:lots="lots")

        template(v-else)
          ul
            li.list-item.mb-1
              .container
                | {{ $t('.empty') }}

    overlay-notification(v-if="showSubmitOverlay", :showOverlay="showSubmitOverlay", :text="$t('.notifications.finish.success')")

</template>

<script>
  import LotListFields from './_index/lot-list-fields'
  import LotAlerts from './_index/lot-alerts'

  export default {
    name: 'lotsg',

    components: {
      LotListFields,
      LotAlerts
    },

    data () {
      return {
        i18nScope: 'biddings.lotsg.index',

        // resource
        isLoading: true,
        showSubmitOverlay: false,

        lots: null,
        lotsCount: null,
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

    computed: {
      showProposals() {
        return this.biddingStatus == 'finnished' || this.biddingUnderReview
      },

      proposalId() {
        return this.lots && this.lots[0] && this.lots[0].lot_proposals[0] && this.lots[0].lot_proposals[0].proposal_id
      },

      biddingStatus() {
        return this.biddingId && this.lots && this.lots[0] && this.lots[0].bidding_status
      },

      biddingModality() {
        return this.biddingId && this.lots && this.lots[0] && this.lots[0].bidding_modality
      },

      biddingUnderReview() {
        return this.biddingStatus == 'under_review'
      },
    },

    methods: {
      fetch() {
        let params = this.params

        this.isLoading = true

        return this.$http.get('/supplier/biddings/' + this.biddingId + '/lots', { params })
          .then((response) => {
            this.lots = response.data
            this.lotsCount = this.lots.length

            if(this.lotsCount > 0) {
              this.$emit('navbarTitleChanged', this.lots[0].bidding_title)
            }

            this.isLoading = false

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      submitSuccess() {
        this.showSubmitOverlay = true
        this.fetch()
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)
        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
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
