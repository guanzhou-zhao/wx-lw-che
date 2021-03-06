const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const validateUser = require('../../utils/validateUser.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cheList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    validateUser.isAdmin(app)
    this.setData({
      cheList: []
    })
    var that = this
    wx.cloud.callFunction({
      name: 'listChe',
      data: {
        validateUserResult: app.globalData.validateUserResult
      },
      success(res) {
        
        var cheList = res.result.data
        for (var i = 0; i < cheList.length; i++) {
          cheList[i].cheString = JSON.stringify(cheList[i])
        }
        that.setData({
          cheList
        })
      },
      fail(res) {
        console.log('fail to get che list' + JSON.stringify(res))
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})