var that
const app = getApp()
var util = require('../../utils/util.js');
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priseDongtai:[],
    totalCount: 0,
    topics: [],
    loadingHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initImageSize()
    that = this
    wx.getUserInfo({
      success:res=>{
        const userInfo=res.userInfo;
          that.setData({
            nickName:userInfo.nickName,
            avatarUrl:userInfo.avatarUrl
          })
        }
      })
  },
  initImageSize:function(){
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    // const weiboWidth = windowWidth-40;
    const weiboWidth = 253;
    const twoImageSize = (weiboWidth-2.5)/2
    const threeImageSize = (weiboWidth-2.5*2)/3
    this.setData({
      twoImageSize:twoImageSize,
      threeImageSize:threeImageSize
    })
  },
  // 查询topic数据
  getData: function() {
    const db = wx.cloud.database();
     // 获取当前用户的openID
     wx.cloud.callFunction({
      name:"login",
      data:{}
    }).then(res=>{
      // res.result.data 是用户数据
      this.setData({
        openid:res.result.openid
      })
      db.collection('topic').where({
        _openid:this.data.openid
      }).orderBy('date', 'desc').get().then(res=>{
        this.setData({
          topics: res.data,
          loadingHidden:true
        })
        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh();
      })
    })
   

  },
  // 点赞按钮
  PriseTap:function(event){
    if(event.currentTarget.dataset.status=="true"){
      console.log("取消点赞")
      wx.cloud.callFunction({
        name:"prise",
        data:{
          action:"cancel",
          userid:that.data.openid,
          topicId:event.currentTarget.dataset.topicid,
        }
      }).then(res=>{
        this.getData()
        this.getPrise(that.data.openid)
      })
    }else{
      console.log("点赞")
      wx.cloud.callFunction({
        name:"prise",
        data:{
          action:"prise",
          userid:that.data.openid,
          topicId:event.currentTarget.dataset.topicid,
        }
      }).then(res=>{
        this.getData()
        this.getPrise(that.data.openid)
       })
    }
  },
  // 重现加载该用户点赞过的topic,即priseDongtai
  getPrise(openid){
    wx.cloud.callFunction({
      name:"prise",
      data:{
        action:"get",
        userid:openid
      }
    }).then(res=>{
      if(res.result.data.length==0){
        wx.cloud.callFunction({
          name:"prise",
          data:{
            action:"addUser",
            userid:openid
          }
        })
      }else{
        this.setData({
          loadingHidden:true,
          priseDongtai:res.result.data[0].priseDongtai
        })
      }
    })
  },
  // 删除动态
  delete:function(e){
    wx.showModal({
      title: '提示',
      content: '确认要删除该条动态？',
      success: function (res) {
       if (res.confirm) {
        db.collection('topic').doc(e.currentTarget.dataset.id).remove().then(res=>{
          wx.showToast({
            title: '删除成功',
          })
          })
          db.collection('replay')
            .where({
              u_id: that.data.openid,
              t_id: e.currentTarget.dataset.id
            }).remove()
          that.getData();
      } else if (res.cancel) {
        console.log('用户点击取消')
       }
      }
     })
  },

//  item 点击
  onItemClick: function(event) {
    var id = event.currentTarget.dataset.topicid;
    var openid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
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
    that.getData();
    that.getPrise(that.data.openid);
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
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