// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  var newUser
  
  if (event.myUserInfo.hasOwnProperty('_id')) {
    var userId = event.myUserInfo._id
    delete event.myUserInfo._id
    await db.collection('user').doc(userId).update({
      data: {
        msg: event.myUserInfo.msg
      }
    }).then(res => {
      newUser = res
    })
  } else {
    await db.collection('user').add({
      data: {
        ...event.myUserInfo,
        ...event.userInfo
      }
    }).then(res => {
      newUser = res
    })

  }

  return {
    event,
    newUser
  }
}