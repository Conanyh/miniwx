//获取应用实例
const app = getApp();

Page({
  data: {
    //测试效果
    timedata: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },

  onLoad: function(options) {
    var that = this;
    var carid = options.carid;
    console.log(carid);

    // wx.request({
    //   method: "POST",
    //   url: app.globalData.hostUrl + '/api/person/detail',
    //   data: {
    //     id: personid
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res.data)

    //   }
    // });

  },

  onShow: function() {

  }


})