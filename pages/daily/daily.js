const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyList: [],
    isLoadingMore: false,
    currentPage: 1,
    tip: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadDaily();
  },

  onShow: function () {
    this.loadDaily();
  },

  loadDaily: function() {
    var that = this;
    var url = app.globalData.hostUrl + '/api/historyMatters';
    app.wxRequest('GET', url, {},
      (res) => {
        console.log(res)
        that.setData({
          dailyList: res
        });
        if (res.length == 0) {
          that.setData({
            tip: '暂无数据'
          })
        }
        wx.stopPullDownRefresh();
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
            success: function(res) {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadDaily();
    wx.stopPullDownRefresh();
  },

  // 详情
  dailyDetail: function (e) {
    wx.navigateTo({
      url: '/pages/daily/dailyDetail/dailyDetail?id=' + e.currentTarget.dataset.id,
    })
  }

})