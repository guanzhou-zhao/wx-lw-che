// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  var validateResult = {}
  await db.collection('user').where({
    openId: wxContext.OPENID,
    tag: 'Y'
  }).get().then(res => {
    validateResult.isAppliedUser = res.data.length > 0
    validateResult.userInfo = res.data[0]

    validateResult.isAuthUser = (validateResult.userInfo.tag && validateResult.userInfo.tag == 'Y')

  })

  return validateResult
}