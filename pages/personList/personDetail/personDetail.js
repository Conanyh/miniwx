//获取应用实例
const app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {
    var that = this;
    var chactors = wx.getStorageSync('chactor');
    that.setData({
      chactors: chactors
    });
    var pid = options.personId;
  
    wx.request({
      url: app.globalData.hostUrl + '/api/personDetail',
      data: {
        id: pid
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function (res) {
        var userinfos = res.data.user
        console.log(userinfos)
        that.setData(userinfos);
      }
    });

  }

  
})