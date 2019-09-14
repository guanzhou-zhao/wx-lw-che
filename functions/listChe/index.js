// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var result
  var userInfo
  if (event.validateUserResult) {
    userInfo = event.validateUserResult.userInfo

    if (event.validateUserResult.isAdmin) {
      result = await db.collection('che').get()
    } else if (event.validateUserResult.isAuthUser && userInfo.base) {
      result = await db.collection('che').where({
        base: userInfo.base
      }).get()
    }
  }
  if (!result) {result = {data:[]}}
  return result
}