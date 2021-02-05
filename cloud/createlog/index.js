// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()

// 云函数入口函数,event是前端调用函数传递的参数信息
exports.main = async (event, context) => {
  try{
    console.log("Yunhanshu ")
    // 指定数据库的集合，进行相关操作
    return await db.collection('logs').add({
      data:{
        add:event.add,
        date:event.date,
        openid:event.openid
      }
    })
  }catch(e){
    console.log(e)
  }
}