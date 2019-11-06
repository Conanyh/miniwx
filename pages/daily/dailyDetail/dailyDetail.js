// pages/daily/dailyDetail/dailyDetail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var token = wx.getStorageSync('token');
    if(id){
      var url = app.globalData.hostUrl + '/api/historyMattersDetail/' + id;
      app.wxRequest('GET', url, {},
        (res) => {
          that.setData({
            dailyDetail: res
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
      );
    }
  },
})