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

  .tool {
    min-height: 100vh;
    background-color: $white;
  }

  .password-container {
    padding: 0 30px;
  }

</style>

<template lang="pug">
  .tool.password
    .content.text-center.logo-container

      img(src="@/assets/images/logo.png" class="logo")
      div {{ $t('.heading') }}

    .container
      .content.password-container
        form.password(ref="form", method="post", @submit.prevent="submit", class="mb-0")
          input(type="hidden", name="supplier[reset_password_token]", v-model="token")

          .row
            .twelve.columns
              input-field(
                :autofocus="true",
                type="password",
                v-model="supplier.password",
                name="supplier[password]",
                :label="$t('.fields.password.label')",
                :placeholder="$t('.fields.password.placeholder')",
                :error="errors.password"
              )

          .row
            .twelve.columns
              input-field(
                type="password",
                v-model="supplier.password_confirmation",
                name="supplier[password_confirmation]",
                :label="$t('.fields.password_confirmation.label')",
                :placeholder="$t('.fields.password_confirmation.placeholder')",
                :error="errors.password_confirmation"
              )

          .row
            .twelve.columns
              button.button.button-primary.u-full-width.mb-0(
                type="submit",
                :disabled="submitting"
              )
                | {{ submitText }}

    overlay-notification(v-if="showSuccessOverlay", :showOverlay="showSuccessOverlay", :text='$t(".notifications.password.success")', topClass="mt-3", @ok="redirectToLogin")



</template>

<script>
  export default {
    data() {
      return {
        // i18n
        i18nScope: 'password.edit',

        submitting: false,
        showSuccessOverlay: false,
        supplier: {},
        token: null,
        errors: {},
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

    },

    methods: {
      redirectToLogin() {
        this.$router.replace({ name: 'login' })
      },

      submit() {
        const formData = new FormData(this.$refs.form)

        this.submitting = true

        this.$http.patch('/supplier/password', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}
            this.showSuccessOverlay = true

          }).catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'supplier' })

            this.$notifications.error(this.$t('.notifications.password.failure'))
          })
          .then(() => {
            this.submitting = false
          })
      },

      parseRoute() {
        this.token = this.$route.query.reset_password_token
      },
    },

    created: function () {
      this.parseRoute()
    }
  }
</script>
