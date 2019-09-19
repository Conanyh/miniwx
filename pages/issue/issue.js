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
    var description = e.detail.value.description
    var imgFile = that.data.src
    console.log(imgFile == undefined)

    if (title.length == 0) {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
      });
    } else if (address.length == 0) {
      wx.showModal({
        title: '提示',
        content: '地址不能为空',
      });
    } else if (description.length == 0) {
      wx.showModal({
        title: '提示',
        content: '描述不能为空',
      });
    } else if (imgFile == undefined) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
      });
    } else {
      wx.uploadFile({
        url: 'https://www.zhuzones.top/api/eventReport',
        method: 'post',
        filePath: imgFile[0],
        name: 'bad_img',
        header: {
          'Content-type': 'multipart/form-data',
          'Authorization': 'Bearer ' + app.globalData.token,
        },
        formData: {
          'title': title,
          'address': address,
          'description': description,
        },
        success: function (res) {
          if (res.statusCode == 201) {
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