module.exports = function() {
  var app = getApp()
  if (!app.globalData.userInfo || app.globalData.userInfo.tag != 'Y') {
    console.log('utils/validateUser fail')
    wx.redirectTo({
      url: '/pages/user/register'
    })
  } else {
    console.log('utils/validateUser pass')
  }
}
