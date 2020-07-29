<style scoped lang="scss">
</style>

<template lang="pug">
  .mt-2
    .container
      .card
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

</template>

<script>
  import LotListFields from './_index/lot-list-fields'

  export default {
    name: 'lots',

    components: {
      LotListFields
    },

    data () {
      return {
        i18nScope: 'biddings.lots.index',

        // resource
        isLoading: true,
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
            route: { name: 'lots', params: { bidding_id: null } },
            icon: 'fa-list',
            text: this.$t('biddings.tabs.lots'),
            active: true,
          }
        ]
      }
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
