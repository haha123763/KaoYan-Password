Page({

  /*
  * 数据
  */
  data: {
    current: '0',//切换标识
    nav: [//导航栏数据
      '首页',
      '服务中心',
      '要闻咨询',
      '关于我们'
    ]
  },

  /*
  * 事件处理
  */
  go: function(e) {

    // 获取索引
    let index = e.currentTarget.dataset.index

    // 切换颜色 / 更新数据
    this.setData({
      current: index
    })
  }

})
