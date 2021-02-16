const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      my_upDoc:[],
      loadingHidden:false
  },
  getOpenid(){
    
   
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("aaaaaaaa",res.result.openid)
    // 获取当前用户的openID
    wx.cloud.callFunction({
      name:"login",
      data:{}
    }).then(res=>{
      // res.result.data 是用户数据
      this.setData({
        openid:res.result.openid
      })
      const db = wx.cloud.database();
      db.collection('topic').where({
        type:2,
        _openid:this.data.openid
      }).get().then(res=>{
        console.log("resssss",res)
        this.setData({
          my_upDoc:res.data,
          loadingHidden:true
        })
      })
    })
    .catch(res=>{
      console.log("获取openID 失败",res)
    })
   

  },

  up_doc: function (event){
    const userInfo=event.detail.userInfo;
    if(userInfo){
      console.log(userInfo)
      wx.navigateTo({
                  url: '../up_doc/up_doc?nickName='+userInfo.nickName+'&avatarUrl='+userInfo.avatarUrl
         })  
    }
 },

fankui:function (e) {
  wx.navigateTo({
        url: '../fankui/fankui?title='+e.currentTarget.dataset.title+'&score='+e.currentTarget.dataset.score+'&status='+e.currentTarget.dataset.status
  })
 },
 onShow:function(){
   this.onLoad()
 }

})