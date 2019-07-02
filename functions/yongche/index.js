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
exports.main = async(event, context) => {

  /**
   * get latest che
   */
  var getRealTimeChe = await db.collection('che').doc(event.cheId).get()
  var cheSelected = getRealTimeChe.data

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
  // delete images before save che in record
  delete cheSelected.images
  var newRecord = {
    isDriving: true, // 标记此次用车是否已结束
    isTuan: event.isTuan,
    category: event.category, //团号或其它用途
    cheId: cheSelected._id,
    che: cheSelected, // 保存上团时，车的状态
    openId: event.userInfo.openId,
    timeAt: new Date(),
    wheelNum: event.wheelNum,
    digitNum: event.digitNum,
    isWrong,
    errorMsgList
  }
  await db.collection('record').add({
    data: newRecord
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
  await db.collection('che').doc(cheSelected._id).update({
    data: dataForUpdateChe
  })

  return await db.collection('record').where({ openId: event.userInfo.openId }).orderBy('timeAt', 'desc').get()
}