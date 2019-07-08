<script>
  const SCHEDULE_TIMEOUT = 50

  import Select2 from './select2.vue'

  export default {
    extends: Select2,

    // propriedades extras e/ou sobrecarregadas
    props: {
      url: null
    },

    computed: {
      dataUrl() {
        return app.secrets.api.host + this.url
      },

      select2Options() {
        let _defaultAjaxParams = {
          url: this.dataUrl,
          dataType: 'json',
          delay: 250,
          data: function (search) {
            return {
              search: search
            };
          },

          processResults: function (data) {
            return {
              results: data
            };
          },

          // auth request if needed
          headers: {
            "Authorization": 'Bearer ' + app.auth.token
          }
        }

        let options = {
          data:        this.options,
          placeholder: this.placeholder,
          language: "pt-BR",

          allowClear: false,
          minimumInputLength: 3,
          closeOnSelect: true,
          ajax: _defaultAjaxParams
        }

        if (this.hideSearch) {
          options.minimumResultsForSearch = Infinity
        }

        if (this.modal) {
          options.dropdownParent = this.$el.closest('.modal-container')

        } else if (this.overlay) {
          options.dropdownParent = this.$el.closest('.overlay')
        }

        return options
      }
    }
  }
</script>
