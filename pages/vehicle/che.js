var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
wx.cloud.init()
const moment = require('../../utils/moment.min.js')
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

    showImageUploadForm: false,
    files: [],
    imageDesc: ''
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
        title: '上传中'
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
      userInfo: app.globalData.userInfo
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
    /**
     * listRecords for tab 0
     */
    wx.cloud.callFunction({
      name: 'listRecords',
      data: {
        query: {
          cheId: options.cheId
        }
      },
      success(res) {
        var records = res.result.data.reduce((pv, cv) => {
          cv.timeAtFormat = moment(cv.timeAt).format('D MMM YYYY h:m A')
          cv.user = app.globalData.allUsers[cv.openId]
          pv.push(cv)
          return pv
        }, [])

        that.setData({
          records
        })
      },
      fail: console.error
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
        that.setData({
          che
        })
        that.setDataForImages(che.images)
      },
      fail: console.error
    })
  },

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