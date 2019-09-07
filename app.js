//app.js
wx.cloud.init()
App({
  onShow: function() {
    
  },
  onLaunch: function() {
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
      console.log(`call listUser() env ${res.result.env}`)
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

      that.globalData.validateUserResult = res.result.validateResult
      that.globalData.userInfo = res.result.validateResult.userInfo
      console.log(`validateUser() result ${JSON.stringify(res.result)}`)
      if (res.result.validateResult.isAuthUser) {
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