// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var yongcheResponse
  var addRecordResponse
  var cheSelected = event.cheSelected
  await db.collection('che').doc(cheSelected._id).update({
    data: {
      wheelNum: event.wheelNum,
      digitNum: event.digitNum,
      status: 'tuan',
      statusDetail: {
        driverId: wxContext.OPENID,
        timeAt: new Date()
      },
      updatedAt: new Date(),
      updatedBy: wxContext.OPENID
    }
  }).then((res)=>{
    yongcheResponse = res
  }).catch((err)=>{
    yongcheResponse = err
  })

  await db.collection('record').add({
    data: {
      category: event.isTuan ? 'tuan' : 'others',
      categoryDetail: event.category,//团号或其它用途
      cheid: cheSelected._id,
      openid: wxContext.OPENID,
      timeAt: new Date(),
      changes: [
        {
          key: 'wheelNum',
          newValue: event.wheelNum,
          oldValue: cheSelected.wheelNum
        },
        {
          key: 'digitNum',
          newValue: event.digitNum,
          oldValue: cheSelected.digitNum
        }
      ]
    }
  }).then((res) => {
    addRecordResponse = res
  }).catch((err) => {
    addRecordResponse = err
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    yongcheResponse,
    addRecordResponse
  }
}