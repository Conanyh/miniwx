const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function() {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindGetUserInfo: function(res) {
    let info = res;
    if (info.detail.userInfo) {
      wx.login({
        success: function(res) {
          console.log(res.code);
          if (res.code) {
            // 发起网络请求
            wx.request({
              method: "POST",
              url: app.globalData.hostUrl + '/api/weappAuthorizations',
              data: {
                code: res.code,
                nickname: info.detail.userInfo.nickName,
                avatarurl: info.detail.userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                if (res.data.status_code != '401') {
                  // token失效， 重新请求接口获取新的token
                  if (res.data.status_code == 500) {
                    wx.request({
                      method: "PUT",
                      url: app.globalData.hostUrl + '/api/authorizations/current',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + wx.getStorageSync('token')
                      },
                      success: function(res) {
                        wx.setStorageSync('token', res.data.access_token);
                      }
                    });
                  }
                  wx.setStorageSync('token', res.data.access_token);
                  // token时间， 默认是3600s
                  wx.setStorageSync('tokenTime', res.data.expires_in);
                  wx.request({
                    url: app.globalData.hostUrl + '/api/weappUser',
                    method: 'GET',
                    success: function (res) {
                      // 缓存用户所有信息
                      wx.setStorageSync('nickName', res.data.nickname);
                      wx.setStorageSync('avatarUrl', res.data.avatarurl);
                      wx.setStorageSync('integral', res.data.integral);
                      console.log(res.data);
                      wx.navigateTo({
                        url: '/pages/index/index',
                      })
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Bearer ' + wx.getStorageSync('token')
                    }
                  });
                  wx.navigateBack({
                    delete: 1
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '服务器错误',
                    success(res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: 'pages/wxlogin/wxlogin'
                        })
                      } else if (res.cancel) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            console.log('登录失败' + res.errMsg);
          }
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      console.log('拒绝授权');
    }
  }
})