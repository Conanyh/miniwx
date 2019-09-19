const app = getApp();
Page({

  data: {
    phone: '',
    password: '',
    confirmpass: ''
  },

  onLoad: function(options) {

  },

  onShow: function() {

  },

  //重置密码
  resetpassword: function(e) {
    var that = this;
    var formData = e.detail.value;
    // console.log(formData);
    if (e.detail.value.phone.length == 0 || e.detail.value.password.length == 0 || e.detail.value.confirmpass.length == 0) {
      wx.showModal({
        title: '提示',
        content: '信息不能为空 , 请认真填写 ！'
      });
    } else if (e.detail.value.password.length > 10 || e.detail.value.confirmpass.length > 10) {
      wx.showModal({
        title: '提示',
        content: '密码和新密码不能大于十位！'
      });
    } else if (e.detail.value.password.length < 6 || e.detail.value.confirmpass.length < 6) {
      wx.showModal({
        title: '提示',
        content: '密码和新密码不能小于六位！'
      });
    } else{
      wx.request({
        method: "POST",
        url: app.globalData.hostUrl + '/api/resetPassword',
        data: {
          phone: formData.phone,
          password: formData.password,
          newpwd: formData.confirmpass
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: function(res) {
          // console.log(res.data);
          if (res.data.access_token){
            wx.showModal({
              title: '提示',
              content: '修改密码成功',
              success: function () {
                wx.navigateTo({
                  url: '../../login/login',
                })
              }
            });
            wx.setStorageSync('token', res.data.access_token);
          }
         
          if (res.data.status_code == '401') {
            wx.showModal({
              title: '提示',
              content: '原密码输入错误！'
            });
          }
          
         
        }

      });
    }

  }

})