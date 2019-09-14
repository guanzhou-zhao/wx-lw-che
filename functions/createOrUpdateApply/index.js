// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  var newUser
  
  if (event.myUserInfo.hasOwnProperty('_id')) {
    newUser={}
  } else {
    await db.collection('user').add({
      data: {
        ...event.myUserInfo,
        openId: wxContext.OPENID
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