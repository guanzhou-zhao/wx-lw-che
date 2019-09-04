// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  // 更新默认配置，将默认访问环境设为当前云函数所在环境
  cloud.updateConfig({
    env: ENV
  })
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  var validateResult = {
    isAppliedUser: false
  }
  await db.collection('user').where({
    openId: OPENID
  }).get().then(res => {
    if (res.data.length > 0) {
      validateResult.isAppliedUser = true
        validateResult.userInfo = res.data[0]

      validateResult.isAuthUser = (validateResult.userInfo.tag && validateResult.userInfo.tag == 'Y')
    }

  })

  return validateResult
}