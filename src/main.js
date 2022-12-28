import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入字体图标样式
import './assets/font/iconfont.css'
// 引入全局样式文件
import "./assets/css/global.less"
// 请求基准路径配置
axios.defaults.baseURL='http://127.0.0.1:8888/api/'
// 将axios挂载到Vue原型对象上
// 在别的组件中 this.$http使用
Vue.prototype.$http=axios
Vue.config.productionTip = false


// 将全局的echarts对象挂载到Vue的原型对象上
// 在别的组件中直接this.$echarts就可以使用
Vue.prototype.$echarts = window.echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
