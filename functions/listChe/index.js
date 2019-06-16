// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  var cheList = []
  var dbErrorResponse
  await db.collection('che').get().then(res => {
    for (var i = 0; i < res.data.length; i++) {
      res.data[i].cheString = JSON.stringify(res.data[i])
    }
    cheList = res.data
  }).catch(err => {
    dbErrorResponse = err
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    cheList,
    dbErrorResponse
  }
}