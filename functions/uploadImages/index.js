// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
/**
 * 1. 上传图片到云存储，并获取id或链接
 * 2. getChe 得到最新的che
 * 3. 保存图片上传记录（含有图片id或链接，上传人）到che 数据库
 * 4. 返回更新后的车
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  var getChe = await db.collection('che').doc(event.cheId).get()
  var che = getChe.data
  var images = che.images ? che.images : []

  for (var i=0; i<event.fileIDs.length; i++) {
    images.push({
      fileID: event.fileIDs[i],
      imageDesc: event.imageDesc,
      openId: wxContext.OPENID,
      timeAt: new Date()
    })
  }
  
  return await db.collection('che').doc(event.cheId).update({
    data: {
      images
    }
  })
}