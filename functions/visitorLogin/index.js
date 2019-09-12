// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const lwUsername = "lw"
const lwPassword = "lwJC90ATLQD24Ee"
// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  var isAuthUser =false
  var userInfo
  //判断用户名密码是否正确
  //正确，如下
  if (event.visitorUsername == lwUsername && event.visitorPassword == lwPassword) {
    //判断当前微信用户是否在用户列表。
    // count: {total:1, errMsg:collection.count.ok}
    var users = (await db.collection('user').where({
      openId: OPENID
    }).get()).data
    
      //如果在用户列表，可以不处理
    isAuthUser = true
      //如果不在用户列表，添加此用户到用户列表
    if (users && users.length < 1) {
        userInfo = {...event.myUserInfo}
        userInfo.openId = OPENID
        userInfo.tag = 'V'
        userInfo._id = (await db.collection('user').add({
          data: userInfo
        }))._id
      } else {
        userInfo = users[0]
      }
    //返回validateUserResult
  }
    
  //错误 isAuthUser = false

  return {
    isAuthUser,
    userInfo
  }
}