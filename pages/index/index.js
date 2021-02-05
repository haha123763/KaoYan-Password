
Page({
  // addLog函数的实现，index.wxml中有调用，点击按钮
 addLog(event){
   const add=event.currentTarget.dataset.add
   console.log("add",add)
  //  获取缓存中的用户信息，openid
   const ui=wx.getStorageSync('userinfo')
  //  判断用户是否存在
  if(!ui.openid){
    wx.switchTab({
      url: '/pages/me/me',
    })
    }
    else{
    //  调用云函数
    wx.cloud.callFunction({
      // 指明调用的云函数名字
      name:"createlog",
      // 向云函数传递参数，要插入的数据
      data:{
        add:add,
        date:Date.now(),
        openid:ui.openid
      }
    })
  }
}
})
