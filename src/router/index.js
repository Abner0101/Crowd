import Vue from 'vue'
import Router from 'vue-router'
import Mappage from '@/components/Mappage'
import Login from '@/components/login/login'


Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: '登录页',
        redirect:'/login'
    },
    {
        path: '/Mappage',
        name: 'Mappage',
        component: Mappage
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
    
  ]
})
