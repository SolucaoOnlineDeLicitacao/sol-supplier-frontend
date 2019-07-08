<style scoped lang="scss">
  .togglable-div-btn {
    text-align: right;
    display: block;
    color: #000;
    cursor: pointer;
    padding: 8px 0;
    margin-top: 4px;
  }

  .content {
    // para não depender do tamanho dos filhos!
    overflow: hidden;
  }

  .toggle-slidding-enter-active,
  .toggle-slidding-leave-active {
    transition: all .3s ease;
  }

  .toggle-slidding-enter,
  .toggle-slidding-leave-to {
    // aqui deixamos as propriedades que queremos animadas
    height: 0;
    opacity: 0;
  }

</style>


<template lang="pug">

  .wrapper
    a.togglable-div-btn(@click.stop='toggle')
      slot(name='btn-close-content' v-if="opened")
      slot(name='btn-open-content' v-else)

    //- https://vuejs.org/v2/guide/transitions.html#JavaScript-Hooks
    transition(name="toggle-slidding",
      @enter="open",
      @after-enter="afterOpen",

      @before-leave="beforeClose",
      @leave="close",
      @after-leave="afterClose"
    )
      .content(v-show="opened", ref="content")
        slot

</template>


<script>

  export default {
    props: {
      initOpened: { type: Boolean, default: false }
    },

    data() {
      return {
        opened: this.initOpened
      }
    },

    computed: {
      height() {
        const childrenArray = Array.from(this.$refs.content.children)

        return childrenArray.reduce(
          (height, node) => height + node.getBoundingClientRect().height,
          0
        )
      }
    },

    methods: {

      toggle() {
        this.opened = !this.opened
      },

      open(el, done) {
        // Ao iniciar a transição "abertura", definimos o height absoluto "alvo"
        // para que o CSS possa funcionar - CSS transitions para "tamanhos" só
        // funcionam quando são definidos valores fixos de "início" e "fim".
        //
        // Nesse momento, o height é `0` - veja o CSS: a regra
        // .toggle-sliding-enter é adicionada logo antes de executar esse hook.
        // Precisamos então definir que queremos a "abertura", ou seja, uma
        // transição de altura de 0 -> altura-total. Logo, definimos o valor
        // absoluto da altura total para disparar a transição.
        el.style.height = `${this.height}px`
      },

      afterOpen(el) {
        // Após a transição, removemos a altura definida somente para a transição
        // CSS funcionar, para que as regras CSS voltem a definir a propriedade
        // 'height' - não há nenhum impacto na UI.
        el.style.height = null
      },


      beforeClose(el) {
        // Antes e iniciar a transição de "fechamento", definimos o height
        // absoluto "alvo" para que o CSS possa funcionar - CSS transitions para
        // "tamanhos" só funcionam quando são definidos valores fixos de
        // "início" e "fim".
        //
        // Nesse momento, o height deve ser `auto` (ou alguma deinição de
        // CSS), que pode fazer com que a CSS transition não funcione. Assim,
        // precisamos definir o valor absoluto, habilitando o funcionamento
        // da CSS transition.
        el.style.height = `${this.height}px`
      },

      close(el, done) {
        // Ao iniciar a transição de fechamento, precisamos definir o height
        // como '0px' via style, pois esses valores têm preferência às regras
        // definidas no CSS.
        //
        // Nesse momento, o height é o valor "real" da altura (definido no
        // hook beforeLeave()). Precisamos então definir que queremos a
        // transição: altura-total -> nenhuma-altura (ou fechado). Assim,
        // definimos 0px.
        el.style.height = '0px'
      },

      afterClose(el) {
        // Após a transição, removemos a altura definida somente para a transição
        // CSS funcionar, para que as regras CSS voltem a definir a propriedade
        // 'height' - não há nenhum impacto na UI.
        el.style.height = null
      }

    }
  }
</script>
