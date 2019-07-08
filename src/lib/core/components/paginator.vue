<!--
<doc lang="markdown">

    Paginador simples, exibindo - se existirem - botões de "Anterior" e "Próximo".
  Sua única responsabilidade é informar a página que o usuário deseja acessar!
  Assim, use-o com um `v-model`, e trate o carregamento (XHR) em um lugar
  apropriado.


  ##  Exemplo de uso:

    Defina propriedades reativas que informem o valor da "próxima página" e
  da "página anterior". Assim, quando o usuário interagir (clicar) com os
  botões de "Anterior" e "Próximo", o componente `paginator` alterará a
  propriedade definida como `v-model`. Por fim, reaja a alterações nessa
  propriedade, recarregando o que for necessário.

  ```pug
    paginator.text-center(
      v-model="page",
      :first="firstPage",
      :prev="prevPage",
      :next="nextPage",
      :last="lastPage"
    )
  ```

  ```javascript
    mounted() {
      // inicie a página (this.page) a partir da QueryString do navegador:
      //   ex: "meudominio.com/usuarios?page=2"
      let params = qs.parse(window.location.search)
      this.page = params.page  // aqui, params.page === 2
    },

    computed: {
      // assim que this.page for alterado, a URL também será atualizada
      fetchUrl() {
        return `/users?page=${this.page}`
      }
    },

    methods: {
      fetch() {
        this.$http.get(this.fetchUrl)
          .then((response) => {
            this.users = response.data

            // parseie o xhr.getResponseHeader('Link') para atualizar
            // os links de next e prev
            let links = parseLinkHeaders()
            this.firstPage = links.first.page
            this.prevPage = links.prev.page
            this.nextPage = links.next.page
            this.lastPage = links.last.page
          })
      }
    }
    watch: {
      page() {
        // quando page mudar, pela interação do usuário com o paginador,
        // recarregue a ferramenta
        this.fetch()
      }
    }
  ```

</doc>
-->

<style scoped lang="scss">

  .component {
    text-align: center;
  }

  button {
    background: #fff;
  }

  button + button {
    margin-left: 8px;
  }

  button[disabled] {
    opacity: 0.5;
  }

  .btn-first > .fa,
  .btn-prev > .fa {
    margin-right: 4px;
  }

  .btn-next > .fa,
  .btn-last > .fa {
    margin-left: 4px;
  }

  .page {
    border: 0;
    font-size: 16px;
  }

</style>


<template lang="pug">

  .component.paginator

    button.btn-prev(
      type="button",
      :disabled="!prev",
      @click="$emit('input', prev)"
    )
      i.fa.fa-angle-left
      | {{ $t('.prev') }}

    span.button.page.ml-1.mr-1 {{ value }}

    button.btn-next(
      type="button",
      :disabled="!next",
      @click="$emit('input', next)"
    )
      | {{ $t('.next') }}
      i.fa.fa-angle-right

</template>


<script>
  export default {
    props: {
      value: { type: [String, Number], default: 1 },
      first: [String, Number],
      prev:  [String, Number],
      next:  [String, Number],
      last:  [String, Number]
    },

    data() {
      return {
        i18nScope: 'components.paginator'
      }
    }
  }
</script>
