// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    notice: {},
    reader: {}
  },
  getters: {
    getNoticeType: function (state) {
      return state.notice.type
    },
    getNoticeTitle: function (state) {
      return state.notice.title
    },
    getNoticeContent: function (state) {
      return state.notice.content
    }
  },
  mutations: {
    setNotice: (state, value) => {
      const obj = state
      obj.notice = Object.assign({}, value)
      // console.log('obj.notice', obj.notice)
    },
    setReader: (state, value) => {
      const obj = state
      obj.reader = Object.assign({}, value)
      // console.log('obj.reader', obj.reader)
    }
  },
  actions: {
    setReader: ({commit}, value) => {
      commit('setReader', value)
    },
    setNotice: ({commit}, value) => {
      commit('setNotice', value)
    }
  }
})

export default store
