<template>
  <div>
    <!-- {{noticeContent}}+{{noticeType}} -->
    <i-panel :title="noticeTitle">
      <i-input value="" title="收货人" autofocus placeholder="名字" />
    </i-panel>
  </div>
</template>

<script>
// Use Vuex
import store from './store'

export default {
  computed: {
    noticeTitle: function () {
      // console.log(store.getters['getNoticeTitle'])
      return store.getters['getNoticeTitle']
    },
    noticeContent: function () {
      return store.getters['getNoticeContent']
    },
    noticeType: function () {
      return store.getters['getNoticeType']
    }
  },
  onLoad (options) {
    // console.log('options', options)
    store.dispatch('setReader', {openid: this.globalData.user.openid, nickName: this.globalData.user.wxUser.nickName})
    store.dispatch('setNotice', JSON.parse(options.notice))
  },

  methods: {
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
