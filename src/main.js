import Vue from "vue"
import App from "./App.vue"
import DropDown from "./components/drop-down.vue"

Vue.config.productionTip = false

Vue.component("drop-down", DropDown)

new Vue({
  render: h => h(App)
}).$mount("#app")
