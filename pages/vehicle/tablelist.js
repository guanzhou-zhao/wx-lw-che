const app = getApp()
const validateUser = require('../../utils/validateUser.js')
wx.cloud.init()
const moment = require('../../utils/moment.min.js')
Page({

  data: {
    cheArray: [],
    isDisplayLeft: true,
    orderCol: ''
  },
  bindDisplayChange(e) {
    this.setData({
      isDisplayLeft: e.detail.value
    })
  },
  getCheArray() {
    let that = this;
    wx.cloud.callFunction({
      name: 'listChe',
      data: {
        validateUserResult: app.globalData.validateUserResult
      },
      success(res) {
        let cheArray = res.result.data
        let today = moment()
        cheArray.sort(that.orderByPlateAndBase)
        // cheArray.sort(that.sortCheObject)
        for (const che of cheArray) {
          che.rucDateF = moment(che.rucDate).format('D MMM YY')
          che.cofDateF = moment(che.cofDate).format('D MMM YY')
          che.rucNumLeft = che.rucNum - che.wheelNum
          che.mtNumLeft = che.mtNum - che.digitNum
          che.allignmentNumLeft = che.allignmentNum - che.digitNum
          che.rucDateLeft = -today.diff(moment(che.rucDate), 'days')
          che.cofDateLeft = -today.diff(moment(che.cofDate), 'days')
        }
        that.setData({
          cheArray
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onLoad: function() {
    this.getCheArray()
  },
  sortCheObject(a, b) {
    if (a.plate.includes('TEST')) {
      return 1
    } else if (b.plate.includes('TEST')) {
      return -1
    } else if (a.base != b.base) {
      if (a.base == 'N') return 1
    } else if (a.model == '中通') {
      return -1
    } else {
      return a.model > b.model ? 1 : -1
    }
  },
  orderByPlateAndBase(a, b) {
    let scoreOfA = this.getScore(a)
    if (a.model > b.model) {
      scoreOfA +=10
    } else {
      scoreOfA -=10
    }
    if (a.plate > b.plate) {
      scoreOfA +=1
    } else {
      scoreOfA -=1
    }
    return scoreOfA - this.getScore(b)
  },
  getScore(che) {
    let score = 0;
    if (che.plate.includes('TEST')) {
      score += 10000
    }
    if (che.base == 'N') {
      score += 1000
    }
    if (che.model == '中通') {
      score -= 100
    }
    return score;
  },
  sortChe(event) {
    console.log(event)
    let col = event.target.dataset.col
    let cheArray = this.data.cheArray
    cheArray.sort((a, b) => {
      return a[col] - b[col]
    })
    this.setData({
      cheArray,
      orderCol: col
    })
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
    validateUser.isAdmin(app)
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
    this.getCheArray()
    wx.stopPullDownRefresh()
    this.setData({
      orderCol: ''
    })
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

  }
})