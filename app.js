//app.js
wx.cloud.init()
const validateUser = require('./utils/validateUser.js')
App({
  onShow: function() {
    validateUser.validateUser(this)
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log('new release:' + res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {

      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
  },
  onLaunch: function() {
    this.validateUser()
    this.getAllUsers()
    this.globalData.hasValidated = true
  },
  onHide: function() {},
  globalData: {
    userInfo: null,
    isAuthUser: false,
    hasValidated: false
  },
  getAllUsers: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'listUser'
    }).then((res) => {
      console.log(`env ${res.result.env.slice(0,6)}`)
      that.globalData.allUsers = res.result.users.reduce((pv, cv) => {
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
      if (res.result.validateResult.isAdmin) {
        wx.switchTab({
          url: '/pages/tools/index'
        })
      } else if (res.result.validateResult.isAuthUser) {
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