const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: [],
    currentPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadInfoList();
  },

  loadInfoList: function () {
    var that = this;
    var url = app.globalData.hostUrl + '/api/openMatters';
    app.wxRequest('GET', url, {},
      (res) => {
        that.setData({
          infoList: res
        });
        // wx.hideLoading();
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

  onShareAppMessage() {
    return {
      title: '要闻信息',
      path: '/pages/info/info'
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.startPullDownRefresh();
    var that = this;
    var url = app.globalData.hostUrl + '/api/historyMatters';
    app.wxRequest('GET', url, {},
      (res) => {
        that.setData({
          infoList: res
        });
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

  // 详情
  // infoDetail: function(e) {
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '/pages/info/detail/detail?id=' + e.currentTarget.dataset.id,
  //   })
  // }

})