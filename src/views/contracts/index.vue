<style scoped lang="scss">
  .list-item {
    border-bottom: none;
  }

  .badge {
    &.waiting_signature {
      background-color: $greyish-brown;
    }

    &.signed {
      background-color: $cerulean;
    }

    &.refused {
      background-color: $danger-color;
    }

    &.partial_execution,
    &.total_inexecution {
      background-color: $peach;
    }

    &.completed {
      background-color: $apple-green;
    }
  }

</style>


<template lang="pug">
  .root.mt-2

    form.mt-2.container.filter(ref="form", method="get" @submit.prevent="fetchSearch")
      .search-field
        input-field(
          type="text",
          v-model="search",
          name="search",
          :placeholder="$t('.search.placeholder')",
          :hideLabel='true'
        )

    div(v-if="contractsCount > 0")
      ul
        li.list-item.row(v-for="(contract) in contracts")
          router-link(:to="{ name: 'contract', params: { id: contract.id } }")
            .container
              .card
                .list-text
                  h5.mb-1 {{ $t('.card.title', { title: contract.title }) }}

                  div
                    label.inline-block
                      | {{ $t('models.contract.attributes.bidding_title') }}:
                    span {{ contract.bidding_title }}

                  div
                    label.inline-block
                      | {{ $t('models.contract.attributes.status') }}:
                    span.badge(:class="contract.status")
                      | {{ $t('models.contract.attributes.statuses.' + contract.status) }}

                  div
                    label.mr-0-5.inline-block
                      | {{ $t('models.contract.attributes.price_total') }}:
                    span {{ $asCurrency(contract.price_total) }}

    .text-center(v-else-if="contractsCount == 0")
      | {{ $t('.empty') }}

    .blink-50(v-else)
      ul
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

    .row
      .twelve.columns
        paginator(
          v-model="page",
          :prev="prevPageLink",
          :next="nextPageLink",
          v-if="contractsCount"
        )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'contracts',
    data () {
      return {
        i18nScope: 'contracts.index',

        // resource
        contracts: null,
        contractsCount: null,
        params: {},

        tabs: [],

        //search
        search: '',
        searching: false,

        // pagination
        page:          1,
        prevPageLink:  '',
        nextPageLink:  '',
        totalPages:    1,
      }
    },

    computed: {
      fetchParams() {
        return this.params
      },
    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/supplier/contracts', { params })
          .then((response) => {
            this.contracts = response.data
            this.contractsCount = this.contracts.length

            this.updatePagination(response)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      updatePagination(aResponse) {
        this.page = aResponse.headers['x-page']
        this.totalPages = aResponse.headers['x-total']
        let links = parseLinkHeaders(aResponse.headers.link) || {}

        this.prevPageLink = _.dig(links, 'prev', 'page')
        this.nextPageLink = _.dig(links, 'next', 'page')
      },

      fetchSearch() {
        this.params = { search: this.search }

        this.updateRoute()
      },

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.push({ name: 'contracts', query: data });
      },

      init() {
        this.params = this.$route.query
      }
    },

    created: function () {
      this.$emit('tabChanged', this.tabs)
      this.$emit('navbarTitleChanged', this.$t('.title'))

      this.init();
    },

    watch: {
      fetchParams() {
        this.fetch()
      },

      page() {
        this.params = Object.assign({}, this.params, { page: this.page });
        this.updateRoute()
      }
    }
  }

</script>
