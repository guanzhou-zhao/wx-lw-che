// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  var validateResult = {}
  await db.collection('usera').where({
    openId: wxContext.OPENID,
    tag: 'Y'
  }).get().then(res => {
    console.log('how many user is validated: ' + res.data)
    validateResult.isAuthUser = res.data.length > 0
    if (validateResult.isAuthUser) {
      validateResult.userInfo = res.data[0]
    }
  })

  if (!validateResult.isAuthUser) {
    await db.collection('user').where({
      openId: wxContext.OPENID
    }).get().then(appliedUserResult => {
      validateResult.isAppliedUser = appliedUserResult.data.length > 0
      if (validateResult.isAppliedUser) {
        validateResult.userInfo = appliedUserResult.data[0]
      }
    })
  }

  return validateResult
}