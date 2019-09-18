<template>
  <div>
    <i-toast id="toast" />
    <i-panel
      i-class="poseNotice"
      title="发布通知"
    >
    </i-panel>
    <i-row>
      <i-col
        span="6"
        i-class="col-class noticeTypeTitle"
      >通知类型:</i-col>
      <i-col
        span="8"
        i-class="col-class"
      ><button
          size="mini"
          @click="showPicker"
        >{{noticeType}}</button></i-col>
      <i-col
        span="10"
        i-class="col-class"
      ></i-col>
    </i-row>
    <i-row>
      <i-col
        span="6"
        i-class="col-class noticeTypeTitle"
      >标题:</i-col>
    </i-row>
    <i-row>
      <i-col
        span="24"
        i-class="col-class"
      >
        <i-input
          :value="noticeTitle"
          mode="wrapped"
          type="text"
          placeholder="标题"
          @change="titleInput"
          maxlength="100"
        />
      </i-col>
    </i-row>
    <i-row>
      <i-col
        span="6"
        i-class="col-class noticeTypeTitle"
      >内容:</i-col>
    </i-row>
    <i-row>
      <i-col
        span="24"
        i-class="col-class"
      >
        <i-input
          :value="noticeContent"
          mode="wrapped"
          type="textarea"
          placeholder="内容"
          @change="contentInput"
        />
      </i-col>
    </i-row>
    <i-row>
      <i-col
        span="24"
        i-class="col-class"
      >
        <i-button
          type="primary"
          @click="handlePoseClick"
        >发布</i-button>
      </i-col>
    </i-row>

    <mpvue-picker
      ref="mpvuePicker"
      :mode="mode"
      :pickerValueDefault="pickerValueDefault"
      @onChange="onChange"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
      :pickerValueArray="pickerValueArray"
    ></mpvue-picker>
  </div>
</template>

<script>
// Use Vuex
import { $Toast } from '../../../static/iview/base/index'
import store from './store'
import mpvuePicker from 'mpvue-picker'
export default {
  computed: {
    pickerValueArray () {
      return store.getters['getNoticeTypes']
    },
    pickerValueDefault () {
      return store.getters['getNoticeDefaultIndex']
    },
    mode () {
      return store.getters['getNoticeMode']
    },
    noticeType () {
      return store.getters['getNoticeString']
    },
    noticeTitle () {
      return store.getters['getNoticeTitle']
    },
    noticeContent () {
      return store.getters['getNoticeContent']
    }
  },
  components: {
    mpvuePicker
  },
  mounted () {
    store.dispatch('setUser', {openid: this.globalData.user.openid, nickName: this.globalData.user.wxUser.nickName})
  },
  methods: {
    showPicker () {
      this.$refs.mpvuePicker.show()
    },
    onConfirm (e) {
      store.dispatch('chooseNoticeIndex', e.index[0])
    },
    onChange (e) {
      console.log(e)
    },
    onCancel (e) {
      console.log(e)
    },
    handlePoseClick (e) {
      console.log('content', this.noticeContent, 'title', this.noticeTitle, this.globalData.user)
      if (!this.noticeTitle) {
        $Toast({
          content: '标题不能为空',
          type: 'error'
        })
        return
      }
      if (!this.noticeContent) {
        $Toast({
          content: '内容不能为空',
          type: 'error'
        })
        return
      }
      store.dispatch('poseNotice').then((res) => {
        console.log(res)
        store.dispatch('setNoticeTitle', '')
        store.dispatch('setNoticeContent', '')
        $Toast({
          content: '发布成功',
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        $Toast({
          content: '发布异常',
          type: 'error'
        })
      })
    },
    titleInput (e) {
      store.dispatch('setNoticeTitle', e.target.detail.value)
    },
    contentInput (e) {
      store.dispatch('setNoticeContent', e.target.detail.value)
    }
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
.noticeTypeTitle {
  margin-top: 5px;
  margin-left: 15px;
}
.poseNotice .i-panel-title {
  font-size: 24px !important;
}
</style>
