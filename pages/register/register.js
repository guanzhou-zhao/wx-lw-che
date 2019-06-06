// pages/register/register.js
//获取应用实例
const app = getApp()
wx.cloud.init()
var buttonTextApplied = '修改留言（申请已提交）'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    buttonText: '申请进入'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("register.js onload  " + JSON.stringify(app.globalData.validateUserResult))
    this.setData({
      ...app.globalData.validateUserResult,
    })
    if (app.globalData.validateUserResult.userInfo) {
      this.setData({
        msg: app.globalData.validateUserResult.userInfo.msg,
        hasUserInfo: true,
        buttonText: buttonTextApplied,
      })
    }
    if (app.globalData.validateUserResult.isAuthUser) {
      wx.redirectTo({
        url: '/pages/che/che',
      })
    }

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
  getUserInfo: function(e) {
    app.globalData.userInfo = {
      ...app.globalData.userInfo,
      ...e.detail.userInfo
    }
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...e.detail.userInfo
      },
      hasUserInfo: true
    })
    console.log("register.js getUserInfo() this.data: " + JSON.stringify(this.data))
  },
  getAuth: function(e) {
    var that = this
    if (!this.data.userInfo.avatarUrl) {
      this.setData({
        hasUserInfo: false
      })
      wx.showToast({
        title: '请点击“获取头像昵称”按钮',
        icon: 'none',
        duration: 3000
      });
    } else {
      console.log('createOrUpdateApply that.data' + JSON.stringify(that.data))
      wx.cloud.callFunction({
        name: 'createOrUpdateApply',
        data: {
          myUserInfo: that.data.userInfo,
          isAppliedUser: that.data.isAppliedUser
        }
      }).then(res => {
        console.log('register.js getAuth() createOrUpdateApply():: ' + JSON.stringify(res))
        var toastMsg = '新留言已提交'
        if (res.result.newUser.hasOwnProperty('_id')) {
          this.setData({
            userInfo: {
              ...this.data.userInfo,
              _id: res.result.newUser._id
            }
          })
          toastMsg = '申请已提交'
        }
        wx.showToast({
          title: toastMsg,
          icon: 'none',
          duration: 3000
        })
        that.setData({
          buttonText: buttonTextApplied
        })
      })
    }
  },
  setMsg: function(e) {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        msg: e.detail.value
      }
    })
  }
})