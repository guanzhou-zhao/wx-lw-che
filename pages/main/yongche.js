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
    filteredCheList: [],
    tuanNum: '',
    otherUse: '',
    wheelNum: '',
    digitNum: ''
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
    var dataset = e.currentTarget.dataset
    this.setData({
      plateSelected: dataset.plate,
      filterInput: dataset.plate,
      cheSelected: dataset.che,
      wheelNum: dataset.che.wheelNum,
      digitNum: dataset.che.digitNum
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
  },

  bindTuanNumInput: function(e) {
    this.setData({
      tuanNum: e.detail.value.trim()
    })
  },

  bindOtherUseInput: function(e) {
    this.setData({
      otherUse: e.detail.value.trim()
    })
  },

  bindWheelNumInput: function(e) {
    this.setData({
      wheelNum: e.detail.value.trim()
    })
  },

  bindDigitNumInput: function(e) {
    this.setData({
      digitNum: e.detail.value.trim()
    })
  },

  bindUseButtonTap: function(e) {
    var data = this.data
    if (!data.plateSelected) {
      wx.showToast({
        title: '请先选辆车',
        icon: 'none',
        duration: 2500
      })
    } else if ((data.tuanNum.length > 0 && data.otherUse.length > 0) || (data.tuanNum.length < 1 && data.otherUse.length < 1)) {
      wx.showToast({
        title: '团号或其它用途必须且只能填一个',
        icon: 'none',
        duration: 3000
      })
    } else if (data.wheelNum.length < 1 || data.digitNum.length < 1){
      wx.showToast({
        title: '两个里程都必须填',
        icon: 'none',
        duration: 3000
      })
    } else {
      //更新数据库 che.status
      //  1. 在车列表可以看到车的status，谁，什么时间开始用的
      //  2. 其他人上团选车的时候可以显示谁在开
      //更新数据库 添加 record
      //  1. 在车记录列表显示，谁，什么时间，用途，更新里程与否。
      wx.cloud.callFunction({
        name: 'yongche',
        data: {
          cheSelected: data.cheSelected,
          tuanNum: data.tuanNum,
          otherUse: data.otherUse,
          wheelNum: data.wheelNum,
          digitNum: data.digitNum                
        },
        success(res) {
          console.log(`main.yongche.js call yongche success -- ${JSON.stringify(res)}`)
        }
      })    
    }
  }
})