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

    cheSelected: null,
    filterInput: '',
    filteredCheList: [],
    isTuan: true,
    useDetail: '',
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
        var cheList = res.result.cheList
        if (that.data.cheSelected) {
          var tempChe = cheList.find((c) => {
            return c._id == that.data.cheSelected._id
          })
          that.setData({
            cheSelected: tempChe
          })
        }

        that.setData({
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

    this.bindPlateFilterInput({
      detail: {
        value: e.currentTarget.dataset.plate
      }
    })
  },

  bindPlateFilterInput: function(e) {
    var filter = e.detail.value.trim()
    this.setData({
      filteredCheList: this.data.cheList.reduce((pv, che) => {
        if (filter.length > 0 && che.plate.includes(filter)) {
          pv.push(che)
        }
        return pv
      }, [])
    })
  },

  bindSwitchChange: function(e) {
    this.setData({
      isTuan: e.detail.value
    })
  },

  bindUseDetailInput: function(e) {
    this.setData({
      useDetail: e.detail.value.trim()
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
    } else if (data.useDetail.trim().length < 1) {
      wx.showToast({
        title: `请输入${data.isTuan ? '团号' : '用途'}`,
        icon: 'none',
        duration: 3000
      })
    } else if (data.wheelNum.length < 1 || data.digitNum.length < 1) {
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
      console.log(`main.yongche.js call yongche --- --`)
      wx.cloud.callFunction({
        name: 'yongche',
        data: {
          cheSelected: data.cheSelected,
          isTuan: data.isTuan,
          useDetail: data.useDetail,
          wheelNum: data.wheelNum,
          digitNum: data.digitNum,
          user: app.globalData.userInfo
        },
        success(res) {
          console.log(`main.yongche.js call yongche success -- ${JSON.stringify(res)}`)
        },
        fail(res) {
          console.log(`main.yongche.js call yongche fail -- ${JSON.stringify(res)}`)
        }
      })
    }
  }
})