import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Registro from '../views/Registro.vue'
import CuentaActivada from '../views/CuentaActivada'
import Menu from '../views/Menu'
import Reportes from '../views/Reportes'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/registro',
      name: 'registro',
      component: Registro
    },
    {
        path: '/activar_cuenta/:id',
        name: 'activar_cuenta',
        component: CuentaActivada
    },
    {
			path: '/home',
			name: 'home',
			component: Home,
      children: [
        {
					path: '/home/menu/',
					name: 'menu',
					component: Menu
        },
        {
					path: '/home/reportes',
					name: 'reportes',
					component: Reportes,
					meta: {label: 'Reportes'}
        },
        // {
				// 	path: '/home/reportes_durante/:id',
				// 	name: 'reportes_durante',
				// 	component: Reportes,
				// 	meta: {label: 'Reportes Durante'}
				// },
      ]
    }
]

const router = new VueRouter({
  routes
})

export default router
