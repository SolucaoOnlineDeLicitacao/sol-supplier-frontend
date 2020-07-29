<style scoped lang="scss">
  .list-item {
    min-height: 100px;

    background-color: #f7f7f7;
    cursor: pointer;
    font-size: 13px;

    &.read {
      background-color: transparent;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .list-title {
      font-size: 15px;
    }

    .list-text {
      width: 85%;
      float: right;
      padding-right: 10px;

      text-decoration: none;
      color: $greyish-brown-two;
    }

    .list-icon {
      width: 15%;
      float: left;
      text-align: center;
      color: $dark-sky-blue;

      .far {
        margin-top: 10px;
      }
    }
  }

.blink-50 {
  .list-item {
    line-height: 120px;
  }
}

</style>

<template lang="pug">
  div
    ul.mb-0(v-if="notifications")
      li.list-item.pb-1.pt-1.mb-0.row(v-for="(notification) in notifications", :class="{ read: notification.read_at }")
        .list-icon
          i.far.fa-2x.fa-envelope(:class="{ 'fa-envelope-open': notification.read_at }")
        .list-text(@click="clickedNotification(notification)")
          .list-title {{ notification.title }}
          .mb-1(v-html="notification.body")
          i.small {{ $i18n.fromNow(notification.created_at) }}

    .blink-50.mt-2(v-else)
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

    .row.mt-1
      .twelve.columns
        paginator(
          v-model="page",
          :prev="prevPageLink",
          :next="nextPageLink",
          v-if="notificationsCount"
        )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'notifications',
    data () {
      return {
        i18nScope: 'notifications.index',

        // resource
        notifications: null,
        notificationsCount: null,
        params: {},
        tabs: [],

        showOverlay: false,
        overlayNotification: {},

        // pagination
        page:          1,
        firstPageLink: '',
        prevPageLink:  '',
        nextPageLink:  '',
        lastPageLink:  '',
        totalPages:    1,
      }
    },

    computed: {
      fetchParams() {
        return this.params
      },
    },

    methods: {
      parseNotificationPath(notification) {
        let action = notification.action

        if((/^(invite)/i).test(action)) return this.biddingsInviteRoute(notification)
        if((/^(bidding)/i).test(action)) return this.biddingRoute(notification)

        if((/^(proposal\.supplier_accepted)/i).test(action)) return this.biddingLotsRoute(notification)
        if((/^(proposal_import\.)/i).test(action)) return this.biddingRouteFromArgs(notification)

        if((/^(proposal\.lot)/i).test(action)) return this.lotProposalRoute(notification)
        if((/^(proposal)/i).test(action)) return this.globalProposalRoute(notification)
        if((/^(contract\.)/i).test(action)) return this.contractRoute(notification)
      },

      contractRoute(notification) {
        return { name: 'contract', params: { id: notification.notifiable_id } }
      },

      biddingsInviteRoute(notification) {
        let args = notification.args
        return { name: 'bidding', params: { id: args.bidding_id } }
      },

      biddingLotsRoute(notification) {
        let args = notification.args

        return { name: 'lots', params: { bidding_id: args.bidding_id } }
      },

      biddingRoute(notification) {
        return { name: 'bidding', params: { id: notification.notifiable_id } }
      },

      biddingRouteFromArgs(notification) {
        let args = notification.args

        return { name: 'bidding', params: { id: args.bidding_id } }
      },

      lotProposalRoute(notification) {
        let args = notification.args

        return { name: 'proposals', params: { bidding_id: args.bidding_id, lot_id: args.lot_id } }
      },

      globalProposalRoute(notification) {
        let args = notification.args

        return { name: 'globalProposals', params: { bidding_id: args.bidding_id } }
      },

      clickedNotification(notification) {
        let route = this.parseNotificationPath(notification)

        this.$http.patch('/supplier/notifications/' + notification.id + '/mark_as_read')
          .then((response) => { console.log('read') })

        if (route) this.$router.push(route)
      },

      fetch() {
        let params = this.params

        return this.$http.get('/supplier/notifications', { params })
          .then((response) => {
            this.notifications = response.data
            this.notificationsCount = this.notifications.length

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

        this.firstPageLink = _.dig(links, 'first', 'page')
        this.prevPageLink = _.dig(links, 'prev', 'page')
        this.nextPageLink = _.dig(links, 'next', 'page')
        this.lastPageLink = _.dig(links, 'last', 'page')
      },

      fetchSearch() {
        this.params = { search: this.search }

        this.updateRoute()
      },

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.replace({ name: 'notifications', query: data });
      },

      sort(aSort) {
        if(aSort === this.sortParam) {
          this.orderParam = this.orderParam==='asc' ? 'desc' : 'asc';
        }

        this.sortParam = aSort;

        let sortParams = { sort_column: this.sortParam, sort_direction: this.orderParam }

        this.params = Object.assign({}, this.params, sortParams);

        this.updateRoute()
      },

      init() {
        this.params = this.$route.query
      }
    },

    created: function () {
      this.$emit('tabChanged', this.tabs)
      this.$emit('navbarTitleChanged', this.$t('navbar.notifications'))

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
