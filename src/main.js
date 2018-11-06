import Vue from 'vue'
import App from './App.vue'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueMaterial from 'vue-material'

Vue.config.productionTip = false

Vue.use(VueMaterial)

new Vue({render: h => h(App)}).$mount('#app')
