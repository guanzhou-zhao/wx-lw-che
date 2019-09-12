const app = getApp()
const validateUser = require('../../utils/validateUser.js')
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

    showForm: false // by default, don't show form

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    validateUser.isAuthUser()
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  bindSearchCheTap: function(e) {
      this.setData({
        showForm: !this.data.showForm
      })

  },
  /**
   * 1. if records.length < 0, showForm true
   */
  setDataForRecords: function(records) {
    var that = this
    var showForm = false
    var codeExpress = {
      'tuan': {
        display: '上团',
        catDisplay: '团号'
      },
      'yongche': {
        isYongChe: true,
        display: '用车',
        catDisplay: '用途'
      },
      'r_tuan': {
        display: '下团',
        catDisplay: '团号'
      },
      'r_yongche': {
        isYongChe: true,
        display: '还车',
        catDisplay: '用途'
      },
      'update_plate': {
        display: '换车牌'
      },
      'update_rucNum': {
        display: '更新RUC到'
      },
      'update_base': {
        display: '更改基地到'
      },
      'update_mtNum': {
        display: '保养'
      },
      'update_allignmentNum': {
        display: '四轮定位'
      },
      'update_cofDate': {
        display: 'COF日期更新为'
      },
      'update_docDate': {
        display: '更新DOC卡日期到'
      },
      'update_rucDate': {
        display: '路税买到'
      },
      'fix_tyre': {
        display: '轮胎维修'
      },
      'fix_fix': {
        display: '维修'
      }
    }
    var currentYear = moment().year()
    var formatStringWithYear = 'D MMM YY H:mm'
    var formatString = 'D MMM H:mm'
    if (records.length > 0) {
      for (var i=0; i<records.length; i++) {
        // 修改时间格式
        var timeAt = moment(records[i].timeAt)
        var isSameYear = timeAt.year() == currentYear
        records[i].timeAtFormat = timeAt.format(isSameYear ? formatString : formatStringWithYear)
        // 判断记录类型
        if (records[i].code.includes('update_')) {
          records[i].recordType = 'update'
          records[i].newValue = records[i].newValue.slice(0, 10)
          records[i].newValue = records[i].newValue == 'S' ? '南岛' : (records[i].newValue == 'N' ? '北岛' : records[i].newValue)
        } else if (records[i].code.includes('fix_')){
          records[i].recordType = 'fix'
        } else if (records[i].code.includes('r_')) {
          records[i].recordType = 'return'
        } else {
          records[i].recordType = 'yongche'
        }
        // 对更新记录，添加che对象
        if (!records[i].che) {
          records[i].che = that.data.cheList.find((element) => element._id == records[i].cheId)
        }
        

        records[i] = {
          ...records[i],
          ...(codeExpress[records[i].code])
        }
      }
    } else {
      showForm = true
    }
    this.setData({
      records,
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
  /**
   * 1. 查询record where openId, isDriving
   *    a. 如果有正在用车的记录，列出
   *    b. 如果没有用车记录，显示form...
   */
  onShow: function() {
    var that = this


    wx.cloud.callFunction({
      name: 'listChe',
      success(res) {
        console.log(`main.yongche.js onshow() `)
        var cheList = res.result.data
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

        // call listRecord to get records of this user.
        wx.cloud.callFunction({
          name: 'listRecords',
          data: {
            query: {
              openId: app.globalData.userInfo.openId
            }
          },
          success(res) {
            that.setDataForRecords(res.result.data)
          }
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
        if (filter.length > 0 && che.plate.toUpperCase().includes(filter.toUpperCase())) {
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
      wx.showLoading({
        title:'处理中',
        mask: true
      })
      console.log(`main.yongche.js call yongche --- --`)
      wx.cloud.callFunction({
        name: 'yongche',
        data: {
          cheId: data.cheSelected._id,
          isTuan: data.isTuan,
          category: data.category,
          wheelNum: data.wheelNum,
          digitNum: data.digitNum
        },
        success(res) {
          /**
           * 1. 点击‘开始用车’按钮，添加record记录，更新che里程
           * 2. 从record中，Loading 和显示所有此车的记录
           */
          that.setDataForRecords(res.result.data)
          wx.hideLoading()
        },
        fail: console.log
      })
    }
  }
})