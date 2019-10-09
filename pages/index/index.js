const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgUrls: [
    //   app.globalData.hostUrl + '/xcximg/lunbo1.png',
    //   app.globalData.hostUrl + '/xcximg/lunbo2.png',
    //   app.globalData.hostUrl + '/xcximg/lunbo3.png'
    // ],
    imgUrls: [
      '/images/lb1.png',
      '/images/lb2.png',
      '/images/lb3.png',
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0,
    indicatorActiveColor: '#eeeeee'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    return {
      title: "平安魏家庄",
      path: "pages/index/index"
    }
  },

  // 问题上报
  issue: function (e) {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/issue/issue',
      });
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
      });
    }
  },
  
  daily: function (e) {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/daily/daily',
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
      });
    }
  }

})