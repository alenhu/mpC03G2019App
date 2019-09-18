<template>
  <div>
    <!-- <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">获取权限</button> -->
    <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">授权登录</button>
    <!-- <view v-else>请升级微信版本</view> -->
    
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
    <i-card :i-class="user.role" :title="user.wxUser.nickName" full="ture" :thumb="user.wxUser.avatarUrl||defaultAvatarUrl" :extra="user.role">
    <view slot="content">{{user.student.cid+'-'+user.student.name}}
      <i-button i-class="adminbtn"  type="primary" size="small" inline="true" @click="handleHistoryPose">历史</i-button> 
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
import { $Toast } from '../../../static/iview/base/index'
// const { $Toast } = require('../../../dist/wx/iview/base/index')
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
      permission: [],
      defaultAvatarUrl: 'data:image/png;base64,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'
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
        this.canIUse = false
        this.globalData.userInfo = userInfo
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
    handleHistoryPose (ev) {

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
    },
    getUserInfo () {
      const that = this
      // 获取用户信息
      mpvue.getUserInfo({
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          that.canIUse = false
        // console.log('that.data.userInfo', that.data.userInfo)
        // that.$set(that,
        //   'userInfo', that.data.userInfo
        // )
        },
        fail: function (res) {
          console.log('kkkkkkkkkkkk', res)
        }
      })
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style>
.adminbtn {
  /* width: 32px; */
  height: 32px !important;
  line-height: 27px !important;;
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
