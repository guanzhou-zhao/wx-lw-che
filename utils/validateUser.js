
var app = getApp()

module.exports = {
  isAuthUser() {
    if (!app.globalData.validateUserResult || !app.globalData.validateUserResult.isAuthUser) {
      console.log('utils/validateUser fail')
      wx.redirectTo({
        url: '/pages/user/register'
      })
    } else {
      console.log('utils/validateUser pass')
    }
  },
  isAdmin() {
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
