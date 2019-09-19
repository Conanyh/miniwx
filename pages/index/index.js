//获取应用实例
const app = getApp()

Page({
  data: {
    login: true,
    count: false,
    persons: false,
    attendance: false,
    cars: false,

    imgUrls: [
      '../../images/banner1.jpg',
      '../../images/banner2.jpg',
      '../../images/banner3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2500,
    duration: 1000,
    indicatorActiveColor: '#515151',
    indicatorColor: 'rgba(255, 255, 255, .7)'
  },

  onLoad: function() {
    var that = this;
    var chactors = wx.getStorageSync('chactor');
    that.setData({
      chactors: chactors
    });

    if (chactors == 'company_manage') {
      that.setData({
        login: false,
        count: true,
        persons: true,
        attendance: true,
        cars: true
      });
    } else {
      that.setData({
        login: false,
        count: false,
        persons: false,
        attendance: true,
        cars: true
      });
    }
  },

  onShow: function() {
    var that = this;
    var chactors = wx.getStorageSync('chactor');
    if (chactors == 'company_manage') {
      that.setData({
        login: false,
        count: true,
        persons: true,
        attendance: true,
        cars: true
      });
    } else {
      that.setData({
        login: false,
        count: false,
        persons: false,
        attendance: true,
        cars: true
      });
    }
  },

  //统计
  tongji: function(e) {
    wx.navigateTo({
      url: '../count/count'
    });
  },

  //所有用户
  persons: function(e) {
    wx.navigateTo({
      url: '../personList/personList'
    });
  },

  //考勤信息
  attendance: function(e) {
    wx.navigateTo({
      url: '../attendance/attendance'
    });
  },
  //车辆信息
  cars: function(e) {
    wx.navigateTo({
      url: '../cars/cars'
    });
  },

  // 绑定用户
  bindUser: function(e) {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: '三晖人脸识别系统',
      path: '/pages/index/index'
    }
  }

})