import Vue from 'vue'
import VueRouter from 'vue-router'
import Datas from '../views/Datas.vue'
import Home from '@/views/Home'
import AlertConfig from '@/views/AlertConfig'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stats',
    name: 'Datas',
    component: Datas
  },
  {
    path: '/alertsconfig',
    name: 'AlertConfig',
    component: AlertConfig
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
