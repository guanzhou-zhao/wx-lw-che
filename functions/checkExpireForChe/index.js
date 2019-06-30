// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const DAYS_30 = 1000 * 60 * 60 * 24 * 30
const RUC_2000 = 2000
const MT_3000 = 3000
const ALIGN_5000 = 5000
// 云函数入口函数
exports.main = async (event, context) => {
  var isWrong = false
  var errorMsgList = []
  var today = new Date()
  if ((event.che.rucNum - event.wheelNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`RUC里程少于${RUC_2000}km`)
  }
  if ((event.che.mtNum - event.digitNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`保养里程少于${RUC_2000}km`)
  }
  if ((event.che.allignmentNum - event.digitNum) < RUC_2000) {
    isWrong = true
    errorMsgList.push(`四轮定位里程少于${RUC_2000}km`)
  }
  if ((new Date(event.che.rucDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`路税日期少于30天`)
  }
  if ((new Date(event.che.cofDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`COF日期少于30天`)
  }
  if ((new Date(event.che.docDate) - today) < DAYS_30) {
    isWrong = true
    errorMsgList.push(`DOC日期少于30天`)
  }

  return {
    isWrong,
    errorMsgList
  }
}