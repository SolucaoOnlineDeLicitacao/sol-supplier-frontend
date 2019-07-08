<style scoped lang="scss">
  .badge {
    &.waiting_signature {
      background-color: $greyish-brown;
    }

    &.signed {
      background-color: $cerulean;
    }

    &.refused {
      background-color: $danger-color;
    }

    &.partial_execution,
    &.total_inexecution {
      background-color: $peach;
    }

    &.completed {
      background-color: $apple-green;
    }
  }

</style>

<template lang="pug">
  .resource-container(v-if="contract")
    .card
      h5 {{ $t('.general.title') }}

      .row
        label {{ $t('models.contract.one') }}
        span {{ contract.title }}

      .row
        label {{ $t('models.contract.attributes.bidding_title') }}
        router-link.router-link(:to="{ name: 'bidding', params: { id: this.contract.bidding_id } }")
          | {{ contract.bidding_title }}

      .row
        label {{ $t('models.contract.attributes.cooperative_title') }}
        span {{ contract.cooperative_title }}

      .row
        label {{ $t('models.contract.attributes.price_total') }}
        span
          | {{ parseFloat(contract.price_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}

      .row
        label {{ $t('models.contract.attributes.status') }}
        span.badge(:class="contract.status")
          | {{ $t('models.contract.attributes.statuses.' + contract.status) }}

      .row.mt-1(v-if="contract.contract_pdf")
        a.button(:href="contractPath", target="_blank")
          | {{ $t('.general.button.download') }}

    .card.mt-2
      h5 {{ $t('.signatures.title') }}

      .row
        label {{ $t('models.contract.attributes.supplierSignedAt') }}

        template(v-if="canSign")
          .text-center(v-if="contract.status != 'signed'")
            .button.button-primary.mr-1(@click="signDialog")
              template(v-if="signning")
                i.fa.fa-spinner.fa-spin
              template(v-else)
                | {{ $t('.button.sign') }}

            .button.button-danger(v-if="!signning", @click="showRefuseOverlay = true")
              | {{ $t('.button.refuse') }}

        template(v-else-if="contract.refused_by_class == 'supplier'")
          span {{ $t('.refused.at', { value: contract.refused_by_at }) }}
        template(v-else)
          span {{ contract.supplier_signed_at || $t('.signatures.waiting') }}

      .row
        label {{ $t('models.contract.attributes.userSignedAt') }}
        span {{ contract.user_signed_at || $t('.signatures.waiting') }}

    overlay-wnd(v-if="showRefuseOverlay", @close="showRefuseOverlay = false")
      .container
        h4.mt-2.text-center {{ $t('.overlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info
          | {{ $t('.overlay.alert') }}

        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.overlay.field.status.label')",
          :error="errors.comment"
        )

        .text-center.mt-2
          button.button.button-danger(@click="refuse", :disabled="refusing")
            template(v-if="refusing")
              i.fa.fa-spinner.fa-spin
            template(v-else)
              | {{ $t('.overlay.button') }}


</template>

<script>
  export default {
    name: 'contract',
    data () {
      return {
        i18nScope: 'contracts.show',
        contract: null,
        params: null,
        comment: '',
        errors: {},
        picked: null,

        // buttons
        refusing: false,
        signning: false,

        showRefuseOverlay: false,

        tabs: [
          {
            route: { name: 'contract', params: {} },
            icon: 'fa-file',
            text: 'Contrato',
            active: true,
          },

          {
            route: { name: 'proposal', params: {} },
            icon: 'fa-list',
            text: 'Proposta',
            active: false,
          }
        ]
      }
    },

    computed: {
      proposalLink() {
        if(!this.contract) return

        let kind = this.contract && this.contract.bidding_kind

        if (kind == 'global') {
          return { name: 'globalProposal', params: { bidding_id: this.contract.bidding_id, id: this.contract.proposal_id } }
        } else {
          return { name: 'proposal', params: { bidding_id: this.contract.bidding_id, lot_id: this.contract.lot_ids[0], id: this.contract.lot_proposal_ids[0] } }
        }
      },

      contractPath() {
        return this.contract && this.$http.host + "/" + this.contract.contract_pdf
      },

      waitingSignatureStatus() {
        let status = this.contract.status
        return status && status == "waiting_signature"
      },

      refusedStatus() {
        let status = this.contract.status
        return status && status == "refused"
      },

      supplierSigned() {
        return !!this.contract.supplier_signed_at
      },

      canSign() {
        return !this.refusedStatus && !this.supplierSigned
      },
    },

    methods: {
      getContract() {
        return this.$http.get('/supplier/contracts/' + this.params.id)
          .then((response) => {
            this.contract = response.data

            this.changeTabs()

            this.$emit('navbarTitleChanged', 'Contrato ' + this.contract.title)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      signDialog() {
        let message = {
          title: this.$t('.dialog.title'),
          body: this.$t('.dialog.body'),
          customClass: 'dg-body'
        }

        let options = {
          okText: this.$t('.dialog.okText'),
          customClass: 'dg-success'
        }

        this.$dialog.confirm(message, options)
          .then((dialog) => {
            this.sign()
          })
          .catch(function (err) {
            console.log(err)
            console.log('nop!')
          });
      },

      refuse() {
        let params = { comment: this.comment }

        this.refusing = true

        return this.$http.patch('/supplier/contracts/' + this.contract.id + '/refused', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.refused.success'))

            this.showRefuseOverlay = false
            this.getContract()
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'contract' })
            this.$notifications.error(this.$t('.notifications.refused.failure'))
          })
          .then(() => {
            this.refusing = false
          })
      },

      sign() {
        this.signning = true

        return this.$http.patch('/supplier/contracts/' + this.contract.id + '/signs')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.signs.success'))

            this.contract.status = 'signed'
            this.getContract()
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.signs.failure'))
          })
          .then(() => {
            this.signning = false
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      },

      changeTabs() {
        // add proposal router to router tab
        this.tabs[1].route = this.proposalLink
        this.$emit('tabChanged', this.tabs)
      }


    },

    created: function () {
      this.parseRoute()
      this.getContract()
    }
  }

</script>
