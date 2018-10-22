import Vue from "vue"
import App from "./App.vue"
import DropDown from "./components/drop-down.vue"
import Multiselect from 'vue-multiselect'

Vue.config.productionTip = false

Vue.component("drop-down", DropDown)
Vue.component('multiselect', Multiselect)

new Vue({
  render: h => h(App)
}).$mount("#app")
