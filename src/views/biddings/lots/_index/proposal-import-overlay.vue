<style scoped lang="scss">
</style>

<template lang="pug">
  .file-overlay-container
    overlay-wnd(v-if="showFileProposalOverlay", @close="close")
      .container
        h4.mt-2.text-center {{ $t('.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info(v-html="$t('.alert')")

        .text-center
          a.button.button-primary.router-link.mb-1(:href="globalDownloadPath")
           | {{ $t('.button.download') }}

          hr

          form.mb-0(ref="form", method="post", @submit.prevent="submitFile")
            input(type='hidden', name="proposal_import[status]")
            file-field.text-left(
              name="proposal_import[file]",
              v-model="file",
              :error="errors['file']"
            )

            div
              button.mb-0.mt-1.button-primary(
                type="submitFile",
                :disabled="submittingFile"
              )
                | {{ submitFileText }}

    overlay-notification(v-if="showSuccessOverlay", :showOverlay="showSuccessOverlay", :text="$t('.notifications.file.success')", @ok="redirecToShow", topClass='mt-5')

</template>

<script>
  export default {
    props: {
      lots: { type: Array },
      biddingId: { type: Number },
      showFileProposalOverlay: { type: Boolean, default: false }
    },

    computed: {
      globalDownloadPath() {
        if(!this.lots && !this.lots[0]) return
        return app.secrets.api.host + this.lots[0].bidding_proposal_import_file_url
      },

      submitFileText() {
        if (this.submittingFile) return this.$t('.button.submittingFile')
        return this.$t('.button.submitFile')
      },
    },

    data() {
      return {
        i18nScope: 'biddings.lotsg._index.proposal-import-overlay',
        showSuccessOverlay: false,
        submittingFile: false,
        file: null,
        errors: {},
      }
    },

    methods: {
      close() {
        this.$emit('closeOverlay')
      },

      redirecToShow() {
        this.$router.replace({ name: 'bidding', params: { id: this.biddingId } })
      },

      submitFile() {
        const formData = new FormData(this.$refs.form)

        this.submittingFile = true
        this.$notifications.clear()

        this.$http.post('/supplier/biddings/' + this.biddingId + '/proposal_imports', formData)
          .then((response) => {
            this.errors = {}

            this.$emit('closeOverlay')
            this.showSuccessOverlay = true

          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.file.failure'))
            this.errors = this.$i18n.errify(errors, { model: 'lotProposalImport' })
          })
          .then(() => {
            this.submittingFile = false
          })
      },

    }
  }
</script>
