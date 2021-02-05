// 全局变量
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperList:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.course+'真题'
    });
    // 初始化页面时就展示试题的列表
    this.getPaperList()
  },

// 获取试题文档列表
getPaperList(event){
  let that = this;
  // exam_papers是云数据库中存放文档的集合
  wx.cloud.database().collection('exam_papers').get({
    success(res){
      console.log(res)
      that.setData({
        paperList:res.data
      })
    }
  })
},
collectPaper:function(event){
  console.log(event)
  console.log("收藏图片")
},
//通过Url打开云存储里的试题文档 ,用不到
 downLoadPaper:function(event){
    console.log(event.target.dataset['paperurl'])
    console.log("下载文档")
    wx.cloud.downloadFile({
      fileID: event.target.dataset['paperurl'],
      success: res => {
        console.log("下载成功",res)
        wx.openDocument({
          // res.tempFilePath下载文档成功后的链接
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('打开文档成功',res)
          }
        })
      },
      fail: err => {
        // handle error
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})