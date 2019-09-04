// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/**
 * 1. 更新车
 * 2. 添加record记录
 */
exports.main = async (event, context) => {

  var code;
  if (!event.isFixChe) {
    if (event.propertyName == 'rucDate' || event.propertyName == 'docDate' || event.propertyName == 'cofDate') {
      event.newValue = new Date(event.newValue)
    }

    var dataForUpdateChe = {
      updatedBy: event.userInfo.openId,
      updatedAt: new Date()
    }
    dataForUpdateChe[event.propertyName] = event.newValue
    await db.collection('che').doc(event.cheId).update({
      data: dataForUpdateChe
    })

    code = `update_${event.propertyName}`
  } else {
    code = `fix_${event.propertyName}`
  }


  var newRecord = {
    code,
    cheId: event.cheId,
    openId: event.userInfo.openId,
    timeAt: new Date(),
    newValue: event.newValue
  }

  var addRecordResult = await db.collection('record').add({
    data: newRecord
  })

  return {
    event,
    addRecordResult
  }
}