module.exports = function() {
  var app = getApp()
  if (!app.globalData.validateUserResult || !app.globalData.validateUserResult.isAuthUser) {
    console.log('utils/validateUser fail')
    wx.redirectTo({
      url: '/pages/user/register'
    })
  } else {
    console.log('utils/validateUser pass')
  }
}
