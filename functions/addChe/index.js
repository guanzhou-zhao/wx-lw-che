// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  var addResponse;
  event.che.cofDate = new Date(event.che.cofDate)
  event.che.docDate = new Date(event.che.docDate)
  event.che.rucDate = new Date(event.che.rucDate)
  await db.collection('che').add({
    data: {
      ...event.che,
      createdBy: wxContext.OPENID,
      createdAt: new Date()
    },
    success(res) {
      addResponse = res
    },
    fail(res) {
      addResponse = res
    }
  })
  return {
    addResponse,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}