// pages/vehicle/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: ["中通", "Rosa", "奔驰20", "奔驰12", "海狮", "Alpha"],
    modelIndex: 0,

    cofDate: "2018-09-01",
    docDate: "2018-09-01",
    rucDate: "2018-09-01"
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
  bindModelChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      modelIndex: e.detail.value,
      model: this.data.models[e.detail.value]
    })
  },
  bindCofDateChange: function(e) {
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
  bindAllignmentNumChange: function (e) {
    this.setData({
      allignmentNum: e.detail.value
    })
  }
})