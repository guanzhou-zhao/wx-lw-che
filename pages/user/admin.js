// pages/admin/admin.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("admin.js onLoad() validateResult  " + JSON.stringify(app.globalData.validateUserResult))
    var that = this
    db.collection('user').get({
      success(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        var allUsers = res.data
        db.collection('usera').get({
          success(result) {
            var approvedUsers = result.data
            console.log("admin.js onload() approvedUsers " + JSON.stringify(result))
            for (var i = 0; i < allUsers.length; i++) {
              for (var j = 0; j < approvedUsers.length; j++) {
                if (allUsers[i].openId == approvedUsers[j].openId) {
                  allUsers[i] = {
                    ...allUsers[i],
                    ...approvedUsers[j]
                  }
                  approvedUsers.splice(j, 1)
                }
              }
            }

            console.log("admin.js onload() allUsers " + JSON.stringify(allUsers))
            that.setData({
              users: allUsers
            })
          }
        })
      }
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

  /**
   * 
   */
  approveApply: function(event) {
    console.log("admin.js approveApply() app.globalData.validateUserResult.userInfo " + JSON.stringify(app.globalData.validateUserResult.userInfo))
    var that = this
    
    db.collection('usera').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ...event.target.dataset.user,
        tag: 'Y',
        approvedBy: app.globalData.validateUserResult.userInfo
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.data.users[event.target.dataset.i] = {
          approvedBy: app.globalData.validateUserResult.userInfo,
          tag: 'Y',
          ...that.data.users[event.target.dataset.i]
        }

        that.setData({
          users: that.data.users
        })
      }
    })
  }
})