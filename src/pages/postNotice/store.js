// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    ntyps: [{
      id: 1,
      name: '一般通知'
    }, {
      id: 2,
      name: '确认通知'
    }, {
      id: 3,
      name: '回复通知'
    }, {
      id: 4,
      name: '上传通知'
    }]
  },
  getters: {
    getNoticeTypes: function (state) {
      return state.ntyps
    }
  },
  mutations: {
    increment: (state) => {
      const obj = state
      obj.count += 1
    },
    decrement: (state) => {
      const obj = state
      obj.count -= 1
    }
  }
})

export default store
