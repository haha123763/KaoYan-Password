// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var openid=event.userid;
  var topicId=event.topicId;
  let action=event.action;
  console.log("动态id",topicId)
  const wxContext = cloud.getWXContext()
  if(action=="get"){
    return await db.collection("jubao").where({
      dongtai_id:topicId,
    }).get()
  }else if(action=="addTopic"){
    return await db.collection("jubao").add({
      data:{
        dongtai_id:topicId,
        user_id:[openid],
        num:1

      }
    })
  }else if(action=='add'){
    return await db.collection("jubao").where({
      dongtai_id:topicId,
    }).update({
      data:{
        num:_.inc(1),
        user_id: _.push(openid),
      }
      })
  }else if(action=="del"){
    db.collection('topic').where({dongtai_id:topicId,}).remove()
    return await db.collection("jubao").where({
      dongtai_id:topicId,
    }).remove()

  }
  db.collection("jubao").where({
    dongtai_id:event.id
  }).get().then(res=>{
    if(res.data.length==0){
      db.collection("jubao").add({
        data:{
          dongtai_id:event.id,
          num:1
        }
    })
    }else{
      db.collection("jubao").where({
        dongtai_id:event.id,
      }).update({
        data:{
          num:_.inc(1)
        }
    })
    }
  })
}