// pages/fankui/fankui.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden:false
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


  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '用户反馈'
    }),
    console.log(option)
      this.setData({
        title:option.title,
        score:option.score,
        status:option.status,
        loadingHidden:true
      })
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