// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/**
 * 还车时的后台操作
 * 1、添加还车record
 * 2、更新start record
 * 3、更新车里程
 * return 此车的所有record
 */
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var record = event.record
  if (record && record.openId == event.userInfo.openId && record.isDriving) {

    /**
     * 添加还车record
     */
    var che = (await db.collection('che').doc(event.cheId).get()).data
    var checkExpireResult = (await cloud.callFunction({
      name: 'checkExpireForChe',
      data: {
        che: che,
        wheelNum: event.wheelNum,
        digitNum: event.digitNum,
      }
    })).result
    var dataForNewRecord = {
      code: `r_${record.code}`,
      category: record.category,
      startRecordId: record._id,
      timeAt: new Date(),
      park: event.park,
      msg: event.msg,
      openId: event.userInfo.openId,
      cheId: event.cheId,
      che: che,
      wheelNum: event.wheelNum,
      digitNum: event.digitNum,
      startWheelNum: record.wheelNum,
      startDigitNum: record.digitNum,
      ...checkExpireResult
    }
    /**
     * 更新start record
     */
    var newRecordId = (await db.collection('record').add({
      data: dataForNewRecord
    }))._id

    var dataForUpdateRecord = {
      isDriving: false,
      endRecordId: newRecordId
    }
    await db.collection('record').doc(record._id).update({
      data: dataForUpdateRecord
    })

    /**
     * 更新车里程
     */
    var dataForUpdateChe = {
      wheelNum: event.wheelNum,
      digitNum: event.digitNum,
      updatedAt: new Date(),
      updatedBy: event.userInfo.openId
    }
    await db.collection('che').doc(event.cheId).update({
      data: dataForUpdateChe
    })

  }
  return await db.collection('record').where({
    cheId: event.cheId
  }).orderBy('timeAt', 'desc').get()
}