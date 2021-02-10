// pages/homepage/homepage.js
var that
const app = getApp()
// var util = require('../../utils/util.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:'one',
    navList:["社区动态","题目动态"],
    priseDongtai:[],
    currentIndexNav:0,
    currentIndex:0,
    topics:[],
    viewBg1:"pink",
    viewBg2:"blue",
    imgList: [{
      img: "https://7465-test-yan-3gp1h1ez7f7c6a02-1304167464.tcb.qcloud.la/%E5%9B%BE%E6%A0%87/fzu1.png?sign=ae23e42dc51b5c57255639a883dfe0cc&t=1605663522" //轮播图片
    },
    {
      img: "https://7465-test-yan-3gp1h1ez7f7c6a02-1304167464.tcb.qcloud.la/%E5%9B%BE%E6%A0%87/fzu2.png?sign=9cdd7a1f19b822748119aff2460e9dab&t=1605663659"
    },
    {
      img: "https://7465-test-yan-3gp1h1ez7f7c6a02-1304167464.tcb.qcloud.la/%E5%9B%BE%E6%A0%87/fzu3.png?sign=0f0c1e4bcfdcc47d44b1dbd786b1563f&t=1605663594"
    },
    {
      img: "https://7465-test-yan-3gp1h1ez7f7c6a02-1304167464.tcb.qcloud.la/%E5%9B%BE%E6%A0%87/fzu3.png?sign=0f0c1e4bcfdcc47d44b1dbd786b1563f&t=1605663594"
    }
    ],
    loadingHidden:false

  },
  // 轮播图
  changeSwiper: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("调用onload")
    this.initImageSize()
    that=this
    that.getOpenid()
  },
  initImageSize:function(){
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const weiboWidth = 253;
    const twoImageSize = (weiboWidth-30)/2
    const threeImageSize = (weiboWidth-10*2)/3
    this.setData({
      twoImageSize:twoImageSize,
      threeImageSize:threeImageSize
    })
    console.log("twoImageSize",twoImageSize)
    console.log("threeImageSize",threeImageSize)
  },
getOpenid(){
  wx.cloud.callFunction({
    name:"login",
    data:{}
  }).then(res=>{
    this.setData({
      openid:res.result.openid
    })

    this.getData()
    this.getPrise(that.data.openid)

  }).catch(res=>{
    console.log("获取openID 失败",res)
  })
},
// 初始化页面触发，获取topic数据
getData: function(start=0) {
  const db = wx.cloud.database();
  // 数据库api获取数据
  db.collection('topic')
    .orderBy('date', 'desc')
    .get({
      success: function(res) {
        console.log("获取数据",res.data)
        // res.data 是包含以上定义的两条记录的数组
        that.data.topics = res.data;
        that.setData({
          topics: that.data.topics,
          loadingHidden:true
        })

        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh();
      },
      fail: function(event) {
        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh();
      }
    })

},
//初始化页面触发， 点赞触发
getPrise(openid){
  priseDongtai:["2f6ab8515fde9c20002a90af731e68f2"]
},
// 点击动态
onItemClick:function(event){
  console.log("onItemClick,,,,,,,,,,",event)
  var id = event.currentTarget.dataset.topicid;
    var openid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    })
},
// 新建动态，userInfo是官方给出的数据对象，封装了头像，昵称等数据
onWriteWeiboTap:function(event){
  console.log(event,"写动态")
  const userInfo=event.detail.userInfo;
  if(userInfo){
    wx.navigateTo({
      url: '../publish/publish?nickName='+userInfo.nickName+'&avatarUrl='+userInfo.avatarUrl
    })
  }
},

//  点击首页导航按钮
activeNav(e) {
  console.log(e)
  if(e.target.dataset.index===1){
    this.setData({
      currentIndexNav: e.target.dataset.index,
      show:"two"
   })
  }else{
    this.setData({
      currentIndexNav: e.target.dataset.index,
      show:"one"
  })
  }

},
xiala:function(e){
// e.currentTarget.dataset.openid当前动态的id
wx.showLoading({
  title: '正在加载',
})
wx.cloud.callFunction({
  name:"login",
  data:{}
}).then(res=>{
  wx.hideLoading()
  if(e.currentTarget.dataset.openid==res.result.openid){
    console.log(e.currentTarget.dataset)
    console.log(res.result)
    wx.showModal({
      title: '提示',
      content: '确定删除该条动态',
      success: function (res) {
        if (res.confirm) {
          db.collection('topic').doc(e.currentTarget.dataset.topicid).remove().then(res=>{
            wx.showToast({
              title: '删除成功',
            })
            that.getData();
            })
        } 
      }
    })
  }else{
    // this.onItemClick()
    console.log("onItemClick")
    var id = e.currentTarget.dataset.topicid;
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    })
  }
})
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
  },












// 返回页面实际上是把隐藏的上一级页面显现，
// 可实现页面的重新刷新
onShow:function(){
  this.getData()
  }












})