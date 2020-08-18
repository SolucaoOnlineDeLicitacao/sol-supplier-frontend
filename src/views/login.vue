<style scoped lang="scss">
  .content {
    padding: 12px;
    color: $metallic-blue;
  }

  .logo-container {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .logo {
    max-height: 100px;
    margin-top: 50px;
  }

  input {
    border: solid 1px $dark-grey-blue !important;
  }

  .button {
    &.button-primary {
      background-color: $dark-grey-blue !important;
    }
  }

  .bottom-button {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 15px;
    line-height: 20px;
    text-decoration: none;
    background-color: $light-blue-grey-two;
    color: $ugly-blue;
  }

  .tool {
    min-height: 100vh;
    background-color: $white;
  }

  .login-container {
    padding: 0 30px;
  }

  .terms-container {
    text-align: center;
    line-height: 18px;
  }

</style>

<template lang="pug">
  .tool.login
    .content.text-center.logo-container

      img(src="@/assets/images/logo.png" class="logo")
      div {{ $t('.heading') }}

    .container
      .content.login-container
        form.login(ref="form", method="post", @submit.prevent="submit", class="mb-0")
          input(type="hidden", name="grant_type", value="password")

          .row
            .twelve.columns
              input-field(
                :autofocus="true",
                type="email",
                v-model="username",
                name="username",
                :label="$t('.fields.username.label')",
                :placeholder="$t('.fields.username.placeholder')",
                iconClass="fa fa-user-circle",
                :hideIcon="false"
              )

          .row
            .twelve.columns
              input-field(
                type="password",
                v-model="password",
                name="password",
                :label="$t('.fields.password.label')",
                :placeholder="$t('.fields.password.placeholder')",
                iconClass="fa fa-lock",
                :hideIcon="false"
              )

          .row
            .twelve.columns
              button.button.button-primary.u-full-width.mb-0(
                type="submit",
                :disabled="submitting"
              )
                | {{ submitText }}

        .button.mt-1.u-full-width(@click="passwordOverlay = true")
          | {{ $t('.button.forgot_password') }}

        
        .terms-container
          router-link.router-link(:to="{ name: 'terms' }")
            i {{ $t('.terms_instructions') }}

    router-link.text-center.router-link.bottom-button.u-full-width(:to="{ name: 'newProvider' }")
      | {{ $t('.button.new') }}
      i.fa.fa-chevron-right.ml-1

    overlay-wnd(v-if="passwordOverlay", @close="passwordOverlay = false")
      .container
        h4.mt-2.text-center {{ $t('.button.forgot_password') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.forgot_password_instructions') }}

        form.mb-0(ref="formPassword", method="post", @submit.prevent="submitForgotPassword")

          input-field(
            type="text",
            v-model="email",
            name="supplier[email]",
            :label="$t('.fields.username.label')",
            :error="errors.supplier"
          )

          .text-center
            button.button.button-primary.mt-3
              | {{ submitPasswordText }}

    overlay-notification(v-if="showSuccessOverlay", :showOverlay="showSuccessOverlay", :text='$t(".notifications.password.success")', topClass="mt-3")

</template>

<script>
  export default {
    props: {
      redirect: { type: String } // default para rota "home"
    },

    data() {
      return {
        // i18n
        i18nScope: 'login',

        submitting: false,
        submittingForgotPassword: false,
        passwordOverlay: false,
        showSuccessOverlay: false,
        email: null,
        errors: {},

        // form
        username: null,
        password: null
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      submitPasswordText() {
        if (this.submittingForgotPassword) return this.$t('.button.submittingForgotPassword')
        return this.$t('.button.submitForgotPassword')
      }
    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        // this.$http.post('/login', formData)
        this.$http.post('/oauth/token', formData)
          .then((response) => {
            // sample:
            // {
            //   "access_token":"d7aa18c41da868b443ceb0333e83d264fb410fd75f0c4ad1c67bd39d35ea5447",
            //   "token_type":"bearer",
            //   "scope":"user",
            //   "created_at":1532281807
            // }

            // apaga possíveis notificações de erro anteriores
            this.$notifications.clear()

            // atualiza token csrf
            // app.csrf.token = response.headers[app.csrf.HEADER.toLowerCase()]

            // autentica o usuário no client
            app.auth.login({ user: response.data.user, token: response.data.access_token })

            app.i18n.locale = response.data.user.locale

            this.saveDeviceToken()

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'home' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {
            let errorKey = _.dig(err, 'response', 'data', 'error')
            let notificationKey = errorKey == 'blocked' ? 'blocked' : 'failure'

            this.$notifications.error(this.$t('.notifications.login.' + notificationKey))
          })
          .then(() => {
            // finally
            this.submitting = false
          })
      },

      submitForgotPassword() {
        const formData = new FormData(this.$refs.formPassword)
        this.submittingForgotPassword = true

        this.$http.post('/supplier/password', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}
            this.passwordOverlay = false
            this.showSuccessOverlay = true

          }).catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'supplier' })

            this.$notifications.error(this.$t('.notifications.password.failure'))
          })
          .then(() => {
            this.submittingForgotPassword = false
          })
      },

      saveDeviceToken() {
        let token = app.auth.deviceToken
        if(_.isBlank(token)) return
        this.$http.post('/supplier/device_tokens', { body: token })
          .catch((_err) => {
            console.error(_err)
          })
      }
    }
  }
</script>
