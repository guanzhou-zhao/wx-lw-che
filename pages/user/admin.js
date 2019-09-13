// pages/admin/admin.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const validateUser = require('../../utils/validateUser.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    validateUser.isAdmin()
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.cloud.callFunction({
      name: 'listUser',
      success(res) {
        that.setData({
          users: res.result.users,
          allUsers: app.globalData.allUsers
        })
      },
      fail(res) {
        console.log(`user.admin.js onshow call listuser fail: ${JSON.stringify(res)}`)
      },
      complete: wx.hideLoading
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindBaseChange: function(e) {
    var userId = e.target.dataset.userid

    var userClicked = this.data.users[e.target.dataset.i]
    if (userClicked._id != userId) {
      wx.showToast({
        title: 'something went wrong!!',
        duration: 5000
      })
    }
    var that = this
    wx.showLoading({
      title: '处理中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        userId: userClicked._id,
        payload: {
          base: e.detail.value ? 'S' : 'N'
        }
      },
      success(res) {
        var pName = `users[${e.target.dataset.i}].base`
        that.setData({
          [pName]: e.detail.value ? 'S' : 'N'
        })
      },
      fail(res) {
        console.log(`admin.js approveApply() call fail ${JSON.stringify(res)}`)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  bindAdminchange: function(e) {
    var userId = e.target.dataset.userid

    var userClicked = this.data.users[e.target.dataset.i]
    if (userClicked._id != userId) {
      wx.showToast({
        title: 'something went wrong!!',
        duration: 5000
      })
    }
    var that = this
    wx.showLoading({
      title: '处理中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        userId: userClicked._id,
        payload: {
          tag: e.detail.value ? 'A':'Y'
        }
      },
      success(res) {
        var pName = `users[${e.target.dataset.i}].tag`
        that.setData({
          [pName]: e.detail.value ? 'A' : 'Y'
        })
      },
      fail(res) {
        console.log(`admin.js approveApply() call fail ${JSON.stringify(res)}`)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  /**
   * 
   */
  approveApply: function(event) {
    var userClicked = this.data.users[event.target.dataset.i]
    var that = this
    wx.showLoading({
      title: '处理中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        userId: userClicked._id,
        payload: {
          tag: 'Y'
        }
      },
      success(res) {
        var pName = `users[${event.target.dataset.i}].tag`
        that.setData({
          [pName] : 'Y'
        })
      },
      fail(res) {
        console.log(`admin.js approveApply() call fail ${JSON.stringify(res)}`)
      },
      complete() {
        wx.hideLoading()
      }
    })
    
  }
})