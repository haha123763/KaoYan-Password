//app.js
const app = getApp()

App({
  onLaunch: function () {
   wx.cloud.init({
     env:'test-8gk63v1v2dc95f50',
     traceUser:true
   })
  },
  globalData:{
    course: "" //对应查询题库的课程名，如政治，英语
  }
})