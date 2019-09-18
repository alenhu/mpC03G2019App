// https://vuex.vuejs.org/zh-cn/intro.html
import Vue from 'vue'
import Vuex from 'vuex'
import pick from 'lodash.pick'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    mode: 'selector',
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
    }],
    pickerValueDefault: [0],
    notice: {
      noticeChooseIndex: 0,
      title: '',
      content: '',
      user: {
        openid: '',
        nickName: ''
      }
    },
    fillNotice: {
      genralNotice: (notice) => {
        notice.readeder = []
      },
      confirmNotice: (notice) => {
        notice.readeder = []
        notice.confirmeder = []
      },
      replyNotice: (notice) => {
        notice.readeder = []
        notice.replyeder = []
      },
      uploadNotice: (notice) => {
        notice.readeder = []
        notice.uploadeder = []
      }
    }
  },
  getters: {
    getNoticeTypes: function (state) {
      return state.ntyps
    },
    getNoticeDefaultIndex: function (state) {
      return state.pickerValueDefault
    },
    getNoticeMode: function (state) {
      return state.mode
    },
    getNoticeString: function (state) {
      return state.ntyps[state.notice.noticeChooseIndex].label
    },
    getNoticeTitle: function (state) {
      return state.notice.title
    },
    getNoticeContent: function (state) {
      return state.notice.content
    }
  },
  mutations: {
    chooseNoticeIndex: (state, index) => {
      const obj = state
      obj.notice.noticeChooseIndex = index
    },
    setNoticeTitle: (state, value) => {
      const obj = state
      obj.notice.title = value
    },
    setNoticeContent: (state, value) => {
      const obj = state
      obj.notice.content = value
    },
    setUser: (state, value) => {
      const obj = state
      for (const key in obj.notice.user) {
        obj.notice.user[key] = value[key]
      }
    }
  },
  actions: {
    chooseNoticeIndex (context, index) {
      context.commit('chooseNoticeIndex', index)
    },
    setNoticeTitle (context, value) {
      context.commit('setNoticeTitle', value)
    },
    setNoticeContent (context, value) {
      context.commit('setNoticeContent', value)
    },
    setUser (context, value) {
      // console.log('value', value)
      context.commit('setUser', value)
    },
    poseNotice (context) {
      // console.log(context.state.notice, getApp().globalData.user)
      const notice = pick(context.state.notice, ['title', 'content', 'user'])
      notice.type = context.state.ntyps[context.state.notice.noticeChooseIndex].value
      notice.ctime = new Date()
      context.state.fillNotice[notice.type](notice)
      console.log('notice', notice)
      const db = wx.cloud.database()
      return db.collection('notices')
        .add({
          data: notice
        })
    }
  }
})

export default store
