<!--
<doc lang="markdown">
    Container de notificações (alertas) para feedback visual ao usuário.
    Integra-se ao módulo `notifications.js`, respondendo aos eventos de
  notificação com feedback visual.
</doc>
-->

<style scoped lang="scss">
  //
  // TODO criar uma interface própria, simples e agradável
  // Por ora copiamos do Bootstrap 4 - componente Alert
  //

  // @file _variables.scss
  // ----

  // Alerts
  //
  // Define alert colors, border radius, and padding.

  // XXX definindo valores estáticos!
  $alert-padding-x:             1.25rem !default;
  $alert-padding-y:             .75rem !default;
  $alert-margin-bottom:         1rem !default;
  $alert-border-radius:         .25rem !default;
  $alert-link-font-weight:      bold !default;
  $alert-border-width:          1px !default;

  $alert-success-bg:            #dff0d8 !default;
  $alert-success-text:          #3c763d !default;
  $alert-success-border:        darken($alert-success-bg, 5%) !default;

  $alert-info-bg:               #d9edf7 !default;
  $alert-info-text:             #31708f !default;
  $alert-info-border:           darken($alert-info-bg, 7%) !default;

  $alert-warning-bg:            #fcf8e3 !default;
  $alert-warning-text:          #8a6d3b !default;
  $alert-warning-border:        darken($alert-warning-bg, 5%) !default;

  $alert-danger-bg:             #f2dede !default;
  $alert-danger-text:           #a94442 !default;
  $alert-danger-border:         darken($alert-danger-bg, 5%) !default;


  // @file mixins/_alert.scss
  // ----

  // Alerts
  @mixin alert-variant($background, $border, $body-color) {
    background-color: $background;
    border-color: $border;
    color: $body-color;

    hr {
      border-top-color: darken($border, 5%);
    }
    .alert-link {
      color: darken($body-color, 10%);
    }
  }



  // @file _alert.scss
  // ----

  //
  // Base styles
  //

  .alert {
    padding: $alert-padding-y $alert-padding-x;
    margin-bottom: $alert-margin-bottom;
    border: $alert-border-width solid transparent;
    // XXX definindo valor estático do mixin @border-radius
    border-radius: $alert-border-radius;
  }

  // Headings for larger alerts
  .alert-heading {
    // Specified to prevent conflicts of changing $headings-color
    color: inherit;
  }

  // Provide class for links that match alerts
  .alert-link {
    font-weight: $alert-link-font-weight;
  }


  // Dismissible alerts
  //
  // Expand the right padding and account for the close button's positioning.

  .alert-dismissible {
    // Adjust close link position
    .close {
      position: relative;
      top: -$alert-padding-y;
      right: -$alert-padding-x;
      padding: $alert-padding-y $alert-padding-x;
      color: inherit;
    }
  }


  // Alternate styles
  //
  // Generate contextual modifier classes for colorizing the alert.

  .alert-success {
    @include alert-variant($alert-success-bg, $alert-success-border, $alert-success-text);
  }
  .alert-info {
    @include alert-variant($alert-info-bg, $alert-info-border, $alert-info-text);
  }
  .alert-warning {
    @include alert-variant($alert-warning-bg, $alert-warning-border, $alert-warning-text);
  }
  .alert-danger {
    @include alert-variant($alert-danger-bg, $alert-danger-border, $alert-danger-text);
  }




  // @file _close.scss e suas dependências

  $close-font-size:             1rem * 1.5 !default;
  $close-font-weight:           bold !default;
  $close-color:                 #000 !default;
  $close-text-shadow:           0 1px 0 #fff !default;

  .close {
    float: right;
    font-size: $close-font-size;
    font-weight: $close-font-weight;
    line-height: 1;
    color: $close-color;
    text-shadow: $close-text-shadow;
    opacity: .5;

    &:focus,
    &:hover {
      color: $close-color;
      text-decoration: none;
      cursor: pointer;
      opacity: .75;
    }
  }

  // Additional properties for button version
  // iOS requires the button element instead of an anchor tag.
  // If you want the anchor version, it requires `href="#"`.
  // See https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile

  button.close {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }

</style>


<template lang="pug">
  transition-group(name="fade", tag="div", mode="out-in")
    .alert.alert-dismissible.alert-danger(
      v-for="{ message, key } in notifications.error",
      :key="key",
      role="alert"
    )
      button.close(type="button", :aria-label="$t('close')", @click="dismissError(message)") ×
      span.content {{ message }}

    .alert.alert-dismissible.alert-info(
      v-for="{ message, key } in notifications.info",
      :key="key",
      role="alert"
    )
      button.close(type="button", :aria-label="$t('close')", @click="dismissInfo(message)") ×
      span.content {{ message }}

    .alert.alert-dismissible.alert-warning(
      v-for="{ message, key } in notifications.warning",
      :key="key",
      role="alert"
    )
      button.close(type="button", :aria-label="$t('close')", @click="dismissWarning(message)") ×
      span.content {{ message }}
</template>


<script>
  const ERROR_DISMISS_TIMEOUT = 10000
  const WARNING_DISMISS_TIMEOUT = 8000
  const INFO_DISMISS_TIMEOUT = 5000


  function dismissTimeoutFor(level) {
    switch (level) {
      case 'error': {
        return ERROR_DISMISS_TIMEOUT
      }

      case 'warning': {
        return WARNING_DISMISS_TIMEOUT
      }

      case 'info':
      default: {
        return INFO_DISMISS_TIMEOUT
      }
    }
  }


  export default {
    data() {
      return {
        notifications: {
          error:   [],
          info:    [],
          warning: []
        }
      }
    },

    created() {
      app.$on('notifications:clear', this.clear)
      app.$on('notifications:info', this.appendInfo)
      app.$on('notifications:error', this.appendError)
      app.$on('notifications:warning', this.appendWarning)

      this.parseFlashData()
    },

    beforeDestroy() {
      app.$off('notifications:clear', this.clear)
      app.$off('notifications:info', this.appendInfo)
      app.$on('notifications:error', this.appendError)
      app.$off('notifications:warning', this.appendWarning)
    },

    methods: {
      append(level, message, dismiss = true) {
        let notifications = this.notifications[level]

        // Caso a notificação já exista, remova-a antes de adicionar uma "réplica"
        if (notifications.findIndex(notification => notification.message === message) !== -1) {
          this.$nextTick(() => { this.dismiss(level, message) })
        }

        // Para que seja "removível" corretamente, precisamos criar uma 'key'
        // baseada no tempo, para que o `v-for` use-a corretamente!
        let notification = {
          message,
          key:     `${message}-${Date.now()}`,
          timeout: null
        }

        if (dismiss) {
          notification.timeout = setTimeout(() => {
            this.dismiss(level, message)
          }, dismissTimeoutFor(level))
        }

        notifications.push(notification)
      },

      appendError(...args) {
        this.append('error', ...args)
      },

      appendInfo(...args) {
        this.append('info', ...args)
      },

      appendWarning(...args) {
        this.append('warning', ...args)
      },

      clear() {
        Object.keys(this.notifications).forEach((level) => { this.notifications[level] = [] })
      },

      dismiss(level, message) {
        let notifications = this.notifications[level]
        let idx = notifications.findIndex(notification => notification.message === message)

        if (idx !== -1) {
          let notification = notifications[idx]
          if (notification.timeout) clearTimeout(notification.timeout)

          notifications.splice(idx, 1)
        }
      },

      dismissError(...args) {
        this.dismiss('error', ...args)
      },

      dismissInfo(...args) {
        this.dismiss('info', ...args)
      },

      dismissWarning(...args) {
        this.dismiss('warning', ...args)
      },

      /**
       * Interface entre mensagens de notificação "navegacionais" do backend (Rails) via flash.
       * O conteúdo fica em um <meta>, ex:
       * ```html
       * <meta content="[['notice','test-notice'],['alert','test-alert']]" name="flash-data">
       * ````
       * @return {[type]} [description]
       */
      parseFlashData() {
        let data = app.dom.fetchMetaJSON('flash-data') || []

        data.forEach((entry) => {
          let flashLevel = entry[0]
          let flashMessage = entry[1]

          switch (flashLevel) {
            case 'error': {
              this.appendError(flashMessage)
              break
            }

            case 'alert': {
              this.appendWarning(flashMessage)
              break
            }

            case 'notice':
            default: {
              this.appendInfo(flashMessage)
              break
            }
          }
        })
      }
    }
  }
</script>
