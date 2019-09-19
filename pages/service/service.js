// pages/service/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [
      {
        'id': 1,
        'title': '群众发现问题标题',
        'summary': '群众发现问题描述',
        'posted_at': '2019-09-10',
        'views': 100,
        'thumb': 'http://img1.gtimg.com/news/pics/hv1/124/69/847/55093894.jpg'
      },
      {
        'id': 2,
        'title': '群众发现问题标题',
        'summary': '群众发现问题描述',
        'posted_at': '2019-09-10',
        'views': 100,
        'thumb': 'http://img1.gtimg.com/news/pics/hv1/124/69/847/55093894.jpg'
      },
    ],
    isLoadingMore: false,
    currentPage: 1,
    info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中...'
    // })
    // this.serviceData()
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
    // this.serviceData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // serviceData: function () {
  //   var that = this;
  //   var token = wx.getStorageSync('token');
  //   wx.request({
  //     url: 'https://www.zhuzones.top/api/repairs',
  //     method: 'get',
  //     header: {
  //       'Content-type': 'application/json',
  //       'Authorization': 'Bearer ' + token,
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.statusCode == 200) {
  //         that.setData({
  //           serviceData: res.data.data
  //         })
  //       } else {
  //         that.setData({
  //           info: '加载失败， 请重试'
  //         })
  //       }
  //       wx.hideLoading()
  //     }
  //   })

  // },

  serviceDetail: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/service/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }
})