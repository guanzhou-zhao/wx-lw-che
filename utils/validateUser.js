
module.exports = {
  validateUser(app) {
    wx.cloud.callFunction({
      name: 'validateUser'
    }).then(res => {
      app.globalData.validateUserResult = res.result.validateResult
      app.globalData.userInfo = res.result.validateResult.userInfo
      console.log('update validate info')
    })
  },
  isAuthUser(app) {
    if (!app.globalData.validateUserResult || !app.globalData.validateUserResult.isAuthUser) {
      console.log('utils/validateUser fail')
      wx.redirectTo({
        url: '/pages/user/register'
      })
    } else {
      console.log('utils/validateUser pass')
    }
  },
  isAdmin(app) {
    if (!app.globalData.validateUserResult || !app.globalData.validateUserResult.isAdmin) {
      console.log('utils/validateUser not admin')
      wx.switchTab({
        url: '/pages/main/yongche'
      })
    } else {
      console.log('utils/validateUser is admin')
    }
  }
}
