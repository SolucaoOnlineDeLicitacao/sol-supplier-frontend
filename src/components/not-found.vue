<!--
<doc lang="markdown">
  Página 404
</doc>
-->

<style scoped lang="scss">
</style>


<template lang="pug">

  .component.not-found.text-center
    h1 {{ $t('.heading') }}
    p  {{ $t('.content') }}
    router-link(:to="{ name: 'home' }") {{ $t('.backToHome') }}

</template>


<script>

  export default {
    data() {
      return {
        i18nScope: 'components.not-found'
      }
    }
  }

</script>
