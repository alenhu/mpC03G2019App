<template>
  <!-- <div @click="clickHandle">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <img class="userinfo-avatar" src="/static/images/user.png" background-size="cover" />

      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" :value="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form>

    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>

    <div class="all">
        <div class="left">
        </div>
        <div class="right">
        </div>
    </div>
  </div> -->
  <div>
    <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">获取权限</button>
    <i-toast id="toast" />
    <div v-show="needBinded">
      <i-panel title="绑定学生">
        <i-input :value="bindCid" title="学号" type="number" autofocus placeholder="学号" maxlength="32" @change="cidInput"/>
        <i-input :value="bindName" title="姓名" placeholder="姓名" maxlength="32" @change="nameInput"/>
        <i-button type="primary" @click="handleClick">确定</i-button>
      </i-panel>
    </div>
    <div v-show="!needBinded">
      <p>main</p>
    </div>
  </div>
</template>

<script>
// import { Toast } from '../../../dist/wx/iview/base/index'
const { $Toast } = require('../../../dist/wx/iview/base/index')
// import card from '@/components/card'

export default {
  data () {
    return {
      needBinded: false,
      bindCid: '',
      bindName: '',
      user: {}
    }
  },
  mounted () {
    const that = this
    mpvue.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      const {result} = res
      that.user.appid = result.appid
      that.user.openid = result.openid
      // console.log('result', result)
      if (result.user.length === 0) {
        this.needBinded = true
      } else {
        this.user.student = result.user[0]
      }
    })
  },

  methods: {
    cidInput (e) {
      this.$set(this, 'bindCid', e.target.detail.value)
    },
    nameInput (e) {
      this.$set(this, 'bindName', e.target.detail.value)
    },
    // bindViewTap () {
    //   const url = '../logs/main'
    //   if (mpvuePlatform === 'wx') {
    //     mpvue.switchTab({ url })
    //   } else {
    //     mpvue.navigateTo({ url })
    //   }
    // },
    getUserInfoClick () {
    // console.log('click事件首先触发')
    },
    bindGetUserInfo (e) {
    // console.log('回调事件后触发')
    // const self = this
      if (e.mp.detail.userInfo) {
        console.log('用户按了允许授权按钮')
        let { encryptedData, userInfo, iv } = e.mp.detail
        console.log('encryptedData', encryptedData, userInfo, iv)
      } else {
        // 用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    },
    getStudentByNameAndCid (name, cid) {
      const db = wx.cloud.database()
      return db.collection('students')
        .where({
          cid,
          name
        }).get()
    },
    bindStudentToUser (stu) {
      // const that = this
      this.user.student = stu
      console.log('result', this.user)
      const db = wx.cloud.database()
      this.user.date = new Date()
      // this.user.location = new db.Geo.Point(23, 113)
      db.collection('users')
        .add({
          data: this.user
        }).then(res => {
          $Toast({
            content: '绑定成功',
            type: 'success'
          })
          this.needBinded = false
        }).catch((err) => {
          console.log('err', err)
          $Toast({
            content: '绑定异常,请重试',
            type: 'error'
          })
        })
    },
    handleClick (ev) {
      console.log('clickHandle:', this.bindCid, this.bindName)
      if (!this.bindCid) {
        $Toast({
          content: '学号不能为空',
          type: 'error'
        })
      }
      if (!this.bindName) {
        $Toast({
          content: '姓名不能为空',
          type: 'error'
        })
      }
      this.getStudentByNameAndCid(this.bindName, this.bindCid).then(res => {
        if (res.data.length) {
          this.bindStudentToUser(res.data[0])
        } else {
          $Toast({
            content: '不存在该学生信息，请检查学号姓名是否正确',
            type: 'error'
          })
        }
      })
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
      mpvue.cloud.callFunction({
        name: 'login'
      }).then((res) => {
        const {result} = res
        if (result.user.length === 0) {
          const url = '../bindStudent/main'
          mpvue.navigateTo({ url })
        }
      })
      // mpvue.cloud.callFunction({
      //   name: 'login'
      // }).then((res) => {
      //   const {result} = res
      //   console.log('clickHandle:', result.user.length)
      //   if (result.user.length === 0) {
      //     const url = '../logs/main'
      //     if (mpvuePlatform === 'wx') {
      //       mpvue.switchTab({ url })
      //       console.log('switchTab:', url)
      //     } else {
      //       mpvue.navigateTo({ url })
      //     }
      //   }
      // })
      // const db = wx.cloud.database({env: 'sdc03g2019-qm23k'})
      // db.collection('students').get().then(
      //   res => {
      //     console.log('clickHandle:', res)
      //   })
      // wx.cloud.callFunction({
      //   name: 'sum',
      //   data: {
      //     a: 12,
      //     b: 19
      //   }
      // }).then(console.log)
      // throw {message: 'custom test'}
    }
  },

  created () {
    //      let app = getApp()

  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all{
  width:7.5rem;
  height:1rem;
  background-color:blue;
}
.all:after{
  display:block;
  content:'';
  clear:both;
}
.left{
  float:left;
  width:3rem;
  height:1rem;
  background-color:red;
}

.right{
  float:left;
  width:4.5rem;
  height:1rem;
  background-color:green;
}
</style>
