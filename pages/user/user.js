// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bbh: '1.0',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUsersInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.user();
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
    var token = wx.getStorageSync('token')
    this.setData({
      token: token
    })
  },

  user: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zhuzones.top/api/user',
      method: 'get',
      header: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res)
        that.setData({
          name: res.data.name,
          role: res.data.role
        })
      }
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

  // 登录
  defaultLogin: function (e) {
    // 点击登录
    wx.navigateTo({
      url: '../login/login',
    })
  }

})