// pages/vehicle/update.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const validateUser = require('../../utils/validateUser.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: ["中通", "Rosa", "奔驰20", "奔驰12", "海狮", "Alpha"],
    modelIndex: 0,

    plate: '',
    model: '中通',
    wheelNum: 0,
    digitNum: 0,
    rucNum: 0,
    mtNum: 0,
    allignmentNum: 0,
    cofDate: "2018-09-01",
    docDate: "2018-09-01",
    rucDate: "2018-09-01",
    isSouth: true
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
    validateUser.isAdmin()
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

  },
  bindCheLocationChange: function(e) {
    this.setData({
      isSouth: e.detail.value
    })
  },
  bindModelChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      modelIndex: e.detail.value,
      model: this.data.models[e.detail.value]
    })
  },
  bindCofDateChange: function (e) {
    this.setData({
      cofDate: e.detail.value
    })
  },
  bindDocDateChange: function (e) {
    this.setData({
      docDate: e.detail.value
    })
  },
  bindRucDateChange: function (e) {
    this.setData({
      rucDate: e.detail.value
    })
  },
  bindPlateChange: function (e) {
    this.setData({
      plate: e.detail.value.toUpperCase()
    })
  },
  bindRucNumChange: function (e) {
    this.setData({
      rucNum: e.detail.value
    })
  },
  bindMtNumChange: function (e) {
    this.setData({
      mtNum: e.detail.value
    })
  },
  bindWheelNumChange: function (e) {
    this.setData({
      wheelNum: e.detail.value
    })
  },
  bindDigitNumChange: function (e) {
    this.setData({
      digitNum: e.detail.value
    })
  },
  bindAllignmentNumChange: function (e) {
    this.setData({
      allignmentNum: e.detail.value
    })
  },
  bindAdd: function (e) {
    if (this.data.plate.trim().length < 1) {
      wx.showToast({
        title: '请认真填写车牌号',
        icon: 'none',
        duration: 3000
      });
    } else {
      wx.showLoading({
        title: '处理中',
        mask: true
      });
      var che = {
        plate: this.data.plate,
        model: this.data.model,
        wheelNum: Number(this.data.wheelNum),
        digitNum: Number(this.data.digitNum),
        rucNum: Number(this.data.rucNum),
        mtNum: Number(this.data.mtNum),
        allignmentNum: Number(this.data.allignmentNum),
        cofDate: this.data.cofDate,
        docDate: this.data.docDate,
        rucDate: this.data.rucDate,
        base: this.data.isSouth ? 'S' : 'N'
      }
      wx.cloud.callFunction({
        name: 'addChe',
        data: { 
          che
        },
        success(res) {
          wx.navigateBack({
            delta: 1,
            success(s) {
              wx.hideLoading()
            }
          })
        },
        fail(res) {
          console.log('vehicle.add.js call addChe() fail' + JSON.stringify(res))
          var msg = '添加车辆信息失败！'
          if (res.errMsg.indexOf('duplicate key') > -1) {
            msg += ' 已添加车牌相同的车辆'
          }
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
          });  
        }
      })
      
    }
  }
})