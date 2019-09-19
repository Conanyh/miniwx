const app = getApp();
Page({
  data: {
    bbh:'1.0.0',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(options) {
    var that=this;
    var type = wx.getStorageSync('chactor');
    if (type =='company_manage'){
      var username = wx.getStorageSync('username');
      that.setData({
        type: type,
        username: username
      });
    }else{
      var username = wx.getStorageSync('username');
      var telphone = wx.getStorageSync('phone');
      var jobno = wx.getStorageSync('job_number');
      var departname = wx.getStorageSync('departname');

      that.setData({
        type: type,
        username: username,
        telphone: telphone,
        jobno: jobno,
        departname: departname
      });
    }
   

    // 头像
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

  onShow: function() {
    var that = this;
    var type = wx.getStorageSync('chactor');
    if (type == 'company_manage') {
      var username = wx.getStorageSync('username');
      that.setData({
        type: type,
        username: username
      });
    } else {
      var username = wx.getStorageSync('username');
      var telphone = wx.getStorageSync('phone');
      var jobno = wx.getStorageSync('job_number');
      var departname = wx.getStorageSync('departname');

      that.setData({
        type: type,
        username: username,
        telphone: telphone,
        jobno: jobno,
        departname: departname
      });
    }

  },

  //登录
  defaultLogin: function(e) {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  //重置密码
  resetPass:function(){
    wx.navigateTo({
      url: 'resetPass/resetPass'
    })
  },
  //退出登录
  logout:function(){
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.clearStorage();//清除缓存
          wx.redirectTo({
            url: '../login/login'
          })
        }
      }
    })
  }

})

