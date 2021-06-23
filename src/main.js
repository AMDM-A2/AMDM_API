import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueApexCharts from 'vue-apexcharts'
import './registerServiceWorker'
import VueLuxon from 'vue-luxon'
import router from './router'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueApexCharts)
Vue.use(VueLuxon)
Vue.use(VueCookies)

Vue.component('apexchart', VueApexCharts)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
