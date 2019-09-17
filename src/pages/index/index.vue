<template>
  <div>
    <!-- <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">获取权限</button> -->
    <!-- <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">授权登录</button>
    <view v-else>请升级微信版本</view> -->
    
    <i-toast id="toast" />
    <!-- <img src="/static/images/user.png"/> -->
    <div v-show="needBinded">
      <i-panel title="绑定学生">
        <i-input :value="bindCid" title="学号" type="number" autofocus placeholder="学号" maxlength="32" @change="cidInput"/>
        <i-input :value="bindName" title="姓名" placeholder="姓名" maxlength="32" @change="nameInput"/>
        <i-button type="primary" @click="handleClick">确定</i-button>
      </i-panel>
    </div>
    <view id="divmain" v-show="!needBinded">
    <i-card :i-class="user.role" :title="user.wxUser.nickName" full="ture" :thumb="user.wxUser.avatarUrl" :extra="user.role">
    <view slot="content">{{user.student.cid+'-'+user.student.name}}
      <i-button i-class="adminbtn" v-if="bpose" type="primary" size="small" inline="true" @click="handlePose">发布</i-button>
      <i-button i-class="adminbtn" v-if="buserManage" type="primary" size="small" inline="true" @click="handleUserManage">用户管理</i-button>
    </view>
    </i-card>
     <!-- <i-row>
      <i-col span="5" i-class="col-class"><i-button type="ghost" size="small" inline="true" @click="handleClick">发布</i-button></i-col>
      <i-col span="5" i-class="col-class"><i-button type="ghost" size="small" inline="true" @click="handleClick">用户管理</i-button></i-col>
     </i-row> -->
    </view>
  </div>
</template>

<script>
// import { Toast } from '../../../dist/wx/iview/base/index'
const { $Toast } = require('../../../dist/wx/iview/base/index')
// import card from '@/components/card'

export default {
  data () {
    return {
      canIUse: mpvue.canIUse('button.open-type.getUserInfo'),
      needBinded: false,
      bindCid: '',
      bindName: '',
      user: {
        student: {},
        wxUser: {},
        role: ''
      },
      pose: 'pose',
      userManage: 'userManage',
      permission: []
    }
  },
  computed: {
    bpose: function () {
      return this.permission.includes(this.pose)
    },
    buserManage: function () {
      return this.permission.includes(this.userManage)
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
        this.user = result.user[0]
        this.getUserRole()
        // this.$set(this.user, 'nickName', this.user.wxUser.nickName)
        // this.$set(this.user, 'avatarUrl', this.user.wxUser.avatarUrl)
        // this.$set(this.user, 'name', this.user.student.name)
        // this.$set(this.user, 'cid', this.user.student.cid)
        // this.$set(this, 'user', result.user[0])
        // console.log('exit', this.user)
      }
      // this.$nextTick(() => {
      //   this.$forceUpdate()
      // })
    })
  },

  methods: {
    cidInput (e) {
      this.$set(this, 'bindCid', e.target.detail.value)
    },
    nameInput (e) {
      this.$set(this, 'bindName', e.target.detail.value)
    },
    getUserRole () {
      const db = wx.cloud.database()
      // console.log('this.user.openid', this.user.openid)
      db.collection('admins')
        .where({
          userOpenId: this.user.openid
        })
        .get().then(
          res => {
            if (res.data && res.data.length) {
              this.user.role = res.data[0].role
              this.permission.push(this.pose)
              if (this.user.role === 'root') {
                this.permission.push(this.userManage)
              }
            } else {
              this.user.role = 'user'
            }
          }
        ).catch((err) => {
          console.log('err', err)
          this.user.role = 'user'
        })
    },
    // bindViewTap () {
    //   const url = '../logs/main'
    //   if (mpvuePlatform === 'wx') {
    //     mpvue.switchTab({ url })
    //   } else {
    //     mpvue.navigateTo({ url })
    //   }
    // },
    // getUserInfoClick () {
    // // console.log('click事件首先触发')
    // },
    // bindGetUserInfo (e) {
    // // console.log('回调事件后触发')
    // // const self = this
    //   if (e.mp.detail.userInfo) {
    //     console.log('用户按了允许授权按钮')
    //     let { encryptedData, userInfo, iv } = e.mp.detail
    //     console.log('encryptedData', encryptedData, userInfo, iv)
    //   } else {
    //     // 用户按了拒绝按钮
    //     console.log('用户按了拒绝按钮')
    //   }
    // },
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
      // this.user.student = null
      // this.user.student = stu
      // this.$set(this.user, 'student', stu)
      Object.assign(this.user.student, stu)
      // this.$set(this.user.student, 'name', stu.name)
      // this.$forceUpdate()
      // this.user.student.name = null
      // this.user.student.name = stu.name
      this.user.date = new Date()
      // this.user.wxUser.nickName = this.globalData.userInfo.nickName
      // this.user.wxUser.avatarUrl = this.globalData.userInfo.avatarUrl
      // this.user.wxUser = null
      // this.$set(this.user.wxUser, 'nickName', this.globalData.userInfo.nickName)
      // this.$set(this.user.wxUser, 'avatarUrl', this.globalData.userInfo.avatarUrl)
      // this.user.wxUser = this.globalData.userInfo
      // this.$set(this.user, 'wxUser', this.globalData.userInfo)
      // this.$set(this, 'wxUser', this.globalData.userInfo)
      // this.$forceUpdate()
      Object.assign(this.user.wxUser, this.globalData.userInfo)
      // for (const key in this.globalData.userInfo) {
      //   console.log('this.user.wxUser.', key)
      //   this.user.wxUser[key] = this.globalData.userInfo[key]
      // }
      // this.getUserRole()
      // this.needBinded = false
      // this.$set(this.user, 'temp', 1)
      // console.log('this.user.wxUser.nickName', this.globalData.userInfo, this.user.wxUser.nickName)
      // this.needBinded = false
      // this.$set(this.user.wxUser, 'avatarUrl', this.globalData.userInfo.avatarUrl)
      // this.$forceUpdate()
      // this.user.wxUser.avatarUrl = null
      // this.user.wxUser.avatarUrl = this.globalData.userInfo.avatarUrl
      // this.$forceUpdate()
      const db = wx.cloud.database()
      db.collection('users')
        .add({
          data: this.user
        }).then(res => {
          $Toast({
            content: '绑定成功',
            type: 'success'
          })
          this.getUserRole()
          this.needBinded = false
          this.$set(this.user, 'temp', 1)
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
    handlePose (ev) {
      const url = '../postNotice/main'
      mpvue.navigateTo({ url })
    },
    handleUserManage (ev) {
      const url = '../userManage/main'
      mpvue.navigateTo({ url })
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

<style>
.adminbtn {
  /* width: 32px; */
  height: 32px !important;
  line-height: 25px !important;;
  margin: 2px !important;;
}
.root .i-card-header-extra, .manager .i-card-header-extra, .user .i-card-header-extra{
  flex: none;
  font-size: 0;
  width: 32px;
  height: 32px;
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
}
.root .i-card-header-extra {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAgCAYAAAB6kdqOAAAC+ElEQVRYR9VYsXLTQBDdlR2SDvMFIQU1KRkiDzYyffwFiZtEqpJ8AckXxFSSaRK+gFBjje2RYOhiviDmCzBlJpaWOVkyOt0J6yIDw3WWdvfe7e57tzJCyeXa+ikgHhHQuEKzTtP6MikTEss4M1/XqX8HgFoUB8MT4/BTt0zM8oBsfQKImxEIgo5heZf/FNBHW28g4jFiONQerF02O8NpaUAD+9ljFqRs/e8DZHDRqNFd8PTlgTeKqu72do6BtPN5yunMsPxT1cCDt8+3mwefx8p+F41aeBuwHmRrapjeI3RtfQiIL2JAI8PyGyqB2QnD2+CGEDqtQ+9KxZeVW0McJD5aMHuCrqN3AfBo/pDeGKZ/rBK0b9cvEWEPACaG6W2p+LJWCXHtZs4H+NEyvVrEsqgxNayVPeF9aB+BgrWGtlG5YoQoRfu+o18j4HYqK1NtvbJVhmkcINeu7xfVkVihXwslUiAGIwME4TTNbh6Qo3cJYLOyXu387pRx7a8XCp1BpdHd1jIJYYcHhPOQqP3K8odJCB5QLAHxvdTOC9p39AEC5rKRCN61LG9f1uAxK5nMRO8N0+MwcD8yNJxqWtDM6ku/V99FgvfL2BQSNdMnZ/asREGoXSz6juibYfmRKEszFKNPhCoSKyA4Sfoq0Zy8UqUDE9CwZfrN5FlSIs6XSNA9gWV9p86o95DLANKpceif8Zq1LEcALEvVjeo4vA0WJeK9RN0TAHHKnfImoCsE3F0Og7OYENA0Iw2p+ojjigiIU27F7RXNZX0mAkpftoobqJrL5EEAlL3wVDdRsc9SnvkKgCRMU9mjuK2EYVJA7KGUacW3KmRJAB9apieQRHq55jGt0E5FjXLuPCmg1IxTNLyyHSG0ZeNOXobYt5Z4kytvm+8go3xuD/0NpskYlgsoPVquMCm/Qkku1eRlqYnxT4D9fwD1ezt7CMjNKqvKSBjCKDsrLS2Z69RpVQDEOPTVMP30x8HCJLdkbLqbBdr8X40VryrMJnnj8U+jsmjhkVaUFAAAAABJRU5ErkJggg=="); 
}
.manager .i-card-header-extra {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAgCAYAAAB6kdqOAAAC90lEQVRYR8VXS3LaQBDtFkiQbEIWqQJtbBZOiVV8g+AbmBPYnMD4BMEnwDlByAlCTmA4QchKqmRhspGo8iLKJmCB1akRyNZnhBiGJFpR0vSbN9393jQIko9+b3QB8YKAxqRCe4rWRAYSZYJZrO41fgJAhf0mgEtHM69lMKUJ1e4bE0Q4YCR8oPZUs/r/lVB1YTTRxw4gDGfqrO/ixJUmVCXjkIHI1n8XIhU6rJSX5TdT1RqxeKx5jQ4C9AIwoiu7ZHVFgV95R8d32vexaBwj83zxjPUge1xbM19izTOGCPh21ZQ0cjSrKQK8Br0F5aFtF78NRGJZuRXCmzBmoXpHLEPXCHCxVsl7RzM7IqC6Z/QB8IyIJk7JqovEslZRFni7iqFftmZVApUFTNGvyJ5wF9kH/buA5lydD5ggpGSve40vAHAcyYr7W53VZZQWI1T1jPNtfWTt0O9SJRIQBhNDQS24UXXHCLF+AoKDmTZrbzrluvYsO4FDJx9fpXqehbDDK4A9H6k1Va1hiJEkFFrA2FeplQVa84wbBNygRvpoa9Y5j+xKleUeAAbfbc2McYiXLC5DdwHLk6S/6MvXp+AXPuWpyUc6iZ6crWclUqH4Iew7IvjhlMzAlLkZShhVYFY+0GXYV4+ek1GqKDABDR3NOgnfhSWKlpnneymV6Z7hAuCLWAaQurZqXUU9Ky9D7DvL0rw4H0dLFCcNKd9LEYo6dyyYYIAIp9sQCdcws0REdtlGreERgudbHEJPzi2y+S5reX3GI/R02e6yi0AMzx5ShJIXngC+8NKk5BlAihBHacIbbROQNVlw7zKu0rbZRWANEXx2SmZKJFxCWUoT2C9/acadl5WhYMbJR5VYoTy0eOMOn9Dqv1b6JpfYPxnKkzy3qdnLf6E0nsKyCcVGyz2mZQ3Fu1TDXaQmxv1T5fjQ39hEBDMzQ1XPOFMQYrOKCPCmtT7AKDkr5ZZM9xq0LwJpHPpqaxZ3AsjMUDCAY4E7M0sTLcIkazz+A8zSXIs846yiAAAAAElFTkSuQmCC"); 
}
.user .i-card-header-extra {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADYklEQVRYR9VXS24aQRB91TO24lXICYJPEHICE8lG2QXHBzCcIHgRKzJIxhJYUbKwcwLjAyTGuwgsBZ8g3CDkBMErR4bpimpmGmN+3RMWUXqDhpnuevWq6lU1IeF6+Y7T2te7DM4ClIm2c5dAHdbqsn1M3SRHUpKPN8tBiQiHBKTm7WOg1K55n1zPdQaQKw+bIHoV+sv4CUITmiNvFWXAyBPhacxIs1Xzt11AOAEQzxXhJGIb53crqtSpUn/cQLbKqZWhrhLwRv7XjL2rundqA2EFIDEPfP09pJ35slX384sO3aoEpwKCgT60emHLCSuAXCWoAjgU2gcrKjPp+SSYkImB7sbhOGrVPNk/d9kBmNgzzlt1r2CjVN7fs8DX7ZqfXQrAVjnoiTeuMRVjo5xh9Fp1b30pALlKIJn+DICVTmPIAJCwteteejkAM0Lw8cttw6dHpb3tqBJOLjg10L9P9nfWivKcKwcNEHZdktaeAyYJgf7AV+uShAKAgQ0iNGJdKBBw/fb1WiEuxx+xWFlZswIIy9ALs/oxwCOB+fD5tgDiSIqZuvs7ayEYI1jMuPEClfn6nnpLhSA8tMJ5QF8YlbvzveIsIVodBmcAhTrhmrRWBgz6UVxDMUSfwB0gajzMSIOQH/WIBCXrDMAwwawbUTiml9DOQNVFgs3uRABkkyTZ6lCXEHkd5wD3QNRVQ9WwxXwSdmIALkqY5Jv/C8BmhbMKegPgDAMpAoU6z4wuEfckKTXU9VWNOq4sODEghgnBoTFoO5zBHYZ35AJkIYCtA85ABSeThhl8LTOgASLzIYFkTJOeMVoCBNrbWzQTzAWwdTAskKKzkREZw5irg1WvOW8mMBXCDJkdR6XKmovtYz9USqcqeKh87qpmDp8NRG23atS0AhgfwURYwCprG6vm5UQYQtIdYUPU0zSz8e+nQmCmmTC7tXr+t8aNkbhyvsXPU91xGkA56IfxS6DntqowfURYaNe8J3MZiGP3K/J+fuLYDE6+H0/oVs174PQUA7lKwP8UgBlCo5arirMyNwkDkYjpC2nVs2bEGQyMDx9R748un/LrdvGM5gNOy+X14T1yuhRnCpHowKK+n4SBuFfcEKmCkw6Mi8nKXZAnoiyLN0zp+8vnYgjR5ZV7xNRj5s4i9fwDUUbTMLgPM90AAAAASUVORK5CYII="); 
}
/* .userinfo {
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
} */
</style>

  function newFunction() {
    this.user.role='user';
  }
