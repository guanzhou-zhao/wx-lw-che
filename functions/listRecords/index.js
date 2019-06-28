// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  var query = event.query || {}
  if (!event.isAll) {
    query.openId = event.userInfo.openId
  }

  return await db.collection('record').where(query).get()
}