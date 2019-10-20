// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const DAYS_30 = 1000 * 60 * 60 * 24 * 30
const DAY_1 = 1000 * 60 * 60 * 24
const KM_2000 = 2000
// 云函数入口函数
exports.main = async (event, context) => {
  var che = event.che
  var wheelNum = event.wheelNum
  var digitNum = event.digitNum
  var isWrong = false
  var errorMsg = ''
  var today = new Date()
  if ((che.rucNum - wheelNum) < KM_2000) {
    isWrong = true
    errorMsg += `ruc:${che.rucNum} 剩余${che.rucNum - wheelNum}, `
  }
  if ((che.mtNum - digitNum) < KM_2000) {
    isWrong = true
    errorMsg += `保养:${che.mtNum} 剩余${che.mtNum - digitNum}, `
  }
  if ((che.allignmentNum - digitNum) < KM_2000) {
    isWrong = true
    errorMsg += `四轮定位:${che.allignmentNum} 剩余${che.allignmentNum - digitNum}, `
  }
  var rucDate = new Date(che.rucDate)
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if ((rucDate - today) < DAYS_30) {
    isWrong = true
    errorMsg += `路税:${rucDate.getDate()} ${months[rucDate.getMonth()]} ${rucDate.getFullYear()} 剩余${Math.floor((rucDate - today) / DAY_1)}天, `
  }
  var cofDate = new Date(che.cofDate)
  if ((cofDate - today) < DAYS_30) {
    isWrong = true
    errorMsg += `COF:${cofDate.getDate()} ${months[cofDate.getMonth()]} ${cofDate.getFullYear()} 剩余${Math.floor((cofDate - today) / DAY_1)}天, `
  }
  // var docDate = new Date(che.docDate)
  // if ((docDate - today) < DAYS_30) {
  //   isWrong = true
  //   errorMsg += `DOC:${docDate.getDate()} ${months[docDate.getMonth()]} ${docDate.getFullYear()} 剩余${Math.floor((docDate - today) / DAY_1)}天`
  // }

  return {
    isWrong,
    errorMsg
  }
}