// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var updateResponse
  var cheId = event.updatedChe._id
  delete event.updatedChe._id
  await db.collection('che').doc(cheId).update({
    data: {
      ...event.updatedChe,
      updatedBy: wxContext.OPENID,
      updatedAt: new Date()
    }
  }).then(res => {
    updateResponse = res
  })

  return {
    updateResponse,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}