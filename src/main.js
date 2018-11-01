import Vue from "vue"
import App from "./App.vue"
import DropDown from "./components/drop-down.vue"
import Multiselect from "vue-multiselect"
import VModal from "vue-js-modal"

Vue.config.productionTip = false

Vue.component("drop-down", DropDown)
Vue.component("multiselect", Multiselect)
Vue.use(VModal)

new Vue({
  render: h => h(App)
}).$mount("#app")
