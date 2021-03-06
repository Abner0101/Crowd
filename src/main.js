// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/ol_v5.3.0.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'

 //引入echart
 import echarts from 'echarts'
 import 'echarts/theme/macarons.js'
 //将echarts引入到vue的原型中
 Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
