import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// Bootstrap
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignInAlt, faHome, faSave, faCrosshairs, faUser, faBars, faPlus, faArrowLeft, faSearch, faEye, faEyeSlash, faEdit, faTimesCircle, faFileExcel, faDownload, faSync, faComment } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSignInAlt, faHome, faSave, faCrosshairs, faUser, faBars, faPlus, faArrowLeft, faSearch, faEye, faEyeSlash, faEdit, faTimesCircle, faFileExcel, faDownload, faSync, faComment)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue Select 
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
