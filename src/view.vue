<style scoped lang="scss">

  #view {
    height: 100%;
    width: 100%;
  }

  .navbar {
    background-color: #212529;
    color: white;

    strong {
      float: left;
    }
  }

  .menu {
    list-style: none;
    margin: 0;

    li {
      margin: 0;
      padding: 10px;
      float: left;
    }
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999; // TODO: extrair em _z-index.scss
  }

  .notifications {
    position: fixed;
    top: 6px; // tamanho do loading (4px) + extra (2px)
    left: 8px;
    right: 8px;
    z-index: 999; // TODO: extrair em _z-index.scss
  }

  .card-container {
    padding: 50px;

    background-color: white;
    border-radius: 5px;
  }

</style>

<style lang="scss">
  html,
  body {
   background-color: $pale-grey-two;
  }
</style>

<template lang="pug">

  #view
    navbar(v-if="$auth.isAuthenticated()" :title.sync="currentNavbarTitle" :showBackButton="showBackButton")
    tabbar(v-if="$auth.isAuthenticated()" :count='tabs.length')
      tab-item(v-for="(tab, index) in tabs" :key="index" :route="tab.route" :icon="tab.icon" :text="tab.text" :active="tab.active" @clicked="updateActiveTab(index)")

    loading.loading
    notifications.notifications
    transition(:name="transition.name", :mode="transition.mode")
      router-view(@tabChanged="updateTabs" @navbarTitleChanged="navbarTitle")

</template>


<script>

  const DEFAULT_ROUTE_TRANSITION_NAME = 'none'
  const DEFAULT_ROUTE_TRANSITION_MODE = 'out-in'

  import Notification from './views/notifications/index.vue'

  export default {
    data() {
      return {
        transition: {
          name: DEFAULT_ROUTE_TRANSITION_NAME,
          mode: DEFAULT_ROUTE_TRANSITION_MODE,
        },
        tabs: [],
        showBackButton: false,
        currentNavbarTitle: null,
      }
    },

    methods: {
      updateActiveTab(index) {
        _.map(this.tabs, function(tab){ tab.active = false });
        this.tabs[index]['active'] = true
      },

      updateTabs(newTabs) {
        this.tabs = newTabs
      },

      navbarTitle(title) {
        this.currentNavbarTitle = title
      },

      saveToken(token) {
        if(_.isBlank(token)) return
        app.auth.setDeviceToken(token)
        this.$http.post('/supplier/device_tokens', { body: token })
          .catch((_err) => {
            console.error(_err)
          })
      },

      getToken() {
        let that = this
        window.FirebasePlugin.getToken(
          function(token) { that.saveToken(token) },
          function(error) { console.error(error) })
      },

      refreshToken() {
        let that = this
        window.FirebasePlugin.onTokenRefresh(
          function(token) { that.saveToken(token) },
          function(error) { console.error(error) })
      },

      checkNotificationPermission() {
        window.FirebasePlugin.hasPermission(function(data){
          if(!!data.isEnabled) {
            console.log('isEnabled')
          } else {
            window.FirebasePlugin.grantPermission()
          }
        })
      },

      listenNotification() {
        let that = this
        window.FirebasePlugin.onNotificationOpen(
          function(notification) {
            notification.args = notification.data
            // only call click if tapped otherwise do nothing
            if (notification.tap) that.clickedNotification(notification)
          },
          function(error) {
            console.error(error)
        })
      },

      onDeviceReady() {
        if(window.FirebasePlugin) {
          this.getToken()
          this.refreshToken()
          this.checkNotificationPermission()
          this.listenNotification()
        } else {
          console.log('FirebasePlugin off')
        }
      },

      clickedNotification(notification) {
        // TODO refactor
        let route = Notification.methods.parseNotificationPath(notification) || { name: 'notifications' }
        this.$router.push(route)
      },
    },

    watch: {
      $route(to, from) {
        // navbar title fallback
        // this.navbarTitle('SDC')

        this.showBackButton = _.dig(to, 'meta', 'back') || false

        // definindo transição entre rotas
        this.transition = {
          name: _.dig(to, 'meta', 'transition', 'name') || DEFAULT_ROUTE_TRANSITION_NAME,
          mode: _.dig(to, 'meta', 'transition', 'mode') || DEFAULT_ROUTE_TRANSITION_MODE
        }
      }
    },

    mounted: function () {
      document.addEventListener("deviceready", this.onDeviceReady, false)
    }
  }

</script>

