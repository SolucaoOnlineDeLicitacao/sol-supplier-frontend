<style scoped lang="scss">

.header {
  padding: 20px 0;

  background-color: white;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
}

</style>


<template lang="pug">

  .header(:class='classes')
    .container {{ title }}


</template>


<script>
  export default {
    props: {
      title: { type: String, default: '...' },
      classes: { type: String, default: 'mb-2' }
    },

    name: 'headers',
    data () {
      return {
        loggingOut: false
      }
    }
  }
</script>
