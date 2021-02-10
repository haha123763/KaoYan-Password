// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  // 调用时传递的参数
  var openid=event.userid;
  let action=event.action;
  const wxContext = cloud.getWXContext()
  if(action=="get"){
    return await db.collection("prise_dongtai").where({
      user_id:openid
    }).get()
  }else if(action=="addUser"){
    return await db.collection("prise_dongtai").add({
      data:{
        user_id:openid,
        priseDongtai:[],

      }
    })

  }else if(action=="cancel"){
    db.collection("topic").doc(event.topicId).update({
      data: {
      prise_num:_.inc(-1)
      }
    })
    return await db.collection("prise_dongtai").where({
      user_id:openid
    }).update({
      data:{
        priseDongtai: _.pull(event.topicId),
      }
      })
  }else{
    db.collection("topic").doc(event.topicId).update({
      data: {
      prise_num:_.inc(1)
      }
  })
  return await db.collection("prise_dongtai").where({
      user_id:openid
    }).update({
      data:{
        priseDongtai: _.push(event.topicId),
      }
      })
      // return "添加成功"
  }


}