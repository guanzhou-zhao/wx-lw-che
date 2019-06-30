// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var record = (await db.collection('record').doc(event.recordId).get()).data
  if (record && record.openId == event.userInfo.openId && record.isDriving) {

    /**
     * update record
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
      code: 'return',
      isTuan: record.isTuan,
      category: record.category,
      startRecordId: record._id,
      timeAt: new Date(),
      park: event.park,
      msg: event.msg,
      openId: event.userInfo.openId,
      cheId: event.cheId,
      che: che,
      wheelNum: event.wheelNum,
      digitNum: event.wheelNum
    }

    var newRecordId =  (await db.collection('record').add({
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
     * 更新车
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

    /**
     * 在mileage中添加记录
     * 1. 如果存在此车的记录，则更新记录，否则新建车记录
     */
    var mileageList = (await db.collection('mileage').where({cheId: event.cheId}).get()).data
    if(mileageList.length >0) {
      var mileage = mileageList[0]
      var mileageList = mileage.mileageList ? mileage.mileageList : []
      mileageList.push({
        openId: event.userInfo.openId,
        isTuan: record.isTuan,
        startNum: record.wheelNum,
        endNum: event.wheelNum,
        timeAt: new Date()
      })
      await db.collection('mileage').doc(mileage._id).update({
        data: {
          mileage: mileageList
        }
      })
    } else {
      db.collection('mileage').add({
        data: {
          cheId: event.cheId,
          mileage: [
            {
              openId: event.userInfo.openId,
              isTuan: record.isTuan,
              startNum: record.wheelNum,
              endNum: event.wheelNum,
              timeAt: new Date()
            }
          ]
        }
      })
    }

  }
    return await db.collection('record').where({cheId: event.cheId}).get()
}