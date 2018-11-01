import Vue from "vue"
import App from "./App.vue"
import DropDown from "./components/drop-down.vue"
import Multiselect from "vue-multiselect"
import VModal from "vue-js-modal"
import "vue-material/dist/vue-material.min.css"
import "vue-material/dist/theme/default.css"
import "vue-multiselect/dist/vue-multiselect.min.css"
import VueMaterial from "vue-material"

Vue.config.productionTip = false

Vue.component("drop-down", DropDown)
Vue.component("multiselect", Multiselect)
Vue.use(VModal)

Vue.use(VueMaterial)

new Vue({
  render: h => h(App)
}).$mount("#app")
