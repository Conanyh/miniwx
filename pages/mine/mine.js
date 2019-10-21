const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    bbh: 1.1,
    canIUse: wx.canIUse('button.open-type.getUsersInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var integral = wx.getStorageSync('integral');
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      token: token,
      integral: integral
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var token = wx.getStorageSync('token');
    var integral = wx.getStorageSync('integral');
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      token: token,
      integral: integral
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token');
    var integral = wx.getStorageSync('integral');
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      token: token,
      integral: integral
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  about:function () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }, 

  // 登录
  defaultLogin: function (e) {
    // 点击登录
    wx.navigateTo({
      url: '/pages/wxlogin/wxlogin',
    })
  }

})