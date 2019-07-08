<!--
<doc lang="markdown">
  ## Uso

  Básico: utilizando valor de `app.stage` como rótulo e exibindo apenas se o stage for 'production'.
  ```pug
    stage-stamp
  ```

  Avançado: mais uma condição para _exibição_ e utilizando um label específico.
  ```pug
    stage-stamp(v-if="!!stageLabel", :label="stageLabel")
  ```
</doc>
-->

<style scoped lang="scss">
  // src: http://social.pemco.com/test/claim-stamps/claim-stamps-ver3.html
  .stage-stamp {
    display: inline-block;
    margin: 0 auto;
    padding: 0 12px;
    transform: rotate(-20deg);
    opacity: .7;
    filter: blur(1.3px);

    border-radius: 20px;
    border-width: 6px;
    border-color: #ef3e42;
    border-style: solid;
    border-image: url(/@/lib/core/assets/images/grunge-stamp-360x360.png) 30;

    color: #ef3e42;
    text-transform: uppercase;
    font-family: 'Courier New', CourierNew, serif;
    font-size: 22px;
    font-weight: bold;
    line-height: normal;
    height: auto !important; // para evitar refazer o layout da navbar.vue usamos o !important
  }
</style>


<template lang="pug">
  span.stage-stamp(v-if="show") {{ labelText }}
</template>


<script>
  export default {
    props: ['label'],

    computed: {
      labelText() {
        let label = this.label || app.stage || '?'
        return label.toUpperCase()
      },

      show() {
        return !app.stageIsProduction
      }
    }
  }
</script>
