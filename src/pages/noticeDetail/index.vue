<template>
  <div>
    <!-- {{noticeContent}}+{{noticeType}} -->
    <i-panel :title="noticeTitle">
      <!-- <i-input value="" title="收货人" autofocus placeholder="名字" /> -->
    </i-panel>
    <scroll-view scroll-y="true">
      <wxParse :content="noticeContent" @preview="preview" @navigate="navigate" />
    </scroll-view>
    <view v-if="'genralNotice' === noticeType">
      <p>read</p>
    </view>
    <view v-if="'confirmNotice' === noticeType">
      <label>
        <i-button type="primary" size="small" inline="true" @click="handleHistoryPose">{{cbuttonLable}}</i-button>  
      </label>
    </view>
    <view v-if="'replyNotice'=== noticeType">
      <p>reply</p>
    </view>
    <view v-if="'uploadNotice'=== noticeType">
      <p>upload</p>
    </view>
  </div>
</template>

<script>
// Use Vuex
import wxParse from 'mpvue-wxparse'
import store from './store'

export default {
  components: {
    wxParse
  },
  data () {
    return {
      cresult: false
    }
  },
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
    },
    cbuttonLable: function () {
      if (this.cresult) {
        return '取消确认'
      } else {
        return '确认'
      }
    }
  },
  onLoad (options) {
    // console.log('options', options)
    store.dispatch('setReader', {openid: this.globalData.user.openid, nickName: this.globalData.user.wxUser.nickName})
    store.dispatch('setNotice', JSON.parse(options.notice))
  },

  methods: {
    showNotice (ptype) {
      // console.log('show', ptype)
      return store.getters['checkNoticeType'](ptype)
    }
  }
}
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
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
