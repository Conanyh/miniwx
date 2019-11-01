const app = getApp()
var adds = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    address: '',
    contents: '',
    files: []
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

  // takePhoto(e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 3,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function(res) {
  //       var tempFilePaths = res.tempFilePaths;
  //       console.log(tempFilePaths);
  //       wx.compressImage({
  //         src: tempFilePaths[0],
  //         quality: 50
  //       })
  //       that.setData({
  //         src: tempFilePaths,
  //       })
  //     }
  //   })
  // },

  chooseImage: function(e) {
    var that = this;
    var imges = that.data.files;
    wx.chooseImage({
      count: 9 - imges.length,
      delete: true,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      },
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  deleteImage: function(e) {
    var that = this;
    var images = that.data.files;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          images.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          files: images
        });
      }
    })
  },

  bindIssueForm: function(e) {
    var that = this
    var title = e.detail.value.title
    var address = e.detail.value.address
    var contents = e.detail.value.contents
    // var imgFile = that.data.src
    var imgFile = that.data.files

    var images_list = []; //设置一个空数组进行存储服务器端图片

    console.log(imgFile)
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
    } else if (imgFile.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 2000
      });
    } else {
      for (var i = 0; i < imgFile.length; i++) {
        wx.uploadFile({
          url: app.globalData.hostUrl + '/api/matterStoreImage',
          method: 'POST',
          filePath: imgFile[i],
          name: 'image',
          header: {
            'Content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
          },
          formData: null,
          success: function(res) {
            // console.log(res.data)
            // 后端返回图片上传到服务器的地址的json
            // 图片json转数组
            var jsonObj = JSON.parse(res.data)
            console.log(jsonObj.url)
            images_list.push(jsonObj.url);
            if (imgFile.length == images_list.length) {
              var images_str = images_list.join(",") // 把存放图片地址的数组转化为逗号分隔的字符串
              console.log(images_str)
              wx.request({
                url: app.globalData.hostUrl + '/api/matterStoreInfo',
                method: 'POST',
                data: {
                  'title': title,
                  'address': address,
                  'contents': contents,
                  'many_images': images_str,
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                },
                success(res) {
                  if (res.statusCode == 200) {
                    wx.showModal({
                      title: '提示',
                      content: '上报成功',
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
      }


      // wx.uploadFile({
      //   url: app.globalData.hostUrl + '/api/matterStore',
      //   method: 'POST',
      //   filePath: imgFile[0],
      //   name: 'image',
      //   header: {
      //     'Content-type': 'multipart/form-data',
      //     'Authorization': 'Bearer ' + wx.getStorageSync('token'),
      //   },
      //   formData: {
      //     'title': title,
      //     'address': address,
      //     'contents': contents,
      //   },
      //   success: function (res) {
      //     console.log(res);
      //     if (res.statusCode == 200) {
      //       wx.showModal({
      //         title: '提示',
      //         content: '添加成功',
      //         success(res) {
      //           if (res.confirm) {
      //             wx.reLaunch({
      //               url: '/pages/index/index',
      //             })
      //           } else if (res.cancel) {
      //             wx.reLaunch({
      //               url: '/pages/index/index',
      //             })
      //           }
      //         }
      //       })
      //     } else {
      //       wx.showModal({
      //         title: '提示',
      //         content: '服务器繁忙，请重试',
      //         success(res) {
      //           if (res.confirm) {
      //             wx.reLaunch({
      //               url: '/pages/index/index',
      //             })
      //           } else if (res.cancel) {
      //             wx.reLaunch({
      //               url: '/pages/index/index',
      //             })
      //           }
      //         }
      //       })
      //     }
      //   }
      // })

    }
  },


})