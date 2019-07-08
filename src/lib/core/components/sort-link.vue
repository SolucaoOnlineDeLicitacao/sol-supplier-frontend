<!--
<doc lang="markdown">

  Link para ordenação simplista, a ser usado em cabeçalhos de listas.


  ##  Exemplo de uso:

  ```pug
    //- suponha `this.sortOptions = { sort: 'age', order: 'desc' }`
    //- vamos então criar um link para ordenar por "name" ao invés de "age":
    sort-link.text-center(:value="'name'", :sort.sync="sort", :order.sync="order")
  ```

  ```javascript
    data() {
      return {
        sort: this._sort,
        order: this._order
      }
    },

    computed: {
      // assim que this.page for alterado, a URL também será atualizada
      fetchParams() {
        return {
          // ...
          sort: this.sort,
          order: this.order
        }
      }
    },

    methods: {
      fetch() {
        this.$http.get(...)
          // ...
      }
    }
    watch: {
      fetchParams() {
        // quando os parâmetros mudarem, recarregue a lita
        this.fetch()
      }
    }
  ```

</doc>
-->

<style scoped lang="scss">

  .sort-link {
    text-decoration: none;

    > .fa {
      margin-left: 4px;
    }
  }

</style>


<template lang="pug">

  a.sort-link(href="javascript:void(0)", @click="sort")
    slot
    i.fa(:class="sortClass")

</template>


<script>
  export default {
    props: {
      value: { type: String, required: true },
      defaultOrder: { type: String, default: 'asc' }
    },

    data() {
      return {
        i18nScope: 'components.sortLink',
        order: this.defaultOrder
      }
    },

    computed: {
      active() {
        return this.currentSort === this.value
      },

      currentSort() {
        return this.$route.query.sort
      },

      currentOrder() {
        return this.$route.query.order
      },

      sortClass() {
        if (!this.active) return ''

        return (this.order === 'asc') ? 'fa-caret-down' : 'fa-caret-up'
      }
    },

    methods: {
      sort() {
        let reverseOrder = this.active && (this.currentOrder === this.order)

        if (reverseOrder) {
          this.order = (this.order === 'desc') ? 'asc' : 'desc'
        }

        this.$emit('sort', { sort: this.value, order: this.order })
      }
    },

    created() {
      if (this.active && this.currentOrder && (this.order !== this.currentOrder)) {
        this.order = this.currentOrder
      }
    }
  }
</script>
