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
    buttonText: '申请进入',

    showVisitorLogin: false,
    visitorUsername: "",
    visitorPassword: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ...app.globalData.validateUserResult,
    })
    if (app.globalData.validateUserResult.isAppliedUser) {
      this.setData({
        msg: app.globalData.validateUserResult.userInfo.msg,
        hasUserInfo: true,
        buttonText: buttonTextApplied,
      })
    }
    if (app.globalData.validateUserResult.isAuthUser) {
      wx.redirectTo({
        url: '/pages/main/yongche',
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
    if (app.globalData.validateUserResult && app.globalData.validateUserResult.isAuthUser) {
      wx.switchTab({
        url: '/pages/main/yongche',
      })
    }
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
      ...e.detail.userInfo
    }
    this.setData({
      userInfo: {
        ...e.detail.userInfo
      },
      hasUserInfo: true
    })
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
      wx.cloud.callFunction({
        name: 'createOrUpdateApply',
        data: {
          myUserInfo: that.data.userInfo,
          isAppliedUser: that.data.isAppliedUser
        }
      }).then(res => {
        var toastMsg = '新留言已提交'
        if (res.result.newUser.hasOwnProperty('_id')) {
          this.setData({
            'userInfo._id': res.result.newUser._id
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
      'userInfo.msg': e.detail.value
    })
  },
  toggleVisitorLogin: function(e) {
    this.setData({
      'showVisitorLogin': !this.data.showVisitorLogin
    })
  },
  visitorLogin: function(e) {
    var that = this
    if (this.data.visitorUsername == "" || this.data.visitorPassword=="") {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 2000
      })
      // if username, password are not empty, send to cloud function
    } else if (!this.data.userInfo.avatarUrl) {
        wx.showToast({
          title: '请点击“获取头像昵称”按钮',
          icon: 'none',
          duration: 3000
        });
    } else {
      wx.showLoading({
        title: '正在验证用户',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'visitorLogin',
        data: {
          visitorUsername: that.data.visitorUsername,
          visitorPassword: that.data.visitorPassword,
          myUserInfo: that.data.userInfo
        },
        success: res => {
          var result = res.result
          if (result.isAuthUser) {

            console.log(`call visiterLogin res ${JSON.stringify(result)}`)
            app.globalData.userInfo = result.userInfo
            app.globalData.validateUserResult = result
            wx.switchTab({
              url: '/pages/main/yongche'
            })
          }
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: 'something went wrong',
            icon: 'none',
            duration:2000
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },
  visitorUsernameInput: function(e) {
    var { value, cursor, keyCode } = e.detail
    this.setData({
      'visitorUsername': value.trim()
    })
  },
  visitorPasswordInput: function(e) {
    var { value, cursor, keyCode } = e.detail
    this.setData({
      'visitorPassword': value.trim()
    })
  }
})