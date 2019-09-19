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

    var url = app.globalData.hostUrl + '/api/attendance';
    app.wxRequest('GET', url, {
        type: chactors
      },
      (res) => {
        if (chactors == 'company_manage') {
          this.setData({
            personList: res
          })
        } else {
          this.setData(res);
        }
      },
      (err) => {
        // console.log(err.statusCode);
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
              app.wxRequest('GET', url, {
                  type: chactors
                },
                (res) => {
                  if (chactors == 'company_manage') {
                    that.setData({
                      personList: res
                    })
                  } else {
                    that.setData(res);
                  }
                })
            }
          });
        }
    })
  }

})