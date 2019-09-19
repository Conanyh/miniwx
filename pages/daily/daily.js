const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyList: [],
    isLoadingMore: false,
    currentPage: 1,
    info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = app.globalData.hostUrl + '/api/historyMatters';
    app.wxRequest('GET', url, {}, 
      (res) => {
        console.log(res)
        that.setData({
          dailyList: res
        });
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
  }
  

})