//获取应用实例
const app = getApp();

Page({
  data: {

  },
  onLoad: function(options) {
    var that = this;
    var chactors = wx.getStorageSync('chactor');
    that.setData({
      chactors: chactors
    });

    var url = app.globalData.hostUrl + '/api/carRecord';
    app.wxRequest('GET', url, {},
      (res) => {
        that.setData({
          carList: res
        });
      },
      (err) => {
        if (err.statusCode == '500') {
          wx.request({
            method: "PUT",
            url: app.globalData.hostUrl + '/api/authorizations/current',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: function(res) {
              wx.setStorageSync('token', res.data.access_token);
              app.wxRequest('GET', url, {},
                (res) => {
                 
                }
              )
            }
          });
        }
      })


  },

  //查看车辆进出详情
  carsDetail: function(e) {
    var carid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: 'carsDetail/carsDetail?carid=' + carid
    })
  }


})