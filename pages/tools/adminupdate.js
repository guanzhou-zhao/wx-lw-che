// pages/tools/adminupdate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accounts: ["RUC", "路税", "DOC"],
    accountIndex: 0,
    currentValue: "2016-09-01",
  },
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value
    })
    this.setInitValueOnAccountIndex()
  },
  bindCurrentValueChange: function (e) {
    this.setData({
      currentValue: e.detail.value
    })
  },
  bindNewValueChange: function(e) {
    this.setData({
      newValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.rucDate = options.rucDate.slice(0, 10)
    options.docDate = options.docDate.slice(0, 10)
    this.setData({
      ...options
    })
    this.setInitValueOnAccountIndex()
  },
  setInitValueOnAccountIndex: function () {
    var value
    var accountIndex = this.data.accountIndex
    if (accountIndex == 0) {
      value = this.data.rucNum
    } else if (accountIndex == 1) {
      value = this.data.rucDate
    } else if (accountIndex == 2) {
      value = this.data.docDate
    }
    this.setData({
      currentValue: value,
      newValue: value
    })
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