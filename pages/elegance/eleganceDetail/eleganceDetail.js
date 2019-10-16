// pages/elegance/eleganceDetail/eleganceDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseFocus: true,
  },
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    this.setData({
      token: token
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var token = wx.getStorageSync('token');
    this.setData({
      token: token
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token');
    this.setData({
      token: token
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // wx.startPullDownRefresh()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo: function (res) {
    let info = res;
    if (info.detail.userInfo) {
      wx.login({
        success: function (res) {
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
              success: function (res) {
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
                      success: function (res) {
                        wx.setStorageSync('token', res.data.access_token);
                      }
                    });
                  }
                  wx.setStorageSync('token', res.data.access_token);
                  // token时间， 默认是3600s
                  wx.setStorageSync('tokenTime', res.data.expires_in);
                  // wx.switchTab({
                  //   url: '/pages/mine/mine',
                  // })
                  wx.request({
                    url: 'https://www.zhuzones.top/api/weappUser',
                    method: 'GET',
                    success: function (res) {
                      // 缓存用户所有信息
                      wx.setStorageSync('nickName', res.data.nickname);
                      wx.setStorageSync('avatarUrl', res.data.avatarurl);
                      wx.setStorageSync('integral', res.data.integral);
                      // 获取当前页码并刷新
                      const pages = getCurrentPages();
                      const perpage = pages[pages.length - 1];
                      perpage.onLoad();
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Bearer ' + wx.getStorageSync('token')
                    }
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
  },

  sendSubmit:function (e) {
    var that = this;
    var comment = e.detail.value.comment;
    console.log(comment)
    wx.request({
      url: '',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
      },
      formData: {
        'comment': comment
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '成功',
            duration: 2000,
            mask: true,
            icon: 'success',
            success(res) {
              const pages = getCurrentPages();
              const perpage = pages[pages.length - 1];
              perpage.onLoad();
            }
          })
        } else {
          wx.showToast({
            title: '服务器繁忙',
            duration: 2000,
            mask: true,
            icon: 'loading',
            success(res) {
              const pages = getCurrentPages();
              const perpage = pages[pages.length - 1];
              perpage.onLoad();
            }
          })
        }
      }
    })
  }

  

})