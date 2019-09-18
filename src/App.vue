<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
    this.checkSession()
    // this.getUserInfo()
    // mpvue.cloud.callFunction({
    //   name: 'sum',
    //   data: {
    //     a: 17,
    //     b: 19
    //   }
    // }).then(console.log)
  },
  methods: {
    checkSession () {
      mpvue.checkSession({
        success () {
          console.log('success')
        },
        fail () {
          mpvue.login({
            success (res) {
              if (res.code) {
                // 获取code
                const code = res.code
                console.log('successff', code)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    },
    getUserInfo () {
      var that = this
      // 获取用户信息
      mpvue.getUserInfo({
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
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
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
