<style scoped lang="scss">

  ul {
    list-style-type: none;
    list-style: none;
  }

  .list-item {
    min-height: 45px;
    font-size: 15px;
    margin-bottom: 15px;

    line-height: 45px;
    letter-spacing: 0.2px;
    color: $greyish-brown-two;

    border-bottom: solid 1px $white-four;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
    }

    .list-title {
      font-weight: 700;
      color: $greyish-brown-two;
    }
  }

  .loading-2 {
    opacity: 0.8;
  }

  .loading-3 {
    opacity: 0.6;
  }

  .loading-4 {
    opacity: 0.4;
  }

  .blink-50 {
    text-align: center;
  }

  .search-field {
    position: relative;

    > .fa {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 12px;
    }
  }

  .errors {
    .error,
    label {
      color: red;
    }

    .error {
      font-size: 12px;
    }
  }

  .input-button {
    padding: 0 20px;
  }

</style>

<template lang="pug">
  .addresses-fields
    input(type="hidden", :name="prefix + '[address_attributes][id]'", :value="address.id" v-if="address")

    .row
      .eight.columns
        input-field(
          type="text",
          v-model="address.address",
          model="address",
          :name="prefix + '[address_attributes][address]'",
          require=true,
          :error="errors[errorPrefix + 'address.address']"
        )

      .two.columns
        input-field(
          type="text",
          model="address",
          v-model="address.number",
          :name="prefix + '[address_attributes][number]'",
          require=true,
          :error="errors[errorPrefix + 'address.number']"
        )

      .two.columns
        input-field(
          type="text",
          model="address",
          v-model="address.cep",
          :name="prefix + '[address_attributes][cep]'",
          require=true,
          :error="errors[errorPrefix + 'address.cep']",
          mask="00000-000"
        )
    .row
      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.neighborhood",
          :name="prefix + '[address_attributes][neighborhood]'",
          require=true,
          :error="errors[errorPrefix + 'address.neighborhood']"
        )

      .three.columns.input-field(:class="this.errors && this.errors[this.errorPrefix + 'address.city'] && this.address.city_id == null ? 'errors': ''")
        label Município*
        div.error.mb-1(v-if="this.errors && this.errors[this.errorPrefix + 'address.city'] && this.address.city_id == null")
          | {{ errors[errorPrefix + 'address.city'] }}

        span.button.u-full-width.input-button(@click="toggleOverlay")
          i.fa.fa-search.mr-1
          template(v-if="this.address.city_name")
            | {{ this.address.city_name }}
          template(v-else)
            | Selecionar município

        input(type="hidden", :name="prefix + '[address_attributes][city_id]'", model="address", v-model="address.city_id")


      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.latitude",
          :name="prefix + '[address_attributes][latitude]'",
          require=false,
          :error="errors[errorPrefix + 'address.latitude']",
          placeholder="00.00000000",
          :mask="{ mask: 'M00.00000000' }"
        )

      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.longitude",
          :name="prefix + '[address_attributes][longitude]'",
          require=false,
          :error="errors[errorPrefix + 'address.longitude']",
          placeholder="00.00000000",
          :mask="{ mask: 'M00.00000000' }"
        )

    .row
      .six.columns
        input-field(
          type="text",
          model="address",
          v-model="address.complement",
          :name="prefix + '[address_attributes][complement]'",
          :error="errors[errorPrefix + 'address.complement']"
        )

      .six.columns
        input-field(
          type="text",
          model="address",
          v-model="address.reference_point",
          :name="prefix + '[address_attributes][reference_point]'",
          require=true,
          :error="errors[errorPrefix + 'address.reference_point']"
        )

    overlay-wnd(v-if="showOverlay", @close="showOverlay = false")
      .container
        h4.mt-2.text-center Buscar município
        hr.mt-0.mb-2.o-container
        form.filter(ref="formSearch", method="get" action="" @submit.prevent="fetchSearch")
          .search-field
            input-field(
              type="text",
              v-model="search",
              name="search",
              :placeholder="$t('.search.placeholder')",
              :hideLabel='true'
            )
            i.fa.fa-search(@click="fetchSearch")

        ul(v-if="searchCount > 0")
          li.list-item.mb-1.row(v-for="(result) in results" @click="addResult(result)")
            | {{ result.text }}

        ul.blink-50(v-else-if="isLoadingOverlay")
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


        ul(v-else-if="searchCount == 0")
          li.mb-1
            .container
              | {{ $t('.item.empty') }}
</template>

<script>
  export default {
    props: {
      address: { Object, default: () => [] },
      errors: Object,
      errorPrefix: { String, default: '' },
      prefix: String
    },

    data() {
      return {
        i18nScope: 'address.address-fields',
        showOverlay: false,
        search: '',
        searchCount: 0,
        results: null,
        loaded: false
      }
    },

    methods: {
      toggleOverlay() {
        this.showOverlay = true

        this.search = ''

        this.fetchResults()
      },

      fetchSearch() {
        this.fetchResults({ search: { term: this.search } })
      },

      fetchResults(oParams) {
        this.isLoadingOverlay = true

        this.results = null
        this.searchCount = 0

        let params = oParams

        this.$http.get('/search/cities', { params: params })
          .then((response) => {
            this.results = response.data
            this.searchCount = this.results.length

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
          .then(() => {
            this.isLoadingOverlay = false
          })
      },

      addResult(result) {
        this.address.city_id = result.id
        this.address.city_name = result.text
        this.showOverlay = false
      }
    }
  }
</script>

