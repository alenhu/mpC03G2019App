<template>
  <div>
    <p>
      {{title}}
    </p>
  </div>
</template>

<script>
export default {
  props: ['text', 'length'],
  computed: {
    title: function () {
      // console.log('text', this.text, this.text.length, this.length)
      if (this.text.length > this.length) {
        return `${this.text.substring(0, this.length)}...`
      }
      // console.log('text', this.text)
      return this.text
    }
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
