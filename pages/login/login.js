// pages/login/login.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  bindUser: function (e) {
    console.log(e.detail.value)
    console.log(e.detail.value.phone)
    console.log(e.detail.value.password)
    var that = this;
    var phone = e.detail.value.phone;
    var password = e.detail.value.password;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码有误',
      })
    } else if (!(/^[0-9a-zA-z]{6,12}$/g.test(password))) {
      wx.showModal({
        title: '提示',
        content: '密码有误',
      })
    } else {
      wx.login({
        success: res => {
          // console.log(res.code)
          // 发送 res.code 到后台换取 openid
          var code = res.code
          console.log(code)
          if (code) {
            wx.request({
              url: 'https://www.zhuzones.top/api/weappAuthorizations',
              method: 'post',
              header: {
                'content-type': 'application/json',
              },
              data: {
                code: code,
                phone: phone,
                password: password
              },
              success: function (res) {
                console.log(res)
                wx.setStorage({
                  key: 'token',
                  data: res.data.access_token,
                })
                var token = wx.getStorageInfoSync(token)
                console.log(token)
                wx.showModal({
                  title: '提示',
                  content: '登录成功',
                  success(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '../home/home',
                      })
                    } else if (res.cancel) {
                      wx.navigateTo({
                        url: '../login/login',
                      })
                    }
                  }
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '登录失败',
            })
          }
        }
      })
    }
  },

  register: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  }

})