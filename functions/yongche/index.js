// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const DAYS_30 = 1000 * 60 * 60 * 24 * 30
const RUC_2000 = 2000
const MT_3000 = 3000
const ALIGN_5000 = 5000
/**
 * 开始用车时：
 * 1. 添加用车记录record
 * 2. 更新数据库 che 使用状态
 * 3. 更新数据库 user 用车状态
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var yongcheResponse
  var userUpdateResponse
  var cheSelected = event.cheSelected
  
  /**
   * 判断 ruc, rucDate, cofDate, mtNum保养, allimentNum四轮定位, docDate
   *  1. 在record中save isWrong
   *  2. 在record中save whatIsWrongList 列出anything wrong
   */
  var isWrong = false
  var errorMsgList = []
  var today = new Date()
  if ((cheSelected.rucNum - event.wheelNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`RUC里程少于${RUC_2000}km`)
  }
  if ((cheSelected.mtNum - event.digitNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`保养里程少于${RUC_2000}km`)
  }
  if ((cheSelected.allignmentNum - event.digitNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`四轮定位里程少于${RUC_2000}km`)
  }
  if ((new Date(cheSelected.rucDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`路税日期少于30天`)
  }
  if ((new Date(cheSelected.cofDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`COF日期少于30天`)
  }
  if ((new Date(cheSelected.docDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`DOC日期少于30天`)
  }

  var newRecord = {
    isTuan: event.isTuan,
    useDetail: event.useDetail,//团号或其它用途
    cheId: cheSelected._id,
    openId: wxContext.OPENID,
    timeAt: new Date(),
    wheelNum: event.wheelNum,
    digitNum: event.digitNum,
    isWrong,
    errorMsgList
  }
  var addedRecord = await db.collection('record').add({
    data: newRecord
  })
  newRecord._id = addedRecord._id

  /**
   * 更新车
   */
  var realTimeChe = await db.collection('che').doc(cheSelected._id).get()
  var usingDetailList = realTimeChe.data.usingDetailList ? cheSelected.usingDetailList : []
  usingDetailList.push({
    record: newRecord,
    user: event.user
  })
  var dataForUpdateChe = {
    wheelNum: event.wheelNum,
    digitNum: event.digitNum,
    isInUse: true,
    usingDetailList,
    updatedAt: new Date(),
    updatedBy: wxContext.OPENID
  }
await db.collection('che').doc(cheSelected._id).update({
  data: dataForUpdateChe
  }).then((res)=>{
    yongcheResponse = res
    realTimeChe = {
      ...realTimeChe,
      ...dataForUpdateChe
    }
  }).catch((err)=>{
    yongcheResponse = err
  })

  /**
   * 更新 user
   */
  var realTimeUser = await db.collection('user').doc(event.user._id).get()
  var drivingDetailList = realTimeUser.data.drivingDetailList ? event.user.drivingDetailList : []
  drivingDetailList.push({
    record: newRecord,
    che: cheSelected
  })
  var dataForUpdateUser = {
    isDriving: true,
    drivingDetailList,
    updatedAt: new Date(),
    updatedBy: wxContext.OPENID
  }
  await db.collection('user').doc(event.user._id).update({
    data: dataForUpdateUser
  }).then((res) => {
    userUpdateResponse = res
    realTimeUser = {
      ...realTimeUser,
      ...dataForUpdateUser
    }
  }).catch((err) => {
    userUpdateResponse = err
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    yongcheResponse,
    userUpdateResponse,
    addedRecord,
    realTimeChe: realTimeChe.data,
    realTimeUser: realTimeUser.data
  }
}