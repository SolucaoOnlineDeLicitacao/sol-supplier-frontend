<!--
<doc lang="markdown">
  # Modal

  ## usage
  ```pug
  modal-wnd(v-if="showModal", :footer="false", @close="showModal = false")
    h1.modal-heading(slot="header") {{ $t('modal.heading') }}
    app-searchbar
  ```

  ## refs
  - https://vuejs.org/v2/examples/modal.html
</doc>
-->

<style scoped lang="scss">
  @import "modal-wnd-variables";

  .modal-mask {
    position: fixed;
    z-index: $modal-z-index;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(218, 218, 218, 0.7);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    z-index: $modal-z-index + 1;
  }

  .modal-container {
    position: relative;

    /*
      TODO definir largura do modal. Entender como reusar componente tanto
      para desktop quanto para phone.
      ex: width: 300px;
    */
    width: 94%;

    // Altura total menos margin
    max-height: calc(100vh - 40px);
    margin: 20px auto;
    overflow: scroll;

    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    /*font-family: Helvetica, Arial, sans-serif;*/
  }

  .modal-close-btn {
    z-index: $modal-z-index + 2;

    border: 0;
    outline: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    right: 20px;
    top: 20px;

    color: #C9C9C9;
  }

  .modal-header {
    color: #42b983;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .modal-header > h1 {
    font-size: 2em;
  }

  .modal-body {
  }

  .modal-footer {
    margin-top: 20px;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    transform: scale(1.1);
  }
</style>


<template lang="pug">
  transition(
    :name="transition",
    @before-enter="beforeEnter",
    @after-enter="afterEnter",
    @before-leave="beforeLeave",
    @after-leave="afterLeave"
  )
    .modal-mask(@click="close")
      .modal-wrapper
        .modal-container(@click.stop="")

          button.modal-close-btn(type="button", @click="close")
            i.fa.fa-close-thin.fa-3x(aria-hidden="true")

          .modal-header(v-if="header")
            slot(name="header")
              h1 {{ heading }}

          .modal-body
            slot

          .modal-footer(v-if="footer")
            slot(name="footer")
              button.modal-default-button(@click="cancel") {{ $t('btn.cancel') }}
              button.modal-default-button(@click="confirm") {{ $t('btn.confirm') }}
</template>


<script>
  import freezeScrolling from '@/lib/freeze-scrolling'

  export default {
    props: {
      footer:     { type: Boolean, default: true },
      header:     { type: Boolean, default: true },
      heading:    { type: String, default: '' },
      transition: { type: String, default: 'modal' }
    },

    computed: {
      parentScrollableElem() {
        return document.body
      }
    },

    methods: {
      // transition hooks
      // --
      beforeEnter() {
        // Já tenta congelar o scroll aqui, pois usa `position: fixed` e isso causa um "flick"
        // nos dispositivos móveis caso seja feito apenas no afterEnter()
        this.stopScrolling()
        this.$emit('open')
      },

      afterEnter() {
        // XXX garantindo que o scroll esteja congelado.
        if (this.isScrolling()) this.stopScrolling()

        this.focus()
        this.$emit('opened')
      },

      beforeLeave() {
        this.cleanup()
        // XXX isso deveria ficar aqui! Mas está sendo feito no método `close()`,
        // associado ao `click` no botão de fechar!
        // this.$emit('close')
      },

      afterLeave() {
        this.$emit('closed')
      },
      // --


      focus() {
        let autofocusEl = this.$el.querySelector('[autofocus]')
        if (autofocusEl) autofocusEl.focus()
      },

      cancel() {
        this.$emit('cancel')
        this.close()
      },

      cleanup() {
        // XXX evita "religar" scroll caso exista um overlay na página!
        // Isso permite a abertura de modal "em cima" de overlay.
        if (document.body.querySelector('.overlay')) return

        this.startScrolling()
      },

      close() {
        this.$emit('close')
      },

      confirm() {
        this.$emit('confirm')
      },

      isScrolling() {
        return !freezeScrolling.isFrozen(this.parentScrollableElem)
      },

      // "religa" scroll no body (conteúdo abaixo do overlay).
      startScrolling() {
        freezeScrolling.release(this.parentScrollableElem)
      },

      // evita scroll no body (conteúdo abaixo do overlay) enquanto o overlay
      // estiver aberto.
      stopScrolling() {
        freezeScrolling.freeze(this.parentScrollableElem)
      }
    },

    // lifecycle hooks
    // --
    beforeDestroy() {
      // garante que, caso o modal não tenha sido fechado, o scroll seja "religado"
      this.cleanup()
    }
  }
</script>
