<style scoped lang="scss">
  $avatar: 40px;

  ul {
    a {
      text-decoration: none;
      color: $greyish-brown-two;
    }
  }

  label {
    margin-right: 5px;
    font-size: 13px;
    font-weight: 300;
  }

  .blink-50 {
    color: $dark-grey-blue;

    .container {
      line-height: 109px;
      min-height: 109px;
    }
  }

  .badge {
    padding: 2px 10px;
    border-radius: 20px;

    color: $white;
    font-size: 12px;
    background-color: $cerulean;

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

  .card {
    border: 0;
    box-shadow: 0 2px 3px 1px rgb(193, 218, 239);
    color: $dark-grey-blue;

    h5 {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .card-description {
    font-size: 14px;
  }

  .root {
    height: calc(100vh - 56px);

    background-color: $background-color;
  }

  .user-card {
    padding: 10px;
    margin-top: -30px;
    border: none;

    > img {
      height: $avatar;
      max-width: $avatar;
      border-radius: 100%;
      float: left;
    }

    .user-info {
      padding-left: 10px;
      width: calc(100% - #{$avatar});
      float: right;

      color: $greyish-brown-two;
      font-size: 16px;

      line-height: 11px;

      span {
        font-size: 11px;
        color: $brownish-grey;
      }
    }
  }

  h6 {
    font-weight: 400;
    color: $dark-grey-blue;
  }
</style>

<template lang="pug">
  .root.u-cf.u-full-width
    .container.mt-4
      .card.user-card.u-cf.u-full-width
        img(:src="avatarUrl()" class="navbar-user-image")
        .user-info
          h5.mt-0.mb-0 {{ userTitle }}
          span {{ userSubTitle }}

      router-link.router-link.button.button-primary.mt-2.u-full-width(:to="{ name: 'biddings' }")
        | {{ this.$t('.biddings.button') }}

      .biddings-container.mt-2
        h6.mb-1 {{ $t('.last_biddings', { count: this.biddings.length }) }}

        ul(v-if="biddingsCount > 0")
          li.list-item(v-for="(bidding) in biddings")
            router-link(:to="{ name: 'bidding', params: { id: bidding.id } }")
              .card
                h5.mb-0.bidding-title
                  | {{ $t('.bidding_title', { title: bidding.title }) }}

                .card-description.mb-1
                  | {{ bidding.description }}

                div
                  label.inline-block
                    | {{ $t('models.bidding.attributes.status') }}:
                  span.badge(:class="bidding.status")
                    | {{ $t('models.bidding.attributes.statuses.' + bidding.status) }}

                div
                  label.inline-block
                    | {{ $t('.period') }}:
                  | {{ $l('date.formats.default', bidding.start_date) }} - {{ $l('date.formats.default', bidding.closing_date) }}

        .text-center(v-else-if="biddingsCount == 0")
          | {{ $t('.biddings.empty') }}

        .blink-50.text-center(v-else)
          ul
            li.card.mb-1
              .container
                i.fas.fa-spinner.fa-pulse.fa-2x
            li.card.mb-1.loading-2
              .container
                i.fas.fa-spinner.fa-pulse.fa-2x

            li.card.mb-1.loading-3
              .container
                i.fas.fa-spinner.fa-pulse.fa-2x

            li.card.mb-1.loading-4
              .container
                i.fas.fa-spinner.fa-pulse.fa-2x


</template>

<script>

  export default {
    name: 'home',
    data () {
      return {
        i18nScope: 'home',
        biddings: [],
        biddingsCount: null,
        tabs: []
      }
    },

    computed: {
      userTitle() {
        return app.auth.user.name;
      },

      userSubTitle() {
        return app.auth.user.username;
      }
    },

    methods: {
      avatarUrl() {
        return app.secrets.api.host + this.$auth.avatar.url
      },

      fetchDashboard() {
        return this.$http.get('/supplier/dashboard')
          .then((response) => {
            this.biddings = response.data.last_biddings || []
            this.biddingsCount = this.biddings.length

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      }
    },

    created: function () {
      this.$emit('tabChanged', this.tabs)
      this.$emit('navbarTitleChanged', this.$t('title'))

      this.fetchDashboard()
    }
  }
</script>
