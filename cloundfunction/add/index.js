// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 =require('js-md5');
// const md5 = require('js-md5');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
async function getPassword(password){
  return  md5(password)
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    getPassword: await getPassword(event.password),
  }
}