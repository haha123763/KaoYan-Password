Page({
  data:{
    userinfo:{},
    openid:"",
    imgurl:"",
    documenturl:"",
  },
  onGotUserInfo:function(e){
    const that=this
// 调用云函数
    wx.cloud.callFunction({
      //  调用自定义的云函数的名称
      name:"login",
      success:res=>{
        that.setData({
          openid:res.result.openid,
          userinfo:e.detail.userInfo
        })
        // 把openid保存在缓存中
        that.data.userinfo.openid=this.data.openid
        wx.setStorageSync('userinfo', that.data.userinfo)

      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
  // 页面加载时从缓存中取出userinfo
  onLoad:function(options){
    const ui=wx.getStorageSync('userinfo')
      this.setData({
        userinfo:ui,
        openid:ui.openid
       })
  },


// 上传图片，上传成功后生成一个图片链接res.tempFilePaths[0]
 upload(){
   let that=this;
   console.log("点击上传")
   wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success (res) {
      console.log("选择成功",res)
      that.uploadImg(res.tempFilePaths[0])
    }
  })
 },
 uploadImg(fileurl){
          wx.cloud.uploadFile({
          cloudPath:new Date().getTime()+".jpeg",
          filePath:fileurl,
          success:res=>{
            console.log("上传图片成功",res)
            this.setData({
              // res.fileID是上传的图片的url
              imgurl:res.fileID
            })
            wx.showToast({
              icon:"success",
              title: '上传图片成功',
            })
          },fail:console.error
        })
 },

// 上传doc文档
  upload_documents(){
    let that=this;
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success (res) {
        console.log("调用云函数",res)
        that.upload_documents_yun(res.tempFiles[0].path)
      }
    })
  },
upload_documents_yun(fileurl){
  wx.cloud.uploadFile({   
    cloudPath:"exam_papers/"+new Date().getTime()+"2019考研真题.docx",
    filePath:fileurl,
    success:res=>{
      console.log("上传doc成功",res.fileID)
      wx.showToast({
        icon:"success",
        title: '上传文件成功',
      })
      // 把文件信息存储到云数据库
      this.add_paperList(res.fileID)
    },fail:console.error
  })
},

// 把文件信息存储到云数据库
  add_paperList(url){
    console.log("上传数据",url)
    console.log(url.split('/')[4].substring(13))
    let that=this;
    wx.cloud.database().collection('exam_papers').add({
      data:{
        paperName:url.split('/')[4].substring(13),
        paperUrl:url
      },
      success(res){
        console.log("试题信息存储到数据库success",res)
      },fail(res) { console.log(res) }
    })

  }
})