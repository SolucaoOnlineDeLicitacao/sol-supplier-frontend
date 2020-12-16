<style scoped lang="scss">
</style>

<template lang="pug">
  .mt-2(v-if="lot")
    .container
      template(v-if="lot.bidding_kind != 'global' && (lot.bidding_status == 'finnished' || biddingUnderReviewAndUnrestricted)")
        router-link.mb-2.button.button-primary.router-link.u-full-width.mb-0(:to="{ name: 'proposals', params: { bidding_id: this.biddingId, lot_id: lot.id } }")
          | {{ this.$t('.button.proposals') }}

      .card.slim.mb-2
        .container
          h4.mt-1.mb-1 {{ lot.name }}

        hr.mt-0.mb-2

        ul.mb-0(v-if="lot_group_items")
          li.list-item.row(v-for="(lot_group_item) in lot_group_items" @click="toggleOverlay(lot_group_item)")
            .container
              .list-title {{ lot_group_item.item_short_name }}
              label.inline-block.list-span
                | {{ $t('models.group_item.attributes.quantity') }}:
              span
                | {{ $asNumber(lot_group_item.quantity, { precision: 2 }) }}
                | {{ lot_group_item.item_unit }}

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

      attachment-list-fields(:lot="lot")

      template(v-if="currentProposal && !isAbandoned")
        router-link.button.button-primary.u-full-width(:to="{ name: 'proposal', params: { id: currentProposal.id, lot_id: this.lotId } }")
          | {{ this.$t('.button.view_proposal') }}

      lot-actions(:lot="lot", :currentProposal="currentProposal", :biddingId="biddingId", :params="params", @successInvite="successInvite")

    lot-group-item-overlay(:showOverlay="showOverlay", :overlayItem="overlayItem", @closeOverlay="showOverlay = false")

</template>

<script>
  import AttachmentListFields from './_show/attachment-list-fields'
  import LotActions from './_show/lot-actions'

  export default {
    name: 'lot',

    components: {
      AttachmentListFields,
      LotActions
    },

    data () {
      return {
        i18nScope: 'biddings.lots.show',

        showOverlay: false,
        overlayItem: {},

        lot: null,
        proposals: null,
        lot_group_items: null,
        params: null,

        tabs: [
          {
            route: { name: 'bidding', params: {} },
            icon: 'fa-file',
            text: this.$t('models.bidding.one'),
            active: false,
          },

          {
            route: { name: 'lots', params: { bidding_id: 0 } },
            icon: 'fa-list',
            text: this.$t('biddings.tabs.lots'),
            active: true,
          }
        ]
      }
    },

    computed: {
      currentProposal() {
        let that = this

        if(!this.lot_proposals || !this.lot) return null
        return _.filter(this.lot_proposals, function(o) { return o.lot_id == that.lot.id })[0]
      },

      isAbandoned() {
        return this.lot.proposal_status == 'abandoned'
      },

      biddingStatus() {
        return this.lot && this.lot.bidding_status
      },

      biddingModality() {
        return this.lot && this.lot.bidding_modality
      },

      biddingUnderReviewAndUnrestricted() {
        return this.biddingModality == 'unrestricted' && this.biddingStatus == 'under_review'
      },
    },

    methods: {

      getLot() {
        return this.$http.get('/supplier/biddings/' + this.biddingId + '/lots/' + this.$route.params.id)
          .then((response) => {
            this.lot = response.data
            this.lot_proposals = response.data.lot_proposals
            this.lot_group_items = response.data.lot_group_items || []

            this.updateTabsRoutes()
            this.$emit('navbarTitleChanged', this.lot.bidding_title)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      successInvite() {
        this.getLot()
      },

      toggleOverlay(item) {
        this.overlayItem = item
        this.showOverlay = true
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
        this.lotId = this.$params.asInteger(this.$route.params.id)
        this.params = params
      },

      updateTabsRoutes() {
        this.tabs[0].route.params = { id: this.biddingId }
        this.tabs[1].route.params = { bidding_id: this.biddingId }

        if(this.lot.bidding_kind == 'global') {
          this.tabs[1].route.name = 'lotsg'
        }
      }
    },

    created: function () {
      this.parseRoute()
      this.getLot()
      this.$emit('tabChanged', this.tabs)
    }
  }

</script>
