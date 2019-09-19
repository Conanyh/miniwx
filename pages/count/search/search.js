const app = getApp();
Page({

  data: {

  },

  onLoad: function (options) {
    var datas=wx.getStorageSync('searchdata');
    this.setData(datas);
    var searchtime = datas.search_date;
    // console.log(searchtime);
    //判断是字符串还是对象
    if (typeof searchtime == 'object'){
      this.setData(searchtime);
    }else{
      this.setData({searchtime: searchtime});
    }

  },

  onReady: function () {

  },

  onShow: function () {

  }

  
})