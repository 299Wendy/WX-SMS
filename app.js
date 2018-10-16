//app.js
App({
  onLaunch: function () {
  // 获取用户信息
  wx.getUserInfo({
    success: res => {

      // 可以将 res 发送给后台解码出 unionId
      this.globalData.userInfo = res.userInfo
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
    }
  })
  },
  globalData: {
    userInfo: null,
    host: 'https://qasms.cn',
    // host: 'http://127.0.0.1:5000',
    token:"",
    openID:'',
    UserInfo:{
      TrueName:'',
      Role:'',
      TeamLeader:''
    },
  }
})