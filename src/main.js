import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/fonts/iconfont.css' //导入字体图标
import './assets/css/global.css' //导入全局样式

import axios from 'axios' //导入axios，写入vue组件，设置基础路径
axios.defaults.baseURL = 'http://81.70.91.168:8888/api/private/v1/'
axios.interceptors.request.use((config) => {      //请求拦截器函数
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token') //为请求头对象添加Token验证的Authorization字段
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
