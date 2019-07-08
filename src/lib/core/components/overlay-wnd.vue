<!--
<doc lang="markdown">
  # Overlay

  ## usage
  ```pug
  overlay-wnd(v-if="showOverlay", @close="showOverlay = false")
    h1.overlay-heading(slot="header") {{ $t('overlay.heading') }}
    app-searchbar
  ```

  ## events
  - @open
    - Vai abrir, com a transição CSS se iniciando
  - @opened
    - Está completamente aberto, com a transição CSS finalizada
  - @close
    - Vai fechar, com a transição CSS se iniciando
  - @closed
    - Está completamente fechado, com a transição CSS finalizada

  ## refs
  - https://vuejs.org/v2/examples/modal.html
</doc>
-->

<style scoped lang="scss">
  @import "overlay-wnd-variables";

  .overlay.level-1,
  .overlay.level-1 > .content {
    z-index: $overlay-z-index-level-1;
  }

  .overlay.level-1 > .content > .overlay-btn-close {
    z-index: $overlay-z-index-level-1 + 1;
  }

  .overlay.level-2,
  .overlay.level-2 > .content {
    z-index: $overlay-z-index-level-2;
  }

  .overlay.level-2 > .content > .overlay-btn-close {
    z-index: $overlay-z-index-level-2 + 1;
  }

  .overlay.level-3,
  .overlay.level-3 > .content {
    z-index: $overlay-z-index-level-3;
  }

  .overlay.level-3 > .content > .overlay-btn-close {
    z-index: $overlay-z-index-level-3 + 1;
  }

  .overlay {
    position: fixed;
    top: 0; bottom: 0; right: 0; left: 0;
    background-color: #fff;

    & > .content > .overlay-btn-close {
      height: auto;
      line-height: auto;

      border: 0;
      outline: 0;

      position: absolute;
      top: 0;
      left: 0;
      padding: 12px;
      margin: 0;

      color: #aaa;
    }

    & > .content {
      width: 100%;
      height: 100%;

      overflow-y: scroll;
      position: relative;
    }
  }


  /* NOTE reaproveitando transições globais de `applcation/_transitions.scss` */

</style>


<template lang="pug">
  transition(
    :name="transition",
    @before-enter="beforeEnter",
    @after-enter="afterEnter",
    @before-leave="beforeLeave",
    @after-leave="afterLeave"
  )
    .overlay(:class="[levelClass]")
      //- XXX não é possível posicionar esse elemento aqui por um bug no
      //- Safari iOS.
      //-   Veja mais em: https://stackoverflow.com/a/38505679
      //- button.btn-close(type="button", @click="close")
      //-   i.fa.fa-times.fa-3x(aria-hidden="true")

      .content(ref="content")
        button.overlay-btn-close(v-if="closeButton", type="button", @click="close")
          i.fa.fa-close-thin.fa-3x(aria-hidden="true")

        slot
</template>


<script>
  import freezeScrolling from '@/lib/freeze-scrolling'

  export default {
    props: {
      closeButton: { type: Boolean, default: true },
      /**
       * Nível do overlay, para controlar sobreposição dos mesmos.
       * ex: level 2 sobrepões o level 1 (controle por CSS z-index)
       * @type {Number}
       */
      level:       { type: Number, default: 1 },
      transition:  { type: String, default: 'slide-up' }
    },

    computed: {
      levelClass() {
        return `level-${this.level}`
      },

      parentScrollableElem() {
        switch (this.level) {
          case 3:
            return document.body.querySelector('.overlay.level-2 > .content')
          case 2:
            return document.body.querySelector('.overlay.level-1 > .content')
          default: // case 1:
            return document.body
        }
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
        // Isso surgiu da necessidade de links em um overlay abrirem outro overlay
        //   - ex: phone: app-menu, link "Encontre sua moradia", fecha o app-menu (overlay) e abre
        //     um novo overlay com o form de busca de imóveis.
        //     - as transições dos overlays se "transpassam"!
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

      cleanup() {
        this.startScrolling()
      },

      close() {
        this.$emit('close')
      },

      isScrolling() {
        return !freezeScrolling.isFrozen(this.parentScrollableElem)
      },

      scrollTop() {
        this.$refs.content.scrollTop = 0
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
    mounted() {
      // garante que, caso o overlay seja criado já aberto (sem transição),
      // o scroll no pai seja bloqueado
      this.stopScrolling()
    },

    beforeDestroy() {
      // garante que, caso o overlay não tenha sido fechado, o scroll no pai seja "religado"
      this.cleanup()
    }
  }
</script>
