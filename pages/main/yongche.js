const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
wx.cloud.init()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["车记录", "图片", "操作"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    filterInput: '',
    filteredCheList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

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
    var that = this
    wx.cloud.callFunction({
      name: 'listChe',
      success(res) {
        console.log(res.result.cheList)
        var cheList = res.result.cheList
        var modelList = cheList.reduce((pv, che) => {
          if (pv.findIndex((e) => e == che.model) < 0) {
            pv.push(che.model)
          }
          return pv
        }, [])
        
        that.setData({
          modelList,
          cheList
        })
      }
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

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  bindCheButtonClick: function(e) {
    this.setData({
      plateSelected: e.currentTarget.dataset.plate,
      filterInput: e.currentTarget.dataset.plate
    })

    this.bindPlateFilterInput({ detail: { value: e.currentTarget.dataset.plate}})
  },

  bindPlateFilterInput: function(e) {
    var filter = e.detail.value.trim()
    this.setData({
      filteredCheList: this.data.cheList.reduce((pv, che)=> {
        if (filter.length > 0 && che.plate.includes(filter)) {
          pv.push(che)
        }
        return pv
      }, [])
    })
  }
})