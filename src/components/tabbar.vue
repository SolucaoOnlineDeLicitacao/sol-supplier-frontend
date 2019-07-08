<style scoped lang="scss">

  .tabbar {
    color: $pale-grey;
    background-color: rgb(73, 113, 138);

    @for $i from 1 through 4 {
      &.tab-container-#{$i} {
        .tab-item {
          width: 100% / $i;
        }
      }
    }
  }

</style>


<template lang="pug">

  .tabbar.u-cf.u-full-width(:class="tabItemSizeClass")
    slot

</template>


<script>

  export default {
    props: {
      // get it
      count: { type: Number, default: 2 }
    },

    data () {
      return {
        i18nScope: 'tabbar',
      }
    },

    computed: {
      tabItemSizeClass() {
        return 'tab-container-' + this.count;
      }
    }
  }

</script>

