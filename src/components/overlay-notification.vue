<style scoped lang="scss">

  .success-container {
    text-align: center;
    margin-top: 150px;

    h4 {
      font-size: 20px;
    }

    .fa {
      color: $pale-teal;
    }

    .button {
      min-width: 80%;
      background-color: $dark-grey-blue;
      color: white;
      border: none;
    }
  }

</style>


<template lang="pug">

  overlay-wnd(v-if="show", @close="show = false", :closeButton="false")
    .container.success-container(:class="topClass")
      i.fa.fa-10x(:class="icon")
      h4.mt-6 {{ text }}
      .button.mt-5(@click="afterOk")
        | {{ okText }}

</template>


<script>

  export default {
    props: {
      // get it
      text: { type: String, default: '' },
      okText: { type: String, default: 'Ok' },
      icon: { type: String, default: 'fa-check' },
      showOverlay: { type: Boolean, default: false },
      topClass: { type: String, default: '' }
    },

    data () {
      return {
        show: this.showOverlay,
        i18nScope: 'overlay-notification',
      }
    },

    computed: {
      tabItemSizeClass() {
        return 'tab-container-' + this.count;
      }
    },

    methods: {
      afterOk() {
        this.show = false
        this.$emit('ok')
      }
    }
  }

</script>

