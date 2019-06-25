var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
wx.cloud.init()
const allUsers = app.globalData.allUsers
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["记录", "图片", "操作"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    showImageUploadForm: true,
    files: []
  },
  bindShowImageFormTap: function(e) {
    this.setData({
      showImageUploadForm: !this.data.showImageUploadForm
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 1. 根据cheId 从record中加载出所有此车的记录
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    console.log(`allUsers ${JSON.stringify(app.globalData.allUsers)}`)
    wx.cloud.callFunction({
      name: 'getRecord',
      data: {
        cheId: options.cheId
      },
      success(res) {
        var records = res.result.data.reduce((pv, cv)=> {
          cv.user = app.globalData.allUsers[cv.openId]
          pv.push(cv)
          return pv
        },[])
        
        that.setData({
          records
        })
      },
      fail: console.error
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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