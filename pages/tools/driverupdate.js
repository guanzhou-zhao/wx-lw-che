wx.cloud.init()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accounts: ["轮胎", "修车", "保养", "COF", "四轮定位", "车牌"],
    accountIndex: 0,
    currentValue: "2016-09-01",
  },
  bindConfirmTap: function (e) {
    var accountsToPropertyName = ['tyre', 'fix', "mtNum", "cofDate", "allignmentNum", "plate"]
    var that = this
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 3000
    })
    wx.cloud.callFunction({
      name: 'updateCheProperty',
      data: {
        cheId: this.data.cheId,
        isFixChe: that.data.accountIndex == 0 || that.data.accountIndex == 1,
        propertyName: accountsToPropertyName[that.data.accountIndex],
        currentValue: that.data.currentValue,
        newValue: that.data.newValue
      },
      success() {
        wx.showToast({
          title: '提交完成',
          icon: 'success',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) {wx.navigateBack() },
        })
      },
      fail() {
        wx.showToast({
          title: 'something wrong',
          icon: 'none'
        })
      }
    })
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
  bindNewValueChange: function (e) {
    this.setData({
      newValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.cofDate = options.cofDate.slice(0, 10)
    this.setData({
      ...options
    })
    this.setInitValueOnAccountIndex()
  },
  setInitValueOnAccountIndex: function () {
    var value
    var accountIndex = this.data.accountIndex
    //accounts: ["轮胎", "修车", "保养", "COF", "四轮定位", "车牌"]
    if (accountIndex == 0) {
      value = ''
    } else if (accountIndex == 1) {
      value = ''
    } else if (accountIndex == 2) {
      value = this.data.mtNum
    } else if (accountIndex == 3) {
      value = this.data.cofDate
    } else if (accountIndex == 4) {
      value = this.data.allignmentNum
    } else if (accountIndex == 5) {
      value = this.data.plate
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