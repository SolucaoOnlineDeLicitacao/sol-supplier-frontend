<style scoped lang="scss">

  .navbar {
    width: 100%;
    height: 56px;
    background: linear-gradient(rgb(84, 124, 137), rgb(59, 91, 111));
  }

  .navbar-menu {
    height: 100%;
    position: absolute;
    top: 0;
    left: -90%;
    z-index: 10001;
    width: 0;
    overflow: hidden;
    width: 90%;

    color: $charcoal-grey;
    background-color: white;
    transition: 0.2s ease;

    &.open {
      left: 0;
      transition: 0.2s ease;
    }

    ul {
      list-style: none;
      list-style-type: none;
      padding-left: 0;
    }

    a {
      color: $charcoal-grey;
      text-decoration: none;
      cursor: pointer;
    }
  }

  .navbar-header {
    position: relative;
    text-align: center;
    color: white;

    .logo {
      width: 78%;
      margin-left: 11%;
      overflow: hidden;
      max-height: 56px;

      line-height: 56px;
      font-size: 20px;
    }

    .navbar-menu-pills {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 56px;
      height: calc(56px - 20px);
      width: calc(56px - 20px);

      font-size: 30px;
    }

    .navbar-menu-back {
      position: absolute;
      cursor: pointer;
      float: left;

      font-size: 30px;
      line-height: 56px;
      margin-left: 15px;
    }
  }

  .navbar-user {
    padding-bottom: 30px;
    border-bottom: solid 1px $white-three;

    > img {
      height: 56px;
      max-width: 56px;
      border-radius: 28px;
      float: left;
    }

    .navbar-info {
      width: calc(100% - 72px);
      float: right;
    }

    .navbar-user-title {
      font-size: 16px;
      font-weight: bold;
      color: $greyish-brown-two;
    }

    .navbar-user-subtitle {
      opacity: 0.5;
      font-size: 12px;
      font-weight: 500;
      color: $greyish-brown-two;
    }
  }

  li {
    cursor: pointer;
    position: relative;

    a {
      display: block;
      padding: 0 5px;
    }

    .fa {
      margin-right: 10px;
    }
  }

  .logout-container {
    position: absolute;
    left: 0;
    bottom: 20px;

    cursor: pointer;

    .fa {
      margin-right: 10px;
    }

    a {
      display: block;
    }
  }

  .notification-badge {
    position: absolute;
    top: 3px;
    right: -3px;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;
    background-color: red;
    border-radius: 18px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
  }
</style>

<template lang="pug">
  .navbar
    .navbar-header
      .navbar-menu-back(v-if="showingBackButton")
        i.fa.fa-chevron-left(@click="$router.go(-1)")
      .logo
        | {{ navbarTitle }}
      .navbar-menu-pills(@click="toggleNavbar" v-if="showNavbarMenu")
        i.fa.fa-bars
        .notification-badge(v-if="unreadsCount") {{ unreadsCount }}


    .navbar-menu(:class="navbarStatus" @click="toggleNavbar" v-if="showNavbarMenu")
      .container
        .navbar-user.mt-3.u-cf.u-full-width
          img(:src="avatarUrl()" class="navbar-user-image")
          .navbar-info
            .navbar-user-title
              | {{ userTitle }}
            .navbar-user-subtitle
              | {{ userSubTitle }}

        ul.u-cf.mt-2.u-full-width
          li
            router-link.router-link(:to="{ name: 'home' }")
              i.fa.fa-home
              | {{ this.$t('.home') }}

          li
            router-link.router-link(:to="{ name: 'biddings' }")
              i.fa.fa-list-ul
              | {{ this.$t('.biddings') }}

          li
            router-link.router-link(:to="{ name: 'contracts' }")
              i.fa.fa-file-invoice-dollar
              | {{ this.$t('.contracts') }}

          li
            router-link.router-link(:to="{ name: 'map' }")
              i.fa.fa-map-marked-alt
              | {{ this.$t('.map') }}

          li
            hr.mt-0.mb-0

          li
            router-link.router-link(:to="{ name: 'editProfile' }")
              i.fa.fa-user
              | {{ this.$t('.profile') }}

          li
            router-link.router-link(:to="{ name: 'notifications' }")
              i.fa.fa-bell
              | {{ this.$t('.notifications') }}
              .notification-badge(v-if="unreadsCount") {{ unreadsCount }}


      .container.logout-container
        div.router-link(type="button", data-action="logout", @click="logout")
          i.fa.fa-sign-out-alt
          | {{ btnLogoutLabel() }}
</template>

<script>
  export default {
    props: {
      title: { type: String, default: '' },
      showBackButton: { type: Boolean, default: false },
      showNavbarMenu: { type: Boolean, default: true },
    },

    data () {
      return {
        i18nScope: 'navbar',
        unreadsCount: 0,
        interval: null,
        loggingOut: false,
        navbarOpen: false
      }
    },

    computed: {
      navbarTitle() {
        return this.title;
      },

      showingBackButton() {
        return !!this.showBackButton
      },

      navbarStatus() {
        return this.navbarOpen ? 'open' : ''
      },

      userTitle() {
        return app.auth.user.name;
      },

      userSubTitle() {
        return app.auth.user.username;
      }
    },

    methods: {
      btnLogoutLabel() {
        return this.loggingOut ? this.$t('.button.logout.labelOngoing') : this.$t('.button.logout.label')
      },

      avatarUrl() {
        return app.secrets.api.host + this.$auth.avatar.url
      },

      toggleNavbar() {
        this.navbarOpen = !this.navbarOpen
      },

      logout() {
        this.loggingOut = true

        let params = { token: app.auth.token }

        return this.$http.post('/oauth/revoke', params)
          .then((response) => {
            this.$notifications.clear()
            app.auth.logout()
            this.firebaseUnregister()
            this.$router.push({ name: 'login' })
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.logout.failure'))
            let code = _.dig(err, 'response', 'error', 'code')
          })
          .then(() => {
            this.loggingOut = false
          })
      },

      firebaseUnregister() {
        if (window.FirebasePlugin) window.FirebasePlugin.unregister()
      },

      fetchUnreadsCount() {
        if(!this.showNavbarMenu) return

        return this.$http.get('/supplier/notifications/unreads_count')
          .then((response) => {
            this.unreadsCount = response.data.count

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      }
    },

    created: function () {
      this.fetchUnreadsCount();

      this.interval = setInterval(function () {
        this.fetchUnreadsCount();
      }.bind(this), 10000);
    },

    beforeDestroy: function(){
      clearInterval(this.interval);
    },

    watch:{
      $route (to, from){
        this.fetchUnreadsCount();
      }
    }
  }

</script>

