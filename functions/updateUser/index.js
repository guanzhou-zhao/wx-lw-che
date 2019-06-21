// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('user').doc(event.userId).update({
    data: {
      tag: event.tag,
      approvedBy: wxContext.OPENID,
      approvedAt: new Date()
    }
  })

  // return {
  //   event,
  //   openid: ,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}