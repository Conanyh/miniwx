// pages/elegance/elegance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eleganceList: {},
    currentPage: 1,
    tip: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadEleganceList();
  },

  onShow: function () {
    var that = this;
    that.loadEleganceList();
  },

  loadEleganceList: function () {
    var that = this;
    var url = app.globalData.hostUrl + '/api/news';
    app.wxRequest('GET', url, {},
      (res) => {
        that.setData({
          eleganceList: res
        });
        if (res.length == 0) {
          that.setData({
            tip: '暂无数据'
          })
        }
      },
      (err) => {
        if (err.statusCode == '500') {
          wx.request({
            url: app.globalData.hostUrl + '/api/authorizations/current',
            method: "PUT",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: function (res) {
              wx.setStorageSync('token', res.data.access_token);
              app.wxRequest('GET', url, {},
                (res) => {

                }
              );
            }
          })
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 详情
  eleganceDetail: function (e) {
    wx.navigateTo({
      url: '/pages/elegance/eleganceDetail/eleganceDetail?id=' + e.currentTarget.dataset.id,
    })
  }

})