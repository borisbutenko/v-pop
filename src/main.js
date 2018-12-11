import Vue from 'vue'
import App from './App'
import pop from './pop'

Vue.config.productionTip = false
Vue.directive('pop', pop)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
