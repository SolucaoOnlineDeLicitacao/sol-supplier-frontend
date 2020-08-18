<style scoped lang="scss">
  .tool {
    min-height: 100vh;
    background-color: $white;
  }

  .content {
    padding: 12px;
    color: $metallic-blue;
  }

  .logo-container {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .logo {
    max-height: 100px;
    margin-top: 50px;
  }

  h1 {
    font-size: 20px;
    font-weight: bold;
  }
  h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: bold;
  }
  p {
    margin-bottom: 1rem;
  }

</style>

<template lang="pug">
  .tool.terms
    .content.text-center.logo-container

      img(src="@/assets/images/logo.png" class="logo")
      div {{ $t('.heading') }}

    .container
      .content.terms-container

        h1 {{ $t('.title') }}
        p(v-for="n in paragraphsLength($t('.section1'))") {{ $t(`.section1.p${n}`) }}

        template(v-for="i in sectionsLength()")
          template(v-if="i > 1")
            h2 {{ $t(`.section${i}.header`) }}
            p(v-for="n in paragraphsLength($t(`.section${i}`))") {{ $t(`.section${i}.p${n}`) }}

</template>

<script>
  export default {
    data() {
      return {
        // i18n
        i18nScope: 'terms'
      }
    },
    methods: {
      sectionsLength() {
        return this.objectLength(this.$t('terms'), 'section')
      },
      paragraphsLength(section) {
        return this.objectLength(section, 'p')
      },
      objectLength(string, term) {
        return Object.keys(string).filter(key => key.includes(term)).length
      }
    }
  }
</script>
