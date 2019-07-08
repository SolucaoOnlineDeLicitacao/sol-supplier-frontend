<style scoped lang="scss">
  .attachment-name {
    max-width: 90%;
    word-break: break-all;
  }

</style>

<template lang="pug">
  .card.mt-2.slim.mb-2(v-if="lot && lot.attachments.length > 0")
    .container
      h5.mt-1.mb-1 Arquivos do lote

    hr.mt-0.mb-2

    .container
      ul.mb-0
        li.row(v-for="attachment in lot.attachments")
          a.input-file.mb-1(:href="attachmentPath(attachment)", target="_blank")
            i.fa.fa-download.mr-1.u-pull-left
            span.attachment-name.u-pull-left {{ attachment.filename }}

</template>

<script>
  export default {
    props: {
      lot: { type: Object },
    },

    data() {
      return {
        i18nScope: 'biddings.lots._show.attachment-list-fields',
      }
    },

    methods: {
      attachmentPath(attachment) {
        if(typeof attachment === 'undefined') return
        return app.secrets.api.host + attachment.url
      }
    }
  }
</script>

