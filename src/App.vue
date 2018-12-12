<template>
<main id="app">
  <button v-pop="bold_text">
    <pre>v-pop="bold_text"</pre>
  </button>
  <br>
  <br>
  <button v-pop.click="bold_text">
    <pre>v-pop.click="bold_text"</pre>
  </button>
  <br>
  <br>
  <button v-pop="options">
    <pre>v-pop="options"</pre>
  </button>
  <br>
  <br>
  <button v-pop:tooltip-content.click="product_id">
    <pre>v-pop:tooltip-content.click="product_id"</pre>
  </button>
  <br>
  <br>
  <b>_vm.$data</b>:
  <pre>{{ $data }}</pre>
  <b>_vm.$data.options.content</b>:
  <pre>{{ $data.options.content }}</pre>
</main>
</template>

<script>
import TooltipContent from './components/TooltipContent'

export default {
  name: 'App',

  components: { TooltipContent },

  data() {
    return {
      hw: 'Hello World!',
      bold_text: '<b>123</b>',
      product_id: 13,
      options: {
        content: function() {
          return `<h1>${this.hw}</h1>`
        },
        trigger: 'click'
      }
    }
  }
}
</script>
