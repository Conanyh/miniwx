//获取应用实例
const app = getApp();
var toastHidden = true;

Page({

  data: {
    password: '',
    telphone: '',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad: function(options) {
    var that = this;
    toastHidden = true;
    this.setData({
      userInfo: app.globalData.userInfo,
      status: toastHidden
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    }
  },
  //表单提交事件
  bindUser: function(e) {
    var that = this;
    var formData = e.detail.value;

    if (e.detail.value.telphone.length == 0 || e.detail.value.password.length == 0) {
      wx.showModal({
        title: '提示',
        content: '用户信息不能为空 , 请认真填写 ！'
      });
    } else {
      wx.login({
        success: res => {
          var code1 = res.code;
         console.log("CODE:" + res.code)
         //return ;
          //发出绑定验证请求
          wx.request({
            method: "POST",
            url: app.globalData.hostUrl + '/api/weappAuthorizations',
            data: {
              phone: formData.telphone,
              password: formData.password,
              code: code1
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(res.data);
              if (res.data.status_code != '401') {
                //token失效，重新此接口获取新的token      
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
                //token时间 默认是3600s
                wx.setStorageSync('tokenTime', res.data.expires_in);

                toastHidden = false;
                that.setData({
                  status: toastHidden
                });

                wx.request({
                  url: app.globalData.hostUrl + '/api/thisUser',
                  success: function(res) {
                    console.log(res.data);
                    //缓存用户所有信息
                    if (res.data.roles[0]) {
                      wx.setStorageSync('chactor', res.data.roles[0].name);
                      wx.setStorageSync('username', res.data.name);
                      //跳转到首页
                      wx.switchTab({
                        url: '../index/index'
                      })
                    } else {
                      wx.setStorageSync('chactor', 'employer');
                      wx.setStorageSync('username', res.data.name);
                      wx.setStorageSync('phone', res.data.phone);
                      wx.setStorageSync('job_number', res.data.job_number);
                      wx.setStorageSync('departname', res.data.department.department_name);
                      //跳转到首页
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }

                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + wx.getStorageSync('token')
                  }
                });

              } else {
                wx.showModal({
                  title: '提示',
                  content: '手机号码或者密码填写错误',
                  success(res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: './login'
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
        },
        fail:function(err){
          console.log(err);
        }
      })

    }
  },

  //表单重置取消
  bindUserReset: function() {
    this.setData({
      password: '',
      telphone: ''
    })
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  }
})