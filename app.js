//app.js
const app = getApp()

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-8gk63v1v2dc95f50',
        traceUser: true,
      })
    }
    this.globalData = {
      openid:"",
    }
    this.loadUserInfo();
  },
  globalData:{
    userInfo: null,
  },
  is_login:function(){
    if(this.globalData.userInfo){
      return true;
    }else{
      return false;
    }
  },
  setUserInfo:function(userInfo){
    this.globalData.userInfo=userInfo;
  },
  loadUserInfo:function(){
    wx.getSetting({
      success:res=>{
        const isUserInfo=res.authSetting['scope.userInfo'];
        if(isUserInfo){
          wx.getUserInfo({
            success:res=>{
              const userInfo=res.userInfo;
              this.globalData.userInfo=userInfo;
            }
          })
        }
      }
    })
  }
})