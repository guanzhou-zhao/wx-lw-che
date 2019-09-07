// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 20
// 云函数入口函数
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()

  // get all users
  var userCountResult = await db.collection('user').count()
  var times = Math.ceil(userCountResult.total / MAX_LIMIT)
  var users = []

  for (var i=0; i < times; i++) {
    var getUserResult = await db.collection('user').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    users.push(...getUserResult.data)
  }

  return {
    users,
    event,
    openid: OPENID,
    appid: APPID,
    env: ENV
  }
}