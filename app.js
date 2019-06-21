//app.js
wx.cloud.init()
const db = wx.cloud.database()
App({
  onShow: function() {
    console.log("app.js onshow() this.globalData" + JSON.stringify(this.globalData))

  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.validateUser()
  },
  globalData: {
    userInfo: null,
    isAuthUser: false
  },
  validateUser: function() {
    var that = this


    wx.cloud.callFunction({
      name: 'validateUser'
    }).then(res => {
      /**
       * 认证用户
       * 调用云函数 validateUser 验证用户
       * res.result = {isAppliedUser, userInfo, isAuthUser}
       */

      console.log('app.js validateUser() ' + JSON.stringify(res.result))

      that.globalData.validateUserResult = res.result
      that.globalData.userInfo = res.result.userInfo
   
      if (res.result.isAuthUser) {
        wx.switchTab({
          url: '/pages/main/yongche'
        })
      } else {
        wx.redirectTo({
          url: '/pages/user/register'
        })
      }
    })



  }
})