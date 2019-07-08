<!--
<doc lang="markdown">
  Componente para campos de arquivos (`input` com type `file`) em formulários, já derivando `label`
  e mensagem de `erro` (para validações).

  Properties
  ----
    - destroyable - `Boolean` Define se deve mostrar o botão para remover arquivo.
    - accept      - Tipos permitidos de arquivos a serem adicionados
    - value       - É o nome do arquivo.
    - downloadUrl - Link para download caso exista um arquivo

  IMPORTANT sabemos que o arquivo existe (está persistido no servidor) pela property `downloadUrl`.

  Remoção de arquivo
  ----
    Temos um _hidden input_ do tipo `boolean` que informa se o arquivo deve ser excluído
    ou não do servidor, seguindo as definições do CarrierWave. Esta _flag_ é marcada ao clicar em
    remover algum arquivo que tenha vindo do servidor (tenha um downloadUrl),

  # Exemplo de uso:
  ## básico
  ```pug
  file-field(
    name="model[document]",
    v-model="document"
  )
  ```

  ## avançado
  ```pug
  file-field(
    name="model[document]",
    accept='image/*,application/pdf',
    v-model="document",
    :downloadUrl="documentUrl",
    :destroyable: "true"
  )
  ```
</doc>
-->

<style scoped lang="scss">
  // TODO definir cor de erro!
  $file-error-color: red;
  $file-error-border-color: red;
  $file-disabled-color: #ABABAB;
  $file-disabled-border-color: #D9D6D5;

  .file-field {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 4px 4px 6px;
  }

  .head {
    > .title {
      display: inline-block;
      font-size: 16px;
      margin-right: 12px;
    }

    > .toolbar {
      float: right;

      .button {
        padding: 0 10px;
        line-height: 32px;
        height: 32px;

        + .button {
          margin-left: 6px;
        }

        &.destroy {
          margin-left: 12px;
        }

        .fa {
          font-size: 16px;
          line-height: 32px;
        }
      }
    }
  }

  .hidden-inputs {
    display: none;
  }

  .content {
    padding-left: 4px;

    > .fa {
      font-size: 14px;
      margin-right: 4px;
    }

    > .value {
      font-size: 12px;

      &.empty {
        font-style: italic;
      }
    }
  }
</style>


<template lang="pug">
  .file-field(:class="{ error, disabled, readonly }")
    .head
      label.label.title(v-if="!hideLabel") {{ labelText }}
      .toolbar
        a.button.button-primary.tooltip-bottom(
          v-if="isDownloadable",
          download,
          :href="downloadUrl",
          :aria-label="$t('.button.download.tooltip', { name: labelText })"
        )
          i.fa.fa-download

        button.button.button-primary.tooltip-bottom(
          type="button",
          @click="choose",
          :aria-label="$t('.button.attach.tooltip')"
        )
          i.fa.fa-paperclip

        button.button.destroy.button-primary.tooltip-bottom(
          v-if="isDestroyable",
          type="button",
          @click="confirmDestroy",
          :aria-label="$t('.button.destroy.tooltip', { name: labelText })"
        )
          i.fa.fa-trash

    .hidden-inputs
      //- XXX como usamos FormData para submissões de formulários, estamos controlando a "existência"
      //- desse file input pelo atributo "disabled", evitando que campos deixados em branco, ao
      //- serem processados pelo FormData, gerem uma entrada "em branco" (arquivo binário sem conteúdo),
      //- o que causa problemas no CarrierWave do servidor!
      input(
        ref="fileInput",
        type="file",
        :disabled="!choosingFile && !hasFileAttached",
        :id="inputId",
        :name="name",
        :accept="accept",
        @change="onChange"
      )

      //- Controlando remoção do arquivo no servidor, a la "_destroy", mas seguindo a definição
      //- do CarrierWave: "remove_${attr_name}"
      input(
        v-if="markedForDestruction",
        type='hidden',
        :name='markedForDestructionAttrName',
        value="true"
      )

    .content
      template(v-if="hasFile")
        i.fa(:class="fileIconClass")
        span.value {{ filename }}
      template(v-else)
        span.value.empty {{ $t('.empty') }}

    input-error(:message="error")

</template>


<script>
  import _ from '@/lib/lodash-ext'
  import InputField from './input-field.vue'

  export default {
    extends: InputField,

    props: {
      accept:      String,
      downloadUrl: String,
      destroyable: { type: Boolean, default: true }
    },

    data() {
      return {
        i18nScope: 'components.file-field',

        choosingFile:         false,
        file:                 null,
        markedForDestruction: false
      }
    },

    methods: {
      onChange() {
        let file = this.$refs.fileInput.files[0]
        if (!file) return

        this.file = file

        // Arquivo anexado. Não deve ser removido.
        this.markedForDestruction = false

        this.$emit('input', file.name)
      },

      choose() {
        this.choosingFile = true

        // XXX como estamos evitando o envio do <input type="file"> em branco, controlando o
        // atributo `disabled` do input, precisamos controlar a flag `choodingFile` - da lógica
        // do componente - mas também a propriedade do DOMElement `.disabled` para garantir
        // a sincronia do disparo do `click()`, pois senão o browser ignora esse click - e não
        // abre o diálogo de seleção de arquivo.
        //  - Por questões de segurança, o browser só "respeita" um `.click()` num elemento se ele
        //    for executado na mesma _thread_ de um event handler de um click nativo - de usuário.
        //    Por isso não podemos usar `nextTick()`, `setTimeout()`, xhr, ... e usamos o `.disabled`
        //    direto!
        let prevDisabled = this.$refs.fileInput.disabled
        this.$refs.fileInput.disabled = false
        this.$refs.fileInput.click()
        this.$refs.fileInput.disabled = prevDisabled

        this.choosingFile = false
      },

      confirmDestroy() {
        let message = this.$t('.button.destroy.confirmation', { name: this.labelText })

        if (window.confirm(message)) this.destroy()
      },

      destroy() {
        this.file = null

        // XXX Isso é necessário para zerar o FileList do input.
        this.$refs.fileInput.type = 'text'
        this.$refs.fileInput.type = 'file'
        this.$refs.fileInput.value = ''

        // Se é "baixável", então está persistido no servidor.
        // Precisamos marcá-lo para remoção/destruição.
        if (this.isDownloadable) this.markedForDestruction = true

        this.$emit('input', null)
      }
    },

    computed: {
      markedForDestructionAttrName() {
        let snakeizedAttrName = _.snakeize(this.lodash-ext)
        if (!this.modelName) return `remove_${snakeizedAttrName}`

        let snakeizedModelName = _.snakeize(this.lodash-ext)
        return `${snakeizedModelName}[remove_${snakeizedAttrName}]`
      },

      filename() {
        return this.value
      },

      fileIconClass() {
        if (_.isBlank(this.filename)) return null

        let filename = this.filename.toLowerCase()

        if (/\.pdf/.test(filename)) {
          return 'fa-file-pdf-o'
        } else if (/\.(png|jpe?g|gif|bmp)/.test(filename)) {
          return 'fa-file-image-o'
        }

        // default
        return 'fa-file-o'
      },

      // Indica se o arquivo existe:
      // - seja persistido no servidor
      // - seja recém-anexado no client
      hasFile() {
        return !!this.filename && !this.markedForDestruction
      },

      // Indica se o arquivo está recém-anexado no client!
      hasFileAttached() {
        return !!this.file
      },

      isDownloadable() {
        return !!this.downloadUrl && !this.markedForDestruction
      },

      isDestroyable() {
        return this.destroyable && this.hasFile
      }
    }
  }
</script>
