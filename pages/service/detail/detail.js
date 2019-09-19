// pages/service/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: {},
    info: '',
    issueInfo: '',
    image: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this
    // var token = wx.getStorageSync('token');
    // var id = options.id
    // if (id) {
    //   wx.request({
    //     url: 'https://www.zhuzones.top/api/repairDetail/' + id,
    //     method: 'get',
    //     header: {
    //       'Content-type': 'application/json',
    //       'Authorization': 'Bearer ' + token,
    //     },
    //     success: function (res) {
    //       console.log(res.data.address)
    //       if (res.statusCode == 200) {
    //         that.setData({
    //           detail: res.data
    //         })
    //       } else {
    //         that.setData({
    //           info: '加载失败， 请重试'
    //         })
    //       }
    //     }
    //   })
    // }
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

  takePhoto(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        that.setData({
          src: tempFilePaths
        })
      },
    })
  },
  bindService: function (e) {
    console.log(e);
    var that = this
    var token = wx.getStorageSync('token');
    var issueInfo = e.detail.value.issueInfo
    var imgFile = this.data.src
    wx.uploadFile({
      url: 'https://www.zhuzones.top/api/completeRepair',
      method: 'post',
      filePath: imgFile[0],
      name: 'good_img',
      header: {
        'Content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
      formData: {
        'id': e.detail.value.id,
        'description': e.detail.value.issueInfo,
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 202) {
          wx.showModal({
            title: '提示',
            content: '维修完成',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../home/home',
                })
              } else if (res.cancel) {
                wx.reLaunch({
                  url: '../../home/home',
                })
              }
            }
          })
        }
      }
    })
  }
})