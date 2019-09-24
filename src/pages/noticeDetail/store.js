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
    getNoticeId: function (state) {
      return state.notice._id
    },
    checkNoticeType: (state) => (ptype) => {
      // console.log(ptype === state.notice.type)
      return ptype === state.notice.type
    },
    isGenralNotice: (state) => (ptype) => {
      // console.log(ptype === state.notice.type)
      return ptype === state.ntyps[0].value
    },
    isConfirmNotice: (state) => (ptype) => {
      // console.log(ptype === state.notice.type)
      return ptype === state.ntyps[1].value
    },
    isReplyNotice: (state) => (ptype) => {
      // console.log(ptype === state.notice.type)
      return ptype === state.ntyps[2].value
    },
    isUploadNotice: (state) => (ptype) => {
      // console.log(ptype === state.notice.type)
      return ptype === state.ntyps[3].value
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
      obj.reader = value
      console.log('obj.reader', obj.reader)
    },
    setNoticeReaded: (state, value) => {
      const obj = state
      obj.reader.readed ? obj.reader.readed.push(value) : obj.reader.readed = [value]
    }
  },
  actions: {
    setReader: ({commit}, value) => {
      commit('setReader', value)
    },
    setNotice: ({commit}, value) => {
      commit('setNotice', value)
    },
    setNoticeReaded: ({commit, state}, value) => {
      console.log('setNoticeReaded', state.reader._id)
      // const db = wx.cloud.database()
      // const _ = db.command
      // const opertion = _.push([state.reader._id])
      mpvue.cloud.callFunction({
        name: 'queryUpdate',
        data: {
          collectName: 'users',
          where: {_id: state.reader._id},
          // eslint-disable-next-line no-undef
          udata: [{readed: [state.reader._id]}]
        }
      }).then(console.log)
      // const str = `
      // const db = wx.cloud.database()
      // const _ = db.command
      // db.collection('users')
      //   .where({
      //     _id: state.reader._id
      //   })
      //   .update({
      //     data: {
      //       reader: _.push([state.reader._id])
      //     }
      //   }).then(() => {
      //     commit('setNoticeReaded', value)
      //   }).catch((err) => {
      //     console.log(err)
      //   })`
      // evil('console.log("dddd")')
    }
  }
})

export default store
