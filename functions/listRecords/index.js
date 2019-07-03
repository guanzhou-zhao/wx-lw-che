// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  var query = event.query || {}

  return await db.collection('record').where(query).orderBy('isDriving', 'desc').orderBy('timeAt', 'desc').get()
}