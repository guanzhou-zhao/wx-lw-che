// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const recordCategory = {
  'plate': '车牌',
  'model': '车型',
  'wheelNum': '轮毂里程',
  'digitNum': '仪表盘里程',
  'rucNum': 'RUC公里数',
  'mtNum': '保养公里数',
  'allignmentNum': '四轮定位公里数',
  'cofDate': 'COF日期',
  'docDate': 'DOC日期',
  'rucDate': '路数日期'
}
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  var updateResponse
  var addRecordResponse
  var cheId = event.updatedChe._id
  var changeLog = event.changeLog
  var records = []
  var changeLogKeys = Object.keys(changeLog)
  var isCheChanged = false
  for (var key of changeLogKeys) {
    if (!!changeLog[key]) {
      isCheChanged = true
      records.push({
        category: recordCategory[key],
        msg: changeLog[key].msg,
        createdBy: wxContext.OPENID,
        createdAt: new Date()
      })
    }
  }
  if (isCheChanged) {
    delete event.updatedChe._id
    await db.collection('che').doc(cheId).update({
      data: {
        ...event.updatedChe,
        updatedBy: wxContext.OPENID,
        updatedAt: new Date()
      }
    }).then(res => {
      updateResponse = res
    })
    
    await db.collection('record').add({
      data: {
        records
      }
    }).then(res => {
      addRecordResponse = res
    }).catch(err => {
      addRecordResponse = err
    })
  }

  return {
    records,
    updateResponse,
    addRecordResponse,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}