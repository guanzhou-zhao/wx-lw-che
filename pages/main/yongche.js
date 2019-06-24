const app = getApp()
wx.cloud.init()
const moment = require('../../utils/moment.min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cheSelected: null,
    filterInput: '',
    filteredCheList: [],
    isTuan: true,
    category: '',
    wheelNum: '',
    digitNum: '',

    moment,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setDataForUserInfo(app.globalData.userInfo)
  },

  bindSearchCheTap: function(e) {
      this.setData({
        showForm: !this.data.showForm
      })

  },

  setDataForUserInfo: function(userInfo) {
    var hasRecord = false
    var showForm = true
    if (userInfo.drivingDetailList && userInfo.drivingDetailList.length > 0) {
      hasRecord = true
    }
    if (hasRecord) {
      showForm = false
      for (var i=0; i<userInfo.drivingDetailList.length; i++) {
        userInfo.drivingDetailList[i].record.timeAtFormat = moment(userInfo.drivingDetailList[i].record.timeAt).format('D MMM YYYY h:m A')
      }
    }
    this.setData({
      userInfo,
      hasRecord,
      showForm
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   * -1. 检查 userInfo，看是否正在用车
   *    -a. 如果正在用车，列出正在用的车辆，显示选车button
   *    -b. 如果没有用车，不显示选车button,直接显示用车上团的form
   * 2. 用车上团的form 提交后，更新正在用车的list, 隐藏选车button，重置选车的data
   * 3. 点击正在用车list中的车辆，跳转的车辆vehicle.che.wxml，其中显示车辆记录，图片，和操作（比如下团，长传图片等的操作）
   * 4. 选车的form中要有取消按钮，点击后隐藏form
   * 
   * user {isDriving:true, drivingDetailList:[{cheId, record: {}}] }
   */
  onShow: function() {
    var that = this
    // call getUser to get latest user data
    wx.cloud.callFunction({
      name: 'getUser',
      data: {
        userId: app.globalData.userInfo._id
      },
      success(res) {
        var userInfo = res.result.data
        that.setDataForUserInfo(userInfo)
      }
    })

    wx.cloud.callFunction({
      name: 'listChe',
      success(res) {
        console.log(`main.yongche.js onshow() `)
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

  bindCategoryInput: function(e) {
    this.setData({
      category: e.detail.value.trim()
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
    var that = this
    var data = this.data
    if (!data.plateSelected) {
      wx.showToast({
        title: '请先选辆车',
        icon: 'none',
        duration: 2500
      })
    } else if (data.category.trim().length < 1) {
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
          category: data.category,
          wheelNum: data.wheelNum,
          digitNum: data.digitNum,
          user: that.data.userInfo
        },
        success(res) {
          console.log(`main.yongche.js call yongche success -- ${JSON.stringify(res)}`)
          /**
           * 1. 点击‘开始用车’按钮，添加record记录，更新che,user 成功
           * 2. Loading 和显示所有此车的记录
           */
          that.setDataForUserInfo(res.result.realTimeUser)
        },
        fail(res) {
          console.log(`main.yongche.js call yongche fail -- ${JSON.stringify(res)}`)
        }
      })
    }
  }
})