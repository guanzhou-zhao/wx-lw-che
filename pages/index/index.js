//index.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    motto: 'Hello 你好 自动预览',
    tabs: ["基本", "用车记录", "维修保养"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    //init tabs
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    
  }
})