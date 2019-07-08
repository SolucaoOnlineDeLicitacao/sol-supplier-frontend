<style scoped lang="scss">
  .badge {
    &.draft,
    &.closed,
    &.waiting {
      background-color: $greyish-brown;
    }

    &.ongoing {
      background-color: $cerulean;
    }

    &.canceled,
    &.failure {
      background-color: $danger-color;
    }

    &.suspended,
    &.under_review {
      background-color: $peach;
    }

    &.approved,
    &.finnished,
    &.accepted {
      background-color: $apple-green;
    }
  }
</style>

<template lang="pug">
  .resource-container(v-if="bidding")
    .card
      .row
        label {{ $t('models.bidding.attributes.cooperative') }}
        span {{ cooperative.name }}

      .row
        label {{ $t('models.cooperative.attributes.cnpj') }}
        span {{ cooperative.cnpj }}

      .row
        label {{ $t('models.address.attributes.cityName') }}
        span {{ address.city.name }} / {{ address.city.state_name }}

      .row
        label {{ $t('models.address.attributes.address') }}
        span {{ address.address }}, {{ address.neighborhood }}, {{ address.reference_point }} - {{ address.cep }}

    .card.mt-2
      .row
        label {{ $t('models.bidding.attributes.title') }}
        span {{ bidding.title }}

      .row
        label {{ $t('models.bidding.attributes.description') }}
        span {{ bidding.description }}

      .row
        label {{ $t('models.bidding.attributes.kind') }}
        span
          | {{ $t('models.bidding.attributes.kinds.' + bidding.kind) }}

      .row
        label {{ $t('models.bidding.attributes.modality') }}
        span
          | {{ $t('models.bidding.attributes.modalities.' + bidding.modality) }}

    .card.mt-2
      .row
        label {{ $t('models.bidding.attributes.status') }}
        span.badge(:class="bidding.status")
          | {{ $t('models.bidding.attributes.statuses.' + bidding.status) }}


    .card.mt-2
      .row
        label {{ $t('models.bidding.attributes.startDate') }}
        span
          | {{ $l('date.formats.default', bidding.start_date) }}

      .row
        label {{ $t('models.bidding.attributes.closingDate') }}
        span
          | {{ $l('date.formats.default', bidding.closing_date) }}

      .row
        label {{ $t('models.bidding.attributes.deadline') }}
        span {{ bidding.deadline }}

      .row
        label {{ $t('models.bidding.attributes.address') }}
        span {{ bidding.address || $t('messages.not_informed') }}

    .card.mt-2
      .row
        label {{ $t('models.bidding.attributes.link') }}
        span
          a(:href="bidding.link" v-if="bidding.link")
            | {{ bidding.link }}
          span(v-else)
            | {{ $t('messages.not_informed') }}

      .row
        label {{ $t('.documents.title') }}

        template(v-if="bidding.minute_pdf")
          a.button.u-full-width(:href="biddingAtaPath", target="_blank")
            | {{ $t('.minute.download') }}
        template(v-else)
          div {{ $t('.minute.not_found') }}

        template(v-if="bidding.edict_pdf")
          a.button.u-full-width(:href="biddingEdictPath", target="_blank")
            | {{ $t('.edict.download') }}
        template(v-else)
          div {{ $t('.edict.not_found') }}

</template>


<script>
  import view from '@/view.vue'

  export default {
    name: 'bidding',
    data () {
      return {
        i18nScope: 'biddings.show',
        bidding: null,
        cooperative: null,
        address: null,
        params: null,

        tabs: [
          {
            route: { name: 'bidding', params: {} },
            icon: 'fa-file',
            text: 'Licitação',
            active: true,
          },

          {
            route: { name: 'lots', params: {} },
            icon: 'fa-list',
            text: 'Lotes e itens',
            active: false,
          }
        ]
      }
    },

    computed: {
      biddingAtaPath() {
        return this.bidding && this.$http.host + "/" + this.bidding.minute_pdf
      },

      biddingEdictPath() {
        return this.bidding && this.$http.host + "/" + this.bidding.edict_pdf
      },

    },

    methods: {
      getBidding() {
        return this.$http.get('/supplier/biddings/' + this.params.id)
          .then((response) => {
            this.bidding = response.data
            this.cooperative = response.data.cooperative
            this.address = this.cooperative.address

            this.changeTabs()
            this.$emit('navbarTitleChanged', this.bidding.title)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      },

      changeTabs() {
        // add resource id to router tab
        this.tabs[1].route.params = { bidding_id: this.params.id }

        // update default lot route if global bidding
        if(this.bidding.kind == 'global') {
          this.tabs[1].route.name = 'lotsg'
        }

        this.$emit('tabChanged', this.tabs)
      }


    },

    created: function () {
      this.parseRoute()
      this.getBidding()
    }
  }

</script>
