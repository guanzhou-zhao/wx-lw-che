// pages/vehicle/update.js
wx.cloud.init()
const validateUser = require('../../utils/validateUser.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: ["中通", "Rosa", "奔驰20", "奔驰12", "海狮", "Alpha"],
    modelIndex: 0,

    cofDate: "2018-09-01",
    docDate: "2018-09-01",
    rucDate: "2018-09-01",

    cheObject: { },
    changeLog: { }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('vehicle.update.js this.__displayReporter.query ' + JSON.stringify(this.__displayReporter.query))
    var cheObject = JSON.parse(this.__displayReporter.query.che)
    cheObject.cofDate = cheObject.cofDate.slice(0, 10)
    cheObject.docDate = cheObject.docDate.slice(0, 10)
    cheObject.rucDate = cheObject.rucDate.slice(0, 10)
    var that = this
    var updatedChe = {...cheObject}
    this.setData({
      cheObject,
      updatedChe,
      modelIndex: that.data.models.findIndex(e => e == cheObject.model)
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
    validateUser.isAdmin()
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
  bindUpdate: function () {
    wx.cloud.callFunction({
      name: 'updateChe',
      data: {
        cheObject: this.data.cheObject,
        updatedChe: this.data.updatedChe,
        changeLog: this.data.changeLog
      },
      success (res) {
        console.log('vehicle.update.js call update车 success ' + JSON.stringify(res))

        wx.showToast({
          title: '完成更新',
          icon: 'none',
          duration: 3000,
          complete() {
            (new Promise((resolve, reject) => {
              setTimeout(()=> {
                resolve(0)
              }, 2000)
            })).then(()=> {
              wx.navigateBack({
                delta: 1,
                success(s) {
                  console.log('updateChe success, navigateBack to che list')
                }
              })
            })
          }
        });
      },
      fail (res) {
        console.log('vehicle.update.js call updateChe fail ' + res)
      }
    })
  },
  bindModelChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      modelIndex: e.detail.value,
      'updatedChe.model': this.data.models[e.detail.value]
    })
    
    if (this.data.models[e.detail.value] == this.data.cheObject.model) {
      this.data.changeLog.model = false
    } else {
      this.setData({
        'changeLog.model': {
          msg: `型号从"${this.data.cheObject.model}"改变为"${this.data.models[e.detail.value]}"`
        }
      })
    }
  },
  bindCofDateChange: function(e) {
    this.setData({
      'updatedChe.cofDate': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.cofDate) {
      this.data.changeLog.cofDate = false
    } else {
      this.setData({
        'changeLog.cofDate': {
          msg: `COF日期从"${this.data.cheObject.cofDate}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindDocDateChange: function (e) {
    this.setData({
      'updatedChe.docDate': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.docDate) {
      this.data.changeLog.docDate = false
    } else {
      this.setData({
        'changeLog.docDate': {
          msg: `Doc日期从"${this.data.cheObject.docDate}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindRucDateChange: function (e) {
    this.setData({
      'updatedChe.rucDate': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.rucDate) {
      this.data.changeLog.rucDate = false
    } else {
      this.setData({
        'changeLog.rucDate': {
          msg: `Ruc日期从"${this.data.cheObject.rucDate}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindPlateChange: function (e) {
    this.setData({
      'updatedChe.plate': e.detail.value.toUpperCase()
    })
    if (e.detail.value == this.data.cheObject.plate) {
      this.data.changeLog.plate = false
    } else {
      this.setData({
        'changeLog.plate': {
          msg: `plate从"${this.data.cheObject.plate}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindRucNumChange: function (e) {
    this.setData({
      'updatedChe.rucNum': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.rucNum) {
      this.data.changeLog.rucNum = false
    } else {
      this.setData({
        'changeLog.rucNum': {
          msg: `ruc里程从"${this.data.cheObject.rucNum}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindMtNumChange: function (e) {
    this.setData({
      'updatedChe.mtNum': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.mtNum) {
      this.data.changeLog.mtNum = false
    } else {
      this.setData({
        'changeLog.mtNum': {
          msg: `保养里程从"${this.data.cheObject.mtNum}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindWheelNumChange: function (e) {
    this.setData({
      'updatedChe.wheelNum': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.wheelNum) {
      this.data.changeLog.wheelNum = false
    } else {
      this.setData({
        'changeLog.wheelNum': {
          msg: `轮毂里程从"${this.data.cheObject.wheelNum}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindDigitNumChange: function (e) {
    this.setData({
      'updatedChe.digitNum': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.digitNum) {
      this.data.changeLog.digitNum = false
    } else {
      this.setData({
        'changeLog.digitNum': {
          msg: `仪表盘里程从"${this.data.cheObject.digitNum}"改变为"${e.detail.value}"`
        }
      })
    }
  },
  bindAllignmentNumChange: function (e) {
    this.setData({
      'updatedChe.allignmentNum': e.detail.value
    })
    if (e.detail.value == this.data.cheObject.allignmentNum) {
      this.data.changeLog.allignmentNum = false
    } else {
      this.setData({
        'changeLog.allignmentNum': {
          msg: `四轮定位里程从"${this.data.cheObject.allignmentNum}"改变为"${e.detail.value}"`
        }
      })
    }
  }
})