//app.js
wx.cloud.init({ env: 'lw-che-product-6q033'})
const db = wx.cloud.database()
App({
  onShow: function() {
    if (!this.globalData.hasValidated) {

      this.validateUser()
    }
  },
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.validateUser()
    this.getAllUsers()
    this.globalData.hasValidated = true
  },
  globalData: {
    userInfo: null,
    isAuthUser: false,
    hasValidated: false
  },
  getAllUsers: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'listUser'
    }).then((res)=>{
      that.globalData.allUsers = res.result.users.reduce((pv, cv)=> {
        pv[cv.openId] = cv
        return pv
      }, {})
    })
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

      that.globalData.validateUserResult = res.result
      that.globalData.userInfo = res.result.userInfo
   
      if (res.result.isAuthUser) {
        wx.switchTab({
          url: '/pages/tools/index'
        })
      } else {
        wx.redirectTo({
          url: '/pages/user/register'
        })
      }
    })



  }
})