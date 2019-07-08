<!--
<doc lang="markdown">
    Barra de loading "indeterminada" (sem porcentagem definida), para representar
  um estado de carregamento da aplicação.
    fonte: https://codepen.io/holdencreative/pen/vEVbwv
</doc>
-->

<style scoped lang="scss">
  .progress {
    height: 4px;
    display: block;
    width: 100%;
    background-color: $cerulean;
    border-radius: 2px;
    background-clip: padding-box;
    overflow: hidden;

    .indeterminate {
      background-color: $white;

      &:before {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
      }

      &:after {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
      }
    }
  }

  @-webkit-keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }
  @keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }
  @-webkit-keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
</style>

<template lang="pug">
  transition(name="fade")
    .progress(v-show="active")
      .indeterminate
</template>

<script>
  export default {
    data() {
      return {
        active: false
      }
    },

    created() {
      app.$on('loading:start', this.refresh)
      app.$on('loading:stop', this.refresh)
    },

    beforeDestroy() {
      app.$off('loading:start', this.refresh)
      app.$off('loading:stop', this.refresh)
    },

    methods: {
      refresh() {
        this.active = app.loading.active
      }
    }
  }
</script>
