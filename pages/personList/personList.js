//获取应用实例
const app = getApp();
var firstpage;
var lastpage;
var nextpage;
Page({
  data: {
    personList: [],
  },

  onLoad: function(options) {

    var that = this;
    var url = app.globalData.hostUrl + '/api/allPerson';
    app.wxRequest('GET', url,{},
      (res) => {
        firstpage = res.data.first_page_url;
        lastpage = res.data.last_page_url;
        nextpage = res.data.next_page_url;
        that.setData({
          personList: res.data.data
        })
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
                  firstpage = res.data.first_page_url;
                  lastpage = res.data.last_page_url;
                  nextpage = res.data.next_page_url;
                  that.setData({
                    personList: res.data.data
                  })
                })
            }
          });
        }
      })

  },

  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    app.wxRequest('GET', firstpage, {},
      (res) => {
        // console.log(res.data.data)
        that.setData({
          personList: res.data.data
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
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
            success: function (res) {
              wx.setStorageSync('token', res.data.access_token);
              app.wxRequest('GET', firstpage, {},
                (res) => {
                  that.setData({
                    personList: res.data.data
                  });
                  wx.hideNavigationBarLoading();
                  wx.stopPullDownRefresh();
                })
            }
          });
        }
    })
  },

  onReachBottom: function() {
    var that = this;
    if (nextpage) {
      wx.showLoading({
        title: '玩命加载中',
      })

      app.wxRequest('GET', nextpage, {},
        (res) => {
          nextpage = res.data.next_page_url;
          var personList = that.data.personList;
          var oldData = that.data.personList;
          that.setData({
            personList: oldData.concat(res.data.data)
          })
          wx.hideLoading();
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
              success: function (res) {
                wx.setStorageSync('token', res.data.access_token);
                app.wxRequest('GET', nextpage, {},
                  (res) => {
                    nextpage = res.data.next_page_url;
                    var personList = that.data.personList;
                    var oldData = that.data.personList;
                    that.setData({
                      personList: oldData.concat(res.data.data)
                    })
                    wx.hideLoading();
                  })
              }
            });
          }
        })
    }
  },

  //人员详情页面
  personInfo: function(e) {
    var personid = e.currentTarget.dataset.pid; //id
    wx.navigateTo({
      url: 'personDetail/personDetail?personId=' + personid
    })
  }


})