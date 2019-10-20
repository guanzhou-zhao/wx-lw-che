var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
wx.cloud.init()
const moment = require('../../utils/moment.min.js')
const validateUser = require('../../utils/validateUser.js')
const allUsers = app.globalData.allUsers
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["记录", "图片", "操作", "详情"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    models: ["中通", "Rosa", "奔驰20", "奔驰12", "海狮", "Alpha"],
    modelIndex: 0,

    showImageUploadForm: false,
    files: [],
    imageDesc: '',

    showReturnForm: false,
    park: '',
    msg: '',

  },
  bindImageUploadTap: function(e) {
    var that = this
    if (this.data.files.length < 1) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      })
    } else if (this.data.imageDesc.trim().length < 1) {
      wx.showToast({
        title: '请描述图片',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      var files = that.data.files
      // var promise
      // for (var i = 0; i < files.length; i++) {
      //   promise = new Promise((resolve, reject)=> {
      //     wx.compressImage({
      //       src: files[i], // 图片路径
      //       quality: 80 // 压缩质量
      //     })
      //   })
      var promiseList = []
      var promise
      var tempPath
      var cloudPath
      for (var i = 0; i < files.length && i < 3; i++) {
        tempPath = files[i]
        cloudPath = 'my-image' + tempPath.match(/\.[^.]+?$/)[0]
        console.log(`tempPath cloudPath: ${tempPath} ${cloudPath}`)
        
        promise = new Promise((resolve, reject) => {
          wx.compressImage({
            src: files[i], // 图片路径
            quality: 5, // 压缩质量
            success(res) {
              console.log('5% compressed response' + JSON.stringify(res))
              var tempFilePath = res.tempFilePath
              cloudPath = tempFilePath.slice(tempFilePath.lastIndexOf('/')+1)
              wx.cloud.uploadFile({
                cloudPath,
                filePath: tempFilePath,
                success: resolve,
                fail: reject
              })
            },
            fail: reject
          })
          
        })
        promiseList.push(promise)
      }
      Promise.all(promiseList).then((res) => {
        console.log(JSON.stringify(res))
        var fileIDs = res.reduce((pv, cv)=> {
          pv.push(cv.fileID)
          return pv
        }, [])
        wx.cloud.callFunction({
          name: 'uploadImages',
          data: {
            cheId: that.data.cheId,
            fileIDs,
            imageDesc: that.data.imageDesc
          },
          success(res) {
            wx.hideLoading()
            that.setData({
              showImageUploadForm: false,
              files: [],
              imageDesc: ''
            })
            that.setDataForImages(res.result.images)
          },
          fail: console.error
        })
      })
    }

  },

  bindReturnCheTap: function(e) {
    var recordId = e.currentTarget.id
    var records = this.data.records
    var operatingRecord = records.find((r)=>r._id==recordId)
    this.setData({
      operatingRecord,
      showReturnForm: true,
      wheelNum: operatingRecord.che.wheelNum,
      digitNum: operatingRecord.che.digitNum,
    })
  },

  bindWheelNumInput: function(e) {
    this.setData({
      wheelNum: e.detail.value
    })
  },

  bindDigitNumInput: function(e) {
    this.setData({
      digitNum: e.detail.value
    })
  },

  bindParkInput: function(e) {
    this.setData({
      park: e.detail.value
    })
  },

  bindMsgInput: function(e) {
    this.setData({
      msg: e.detail.value
    })
  },

  bindCancelReturnTap: function(e) {
    this.setData({
      showReturnForm: false
    })
  },
  driverUpdate: function(e) {
    var that = this.data
    wx.navigateTo({
      url: `/pages/tools/driverupdate?cheId=${that.che._id}&plate=${that.che.plate}&allignmentNum=${that.che.allignmentNum}&mtNum=${that.che.mtNum}&cofDate=${that.che.cofDate}`
    })
  },
  bindReturnSubmit: function(e) {
    var that = this
    var data = {
      record: this.data.operatingRecord,
      cheId: this.data.cheId,
      wheelNum: this.data.wheelNum,
      digitNum: this.data.digitNum,
      park: this.data.park,
    }
    if (this.data.msg && this.data.msg.length>0) {
      data.msg = this.data.msg
    }
    if (!this.data.park || this.data.park.length < 1) {
      wx.showToast({
        title: '请填停车场地',
        icon: 'none',
        duration: 3000
      })
    } else {
      wx.showLoading({
        title: '处理中',
        mask:true
      })
      wx.cloud.callFunction({
        name: 'returnChe',
        data,
        success(res) {
          that.setDataForRecords(res.result.data)
          that.setData({
            park:'',
            msg:'',
            operatingRecord: null,
            showReturnForm: false,
            wheelNum: '',
            digitNum: '',
          })
          app.globalData.userRecords = res.result.data
          wx.navigateBack()
        },
        fail() {
          wx.showToast({
            title: 'callFunction fail',
            duration: 3000
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
    }
  },

  longtapUploadingImage: function(e) {
    this.data.files.splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      files: this.data.files
    })
  },
  previewUploadingImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imagesUrls // 需要预览的图片http链接列表
    })
  },
  setDataForImages: function(images) {

    var hasImages= images ?images.length > 0 : false
    if(!hasImages) return
    var imageFileIDs = images.reduce((pv, cv)=> {
      pv.push(cv.fileID)
      return pv
    }, [])
    wx.cloud.getTempFileURL({
      fileList: imageFileIDs,
    }).then((res)=>{
      console.log(JSON.stringify(res))
      var fileList = res.fileList
      var imagesUrls = []
      for(var i=0; i<fileList.length; i++) {
        console.log(fileList[i].errMsg + (images[i].fileID == fileList[i].fileID))
        imagesUrls.push(fileList[i].tempFileURL)
        images[i].tempFileURL = fileList[i].tempFileURL
        images[i].uploadBy = app.globalData.allUsers[images[i].openId].nickName
      }

      
      this.setData({
        images,
        imagesUrls,
        hasImages,
        showImageUploadForm: !hasImages
      })
    }).catch(console.error)
    
  },
  bindImageDescInput: function(e) {
    this.setData({
      imageDesc: e.detail.value
    })
  },
  bindShowImageFormTap: function(e) {
    this.setData({
      showImageUploadForm: !this.data.showImageUploadForm
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 3, // 最多可以选择3张
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(`chooseImage response ${JSON.stringify(res)}`)

        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imagesUrls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 1. 根据cheId 从record中加载出所有此车的记录
   */
  onLoad: function(options) {
    this.setData({
      cheId: options.cheId,
      userInfo: app.globalData.userInfo,
      showDriverUpdateButton: !app.globalData.validateUserResult.isAdmin
    })
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

  setDataForRecords: function (records) {
    var that = this
    var showForm = false
    var operateRecords
    var codeExpress = {
      'tuan': {
        display: '上团',
        catDisplay: '团号',
        oppositeDisplay: '下团'
      },
      'yongche': {
        isYongChe: true,
        display: '用车',
        catDisplay: '用途',
        oppositeDisplay: '还车'
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
      for (var i = 0; i < records.length; i++) {
        // 修改时间格式
        var timeAt = moment(records[i].timeAt)
        var isSameYear = timeAt.year() == currentYear
        records[i].timeAtFormat = timeAt.format(isSameYear ? formatString : formatStringWithYear)
        // 判断记录类型
        if (records[i].code.includes('update_')) {
          records[i].recordType = 'update'
          records[i].newValue = records[i].newValue.slice(0, 10)
          records[i].newValue = records[i].newValue == 'S' ? '南岛' : (records[i].newValue == 'N' ? '北岛' : records[i].newValue)
        } else if (records[i].code.includes('fix_')) {
          records[i].recordType = 'fix'
        } else if (records[i].code.includes('r_')) {
          records[i].recordType = 'return'
        } else {
          records[i].recordType = 'yongche'
        }
        // 对更新记录，添加che对象
        if (!records[i].che) {
          records[i].che = that.data.che
        }
        // 对记录添加user 对象
        records[i].user = app.globalData.allUsers[records[i].openId]

        records[i] = {
          ...records[i],
          ...(codeExpress[records[i].code])
        }
      }
      var openId = app.globalData.userInfo.openId
      operateRecords = records.reduce((pv, cv) => {
        // push records that is belong to openId, and isDriving
        if (cv.openId == openId && cv.isDriving) {
          pv.push(cv)
        }
        return pv
      }, [])


    } else {
      showForm = true
    }
    this.setData({
      records,
      showForm,
      operateRecords
    })
  },
  // setDataForRecords: function(originRecords) {
  //   var currentYear = moment().year()
  //   var formatStringWithYear = 'D MMM YY H:mm'
  //   var formatString = 'D MMM H:mm'
  //   var codeExpress = {
  //     'tuan': {
  //       display: '上团',
  //       catDisplay: '团号',
  //       oppositeDisplay: '下团'
  //     },
  //     'yongche': {
  //       isYongChe: true,
  //       display: '用车',
  //       catDisplay: '用途',
  //       oppositeDisplay: '还车'
  //     },
  //     'r_tuan': {
  //       display: '下团',
  //       catDisplay: '团号'
  //     },
  //     'r_yongche': {
  //       isYongChe: true,
  //       display: '还车',
  //       catDisplay: '用途'
  //     },
  //   }
  //   var records = originRecords.reduce((pv, cv) => {
  //     var timeAt = moment(cv.timeAt)
  //     var isSameYear = timeAt.year() == currentYear
  //     cv.timeAtFormat = timeAt.format(isSameYear? formatString : formatStringWithYear)
  //     cv.user = app.globalData.allUsers[cv.openId]

  //     cv = {
  //       ...cv,
  //       ...(codeExpress[cv.code])
  //     }
  //     pv.push(cv)
  //     return pv
  //   }, [])

  //   var openId = app.globalData.userInfo.openId
  //   var operateRecords = records.reduce((pv, cv)=>{
  //     // push records that is belong to openId, and isDriving
  //     if (cv.openId == openId && cv.isDriving) {
  //       pv.push(cv)
  //     }
  //     return pv
  //   },[])

  //   this.setData({
  //     records,
  //     operateRecords
  //   })
  // },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
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
    validateUser.isAuthUser(app)
    wx.showLoading({
      title: '加载中',
    })
    /**
     * getChe for tab 1 图片tab
     */
    wx.cloud.callFunction({
      name: 'getChe',
      data: {
        cheId: that.data.cheId
      },
      success(res) {
        var che = res.result.data
        che.cofDate = che.cofDate.slice(0, 10)
        che.docDate = che.docDate.slice(0, 10)
        che.rucDate = che.rucDate.slice(0, 10)
        that.setData({
          che,
          'tabs[0]': che.plate + '记录'
        })
        that.setDataForImages(che.images)

        /**
     * listRecords for tab 0
     */
        wx.cloud.callFunction({
          name: 'listRecords',
          data: {
            query: {
              cheId: that.data.cheId
            }
          },
          success(res) {
            that.setDataForRecords(res.result.data)
            wx.hideLoading()
          },
          fail: console.error
        })
      },
      fail: console.error
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

  }
})