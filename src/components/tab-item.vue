<style scoped lang="scss">

  .tab-item {
    height: 50px;
    float: left;
    padding-top: 5px;

    text-align: center;

    color: $pale-grey-two;
    cursor: pointer;
    border-bottom: solid 4px transparent;

    a {
      display: block;
      height: 100%;
      width: 100%;

      color: $pale-grey-two;
      text-decoration: none;
    }

    .tab-item-text {
      margin-top: -3px;
      font-size: 11px;
    }

    &.active {
      border-bottom-color: rgb(134, 190, 179);
    }
  }

</style>


<template lang="pug">

  div.tab-item(@click="onClickTabItem" :class="tabActiveClass")
    router-link(:to="tabRoute" v-if="tabRoute")
      i.fa(:class="tabIcon")
      .tab-item-text
        | {{ tabText }}
    div(v-else)
      i.fa(:class="tabIcon")
      .tab-item-text
        | {{ tabText }}

</template>


<script>

  export default {
    props: {
      route: { type: Object },
      icon: { type: String, default: '' },
      text: { type: String, default: '' },
      index: { type: Number, default: 0 },
      active: { type: Boolean, default: false }
    },

    data () {
      return {
        i18nScope: 'tab-item',
      }
    },

    computed: {
      tabActiveClass() {
        return !!this.active ? 'active' : ''
      },

      tabRoute() {
        return this.route
      },


      tabIcon() {
        return this.icon;
      },

      tabText() {
        return this.text;
      }
    },

    methods: {
      onClickTabItem() {
        this.$emit('clicked', this.index)
      }
    }
  }

</script>

