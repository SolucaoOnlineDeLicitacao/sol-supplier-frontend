<style scoped lang="scss">
  .icon-button {
    padding: 0 12px;
    height: 28px;

    line-height: 28px;
    margin-right: 10px;
  }

  .classification-line {
    line-height: 28px;

    .classification-text {
      max-width: 80%
    }
  }

  .input-file {
    float: left;
    max-width: 80%;
  }

 .errors {
    .error,
    label {
      color: red;
    }

    .error {
      font-size: 12px;
    }
  }

</style>

<template lang="pug">
  .root
    navbar.mb-2(:title="navbarTitle" :showNavbarMenu="false" :showBackButton="true")

    .container.provider(v-if="!showSuccessOverlay")
      template(v-if="provider")
        template(v-if="this.provider.id")
          .alert.alert-info
            | Informações pré-cadastradas para o documento
            strong  {{ this.provider.document }}.

            div.mt-2
            | Por favor valide as informações e prossiga com o cadastro.

        form.card(ref="form", method="post", @submit.prevent="submit" )

          h4.title
            | {{ this.$t('.general.title') }}

          label Documento
          span {{ this.provider.document }}

          input-field.mt-1(
            :autofocus="true",
            type="text",
            v-model="provider.name",
            name="provider[name]",
            require=true,
            :error="errors.name"
          )

          input(type="hidden", v-model="provider.document", name="provider[document]")

          input(type="hidden", v-model="provider.type", name="provider[type]")

          AddressFields(:errors="errorsAddress" prefix="provider" :address="address")

          hr
          h4.title Representante Legal

          input(type="hidden", name="provider[legal_representative_attributes][id]", :value="legal_representative.id" v-if="provider.legal_representative")

          input-field(
            type="text",
            model="legal_representative",
            v-model="legal_representative.name",
            name="provider[legal_representative_attributes][name]",
            require=true,
            :error="errorsLegalRepresentative['legal_representative.name']"
          )

          input-field(
            type="text",
            model="legal_representative",
            v-model="legal_representative.nationality",
            name="provider[legal_representative_attributes][nationality]",
            require=true,
            :error="errorsLegalRepresentative['legal_representative.nationality']"
          )


          select-field(
            name="provider[legal_representative_attributes][civil_state]",
            model="legal_representative",
            v-model="legal_representative.civil_state",
            :options="civilStates",
            :placeholder="$t('.something')",
            require=true,
            :error="errorsLegalRepresentative['legal_representative.civil_state']"
          )

          input-field(
            type="text",
            model="legal_representative",
            v-model="legal_representative.rg",
            name="provider[legal_representative_attributes][rg]",
            require=true,
            :error="errorsLegalRepresentative['legal_representative.rg']"
          )

          input-field(
            type="text",
            model="legal_representative",
            v-model="legal_representative.cpf",
            name="provider[legal_representative_attributes][cpf]",
            require=true,
            :error="errorsLegalRepresentative['legal_representative.cpf']",
            mask="000.000.000-00",
          )

          input-field(
            type="text",
            model="legal_representative",
            v-model="legal_representative.valid_until",
            name="provider[legal_representative_attributes][valid_until]",
            :error="errorsLegalRepresentative['legal_representative.valid_until']"
          )

          AddressFields(:errors="errorsLegalRepresentativeAddress" prefix="provider[legal_representative_attributes]"  :address="legal_representative_address" errorPrefix="legal_representative.")

          hr
          h4.title
            | {{ this.$t('.users.title') }}

          input-field(
            type="text",
            model="supplier",
            v-model="supplier.name",
            require=true,
            name="provider[suppliers_attributes][][name]",
            :error="errorsSupplier['suppliers.name']"
          )

          email-field(
            name="provider[suppliers_attributes][][email]",
            type="text",
            model="supplier",
            v-model="supplier.email",
            require=true,
            :error="errorsSupplier['suppliers.email']"
          )

          phone-field(
            name="provider[suppliers_attributes][][phone]",
            type="text",
            model="supplier",
            v-model="supplier.phone",
            require=true,
            :error="errorsSupplier['suppliers.phone']"
          )

          input-field(
            name="provider[suppliers_attributes][][cpf]",
            type="text",
            placeholder="000.000.000-00",
            model="supplier",
            v-model="supplier.cpf",
            require=true,
            mask="000.000.000-00",
            :error="errorsSupplier['suppliers.cpf']"
          )

          input-field(
            name="provider[suppliers_attributes][][password]",
            type="password",
            model="supplier",
            v-model="supplier.password",
            require=true,
            :error="errorsSupplier['suppliers.password']"
          )

          input-field(
            name="provider[suppliers_attributes][][password_confirmation]",
            type="password",
            model="supplier",
            v-model="supplier.password_confirmation",
            require=true,
            :error="errorsSupplier['suppliers.password_confirmation']"
          )

          hr
          h4.title
            | {{ this.$t('.classifications.title') }}

          .row(v-if="this.classificationGroupOptions")
            .six.columns
              select-group-field(
                name="classification[name]",
                model="classification",
                :options="this.classificationGroupOptions",
                placeholder="Selecione uma opção",
                require=true,
                :error="errors.classification",
                :hideSearch="false",
                :includePrompt="true",
                :hideLabel="true"
              )

            .six.columns
              .button.u-full-width(@click="addClassification")
                i.fa.fa-plus.mr-1
                | Adicionar

          .errors(v-if="errors.provider_classifications")
            .error É obrigatório informar pelo menos uma classificação e/ou segmento.

          .row.classification-line.mb-1(v-for="(classification, index) in classifications")
            .u-pull-left(v-if="!classification._destroy")
              button.button.mb-0.icon-button(type="button" @click="removeClassification(classification)")
                i.fa.fa-close-thin

            .u-pull-left.classification-text(:class="classification.focus ? 'focus' : ''" v-if="!classification._destroy")
              | {{ classification.name }}

            input(type="hidden", name="provider[provider_classifications_attributes][][id]", :value="classification.id" v-if="classification")

            input(type="hidden", name="provider[provider_classifications_attributes][][classification_id]", :value="classification.classification_id" v-if="classification")

            input(type="hidden", name="provider[provider_classifications_attributes][][_destroy]", :value="classification._destroy" v-if="classification")


          hr
          h4.title
            | {{ this.$t('.attachments.title') }}

          .button.u-full-width(@click="addAttachment")
            i.fa.fa-plus.mr-1
            | Adicionar

          template(v-for="attachment in attachments" v-if="attachment.visible")
            .u-pull-left
              button.button.mb-0.icon-button(type="button" @click="removeAttachment(attachment.id)")
                i.fa.fa-close-thin

            input.input-file(type="file", name="provider[attachments_attributes][][file]")

          .mt-2
            button.button-submit.u-full-width(
              type="submit",
              :disabled="submitting"
            )
              | {{ submitText }}

      template(v-else)
        .card
          select-field(
            name="provider_type",
            v-model="provider_type",
              label="Tipo de pessoa (PF/PJ)",
            :options="types",
            placeholder="Selecione uma opção"
          )

          template(v-if="provider_type")
            input-field(
              type="text",
              v-model="provider_document",
              name="provider_document",
              :label="documentLabel",
              :mask="providerMask"
            )

            .alert.alert-info(v-if="alreadyInUse")
              | Fornecedor cadastrado no sistema com usuário para acesso. Informe outro documento ou acesse o sistema com seu usuário e senha.

            button.button.u-full-width(
              v-if="canFind",
              type="button",
              :disabled="finding", @click="findProvider()"
            )
              | {{ findText }}

    overlay-notification(v-if="showSuccessOverlay", :showOverlay="showSuccessOverlay", :text="$t('.notifications.success')" @ok="redirecToIndex", okText="Entendi")

</template>

<script>
  import AddressFields from '../addresses/address-fields.vue';

  export default {
    name: 'newProvider',

    components: {
      AddressFields
    },

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'providers.new',
        submitting: false,
        finding: false,

        errors: {},
        errorsSupplier: {},
        errorsAddress: {},
        errorsLegalRepresentative: {},
        errorsLegalRepresentativeAddress: {},

        alreadyInUse: false,
        attachments: [],
        nextAttachmentId: 0,

        // form
        provider: null,
        provider_document: '',
        provider_type: null,
        supplier: {},
        address: {},
        legal_representative_address: {},
        legal_representative: {},
        classificationGroupOptions: null,
        classifications: [],
        classification: {},

        showSuccessOverlay: false,
      }
    },

    computed: {
      providerMask() {
        let type = this.provider_type

        if(type == 'Individual') {
          return { mask: '000.000.000-00', options: { reverse: true, clearIfNotMatch: true } }
        } else {
          return { mask: '00.000.000/0000-00', options: { reverse: true, clearIfNotMatch: true } }
        }
      },

      canFind() {
        let type = this.provider_type
        let documentSize = this.provider_document && this.provider_document.length

        if(type == 'Individual') return documentSize == 14
        return documentSize == 18
      },

      documentLabel() {
        let type = this.provider_type

        if(type == 'Individual') return 'Informe o CPF'
        return 'Informe o CNPJ'
      },

      navbarTitle() {
        return 'Cadastro'
      },

      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      findText() {
        if (this.finding) return this.$t('.button.finding')
        return this.$t('.button.find')
      },


      civilStates() {
        return [
          { id: 'single', text: this.$t('models.legal_representative.attributes.civil_states.single') },
          { id: 'married', text: this.$t('models.legal_representative.attributes.civil_states.married') },
          { id: 'divorced', text: this.$t('models.legal_representative.attributes.civil_states.divorced') },
          { id: 'widower', text: this.$t('models.legal_representative.attributes.civil_states.widower') },
          { id: 'separated', text: this.$t('models.legal_representative.attributes.civil_states.separated') }
        ]
      },

      types() {
        return [
          { id: 'Individual', text: this.$t('models.provider.attributes.types.individual') },
          { id: 'Company', text: this.$t('models.provider.attributes.types.company') }
        ]
      }
    },

    methods: {
      findProvider() {
        let params = { search: { term: this.provider_document } }

        this.alreadyInUse = false

        this.$http.get('/search/register/providers', { params: params })
          .then((response) => {
            if(response.status == 204) {
              this.alreadyInUse = true
            } else if(_.isPresent(response.data)) {
              this.provider = response.data
              this.address = this.provider.address || {}
              this.legal_representative = this.provider.legal_representative || {}
              this.legal_representative_address = this.provider.legal_representative.address || {}
              this.classifications = this.provider.provider_classifications || []
            } else {
              this.provider = {}
              this.provider.document = this.provider_document
              this.provider.type = this.provider_type
            }
          }).catch((_err) => {
            this.provider = null
            this.error = _err
            console.error(_err)
          })
      },

      catchErrors(err) {
        let errors = _.dig(err, 'response', 'data', 'errors') || {}

        this.$notifications.error(this.$t('.notifications.failure'))

        this.errors = this.$i18n.errify(errors, { model: 'provider' })
        this.errorsAddress = this.$i18n.errify(errors, { model: 'address' })
        this.errorsSupplier = this.$i18n.errify(errors, { model: 'suppliers' })
        this.errorsLegalRepresentative = this.$i18n.errify(errors, { model: 'legal_representative' })
        this.errorsLegalRepresentativeAddress = this.$i18n.errify(errors, { model: 'legal_representative.address' })
      },

      submitSuccess(response) {
        this.errors = {}

        this.showSuccessOverlay = true
      },

      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        if(this.provider.id) {
          this.$http.patch('/providers/' + this.provider.id, formData)
            .then((response) => {
              this.submitSuccess()
            })
            .catch((err) => {
              this.catchErrors(err)
            })
            .then(() => {
              this.submitting = false
            })
        } else {
          this.$http.post('/providers', formData)
            .then((response) => {
              this.submitSuccess()
            })
            .catch((err) => {
              this.catchErrors(err)
            })
            .then(() => {
              this.submitting = false
            })
        }
      },

      redirecToIndex() {
        let redirectToRoute = { name: 'login' }
        this.$router.replace(redirectToRoute)
      },


      getClassifications() {
        return this.$http.get('/search/classifications')
          .then((response) => {
            let grouped = _.groupBy(response.data, 'classification_id')
            let headers = grouped["null"]
            let classifications = []

            headers.filter(function(elem) {
              let currentClassification = {
                id: elem.id,
                text: elem.text,
                children: grouped[elem.id]
              }

              classifications.push(currentClassification)
            });

            this.classificationGroupOptions = classifications

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      addClassification: function() {
        // TODO: refactor
        // TODO: get it without jquery
        let selectedId = $('#classification_name').val()
        let selectedName = $('#classification_name option:selected').text()

        let alreadyAdd = false
        let wasDestroyedIndex = -1

        if(selectedId == 0 || selectedName == '') return

        this.classifications.filter(function(elem, index){
          elem.focus = false

          if(elem.classification_id == selectedId) {
            if(elem._destroy) {
              elem._destroy = false
              wasDestroyedIndex = index
            } else {
              alreadyAdd = true
              elem.focus = true
            }
          }
        });

        if(!alreadyAdd) {
          this.classification.classification_id = selectedId
          // TODO: get it without jquery
          this.classification.name = selectedName
          this.classification._destroy = !!this.classification._destroy

          if (wasDestroyedIndex < 0) this.classifications.unshift(_.clone(this.classification))

          this.classification = {}
        }

        this.classifications = _.sortBy(this.classifications, [function(c) { return c.name; }])
      },

      removeClassification(classification) {
        let currentItem = classification

        this.classifications.filter(function(elem){
          if(elem.classification_id == currentItem.classification_id) {
            elem._destroy = true
          }
        })
      },

      addAttachment() {
        this.attachments.push({
          id: this.nextAttachmentId++,
          visible: true
        })
      },

      removeAttachment(attachmentId) {
        this.attachments.filter(function(elem){
          if(elem.id == attachmentId) elem.visible = false
        });
      }
    },

    mounted: function() {
      this.getClassifications()
    },
  }

</script>
