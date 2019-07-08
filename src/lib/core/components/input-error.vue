<!--
<doc lang="markdown">
  ## Uso
  ```pug
    input(
      type="text",
      name="user[name]",
      v-model="user.name"
    )
    input-error(:message="errors.name")
  ```
  -> Exibe mensagem "não é válido", "não pode ficar em branco", ...


  ## Avançado
    Interpolando o "nome" do atributo na mensagem de erro também, usando a prop
  `:attribute`

  ```pug
    input(
      type="text",
      name="user[name]",
      v-model="user.name"
    )
    input-error(:message="errors.name", :attribute="$t('models.user.attributes.name')")
  ```
  -> Exibe mensagem "Nome não é válido", "Nome não pode ficar em branco", ...
</doc>
-->

<style scoped lang="scss">
  .error {
    display: block;
    font-size: 12px;
    color: #FF0000;
  }
</style>


<template lang="pug">
  span.error(v-if="message") {{ messageText }}
</template>


<script>
  export default {
    props: ['message', 'attribute'],

    computed: {
      messageText() {
        const attr = this.attribute || ''
        return `${attr} ${this.message}`.trim()
      }
    }
  }
</script>
