import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
wx.cloud.init({
  env: 'sdc03g2019-qm23k',
  traceUser: true
})
const app = new Vue(App)
app.$mount()
console.log('app e')
Vue.prototype.globalData = getApp().globalData
