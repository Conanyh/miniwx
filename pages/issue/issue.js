const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  takePhoto(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.compressImage({
          src: tempFilePaths[0],
          quality: 50
        })
        that.setData({
          src: tempFilePaths,
        })
      }
    })
  },

  bindIssueForm: function(e) {
    var that = this
    var title = e.detail.value.title
    var address = e.detail.value.address
    var contents = e.detail.value.contents
    var imgFile = that.data.src
    if (title.length == 0) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (address.length == 0) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (contents.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (imgFile == undefined) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.uploadFile({
        url: app.globalData.hostUrl + '/api/matterStore',
        method: 'POST',
        filePath: imgFile[0],
        name: 'image',
        header: {
          'Content-type': 'multipart/form-data',
          'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        },
        formData: {
          'title': title,
          'address': address,
          'contents': contents,
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200) {
            wx.showModal({
              title: '提示',
              content: '添加成功',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                } else if (res.cancel) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '服务器繁忙，请重试',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                } else if (res.cancel) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            })
          }
        }
      })
    }
  }

})