// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    notice: {},
    reader: {},
    ntyps: [{
      value: 'genralNotice',
      label: '一般通知'
    }, {
      value: 'confirmNotice',
      label: '确认通知'
    }, {
      value: 'replyNotice',
      label: '回复通知'
    }, {
      value: 'uploadNotice',
      label: '上传通知'
    }]
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
    },
    checkNoticeType: (state) => (ptype) => {
      console.log(ptype === state.notice.type)
      return ptype === state.notice.type
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
