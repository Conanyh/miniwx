//获取应用实例
const app = getApp();
var sliderWidth = 96;
var wxCharts = require('../../wxcharts.js');
//1、柱状图数据
var columnChart = null;
var chartData = {
  main: {
    title: '一年内总缺勤次数',
    // data: [15, 20, 45, 37, 21, 12, 25, 46, 28, 34, 25, 50],
    data: [],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  }
};
// 2、折线图
var lineChart = null;

Page({

  data: {
    tabs: ["柱状图", "折线图"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    //统计图数据
    chartTitle: '一年内总缺勤次数',
    isMainChartDisplay: true,

    // 搜索
    date: "", //开始时间
    date1: "", //结束时间

    datedata: []

  },
  //搜索有关
  bindDateChange1: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  // 表单搜索
  searchs: function(e) {
    var formData = e.detail.value;
    // console.log(formData);

    if (formData.starttime.length != 0) {
      if (formData.endtime.length != 0) {
        // 开始时间和截止时间都填写
        wx.request({
          method: "POST",
          url: app.globalData.hostUrl + '/api/search',
          data: {
            startdate: formData.starttime,
            enddate: formData.endtime
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          success: function(res) {
            var datas = res.data;
            // console.log(datas);
            wx.setStorageSync('searchdata', datas);
            //  跳转到搜索页面
            wx.navigateTo({
              url: './search/search'
            })
          }
        });
      } else {
        // 开始时间必须填写，截止时间可以不填写
        wx.request({
          method: "POST",
          url: app.globalData.hostUrl + '/api/search',
          data: {
            startdate: formData.starttime,
            enddate: formData.endtime
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          success: function(res) {
            var datas = res.data;
            console.log(datas);
            wx.setStorageSync('searchdata', datas);
            //  跳转到搜索页面
            wx.navigateTo({
              url: './search/search'
            })
          }
        });
      }
    } else if (formData.endtime.length != 0) {
      // 开始时间没有填写,截止时间填写
      wx.request({
        method: "POST",
        url: app.globalData.hostUrl + '/api/search',
        data: {
          startdate: formData.starttime,
          enddate: formData.endtime
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: function(res) {
          var datas = res.data;
          // console.log(datas);
          wx.setStorageSync('searchdata', datas);
          //  跳转到搜索页面
          wx.navigateTo({
            url: './search/search'
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '开始时间和截止时间不能为空！'
      })
    }

  },

  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //统计
    var canvaswidth = wx.getSystemInfoSync().windowWidth;
    that.setData({
      canvaswidth: canvaswidth
    });

    var url = app.globalData.hostUrl + '/api/count';
    app.wxRequest('GET', url, {},
      (res) => {
        var datas = res;
        that.setData(datas);
        chartData.main.data = datas.late_count
        for (var i = 0; i < datas.late_count.length;i++){
          if (datas.late_count[i]<=0){
            datas.late_count[i]=0
          }
        }
        that.setData({
          datedata: datas.late_count
        });
        //柱状图(默认加载第一个)
        that.columnimg(that.data.late_count);
      },
      (err) => {
        if (err.statusCode == '500') {
          wx.request({
            method: "PUT",
            url: app.globalData.hostUrl + '/api/authorizations/current',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: function(res) {
              wx.setStorageSync('token', res.data.access_token);
              app.wxRequest('GET', url, {},
                (res) => {
                  var datas = res;
                  that.setData(datas);
                  chartData.main.data = datas.late_count
                  that.setData({
                    datedata: datas.late_count
                  });
                  //柱状图(默认加载第一个)
                  that.columnimg(that.data.late_count);
                })
            }
          });
        }
    })

  },

  //点击tab选项卡序号，根据序号来加载。
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    var indexid = e.currentTarget.id;
    if (indexid == 0) {
      this.columnimg();
    } else if (indexid == 1) {
      this.lineimg();
    }
  },
  //获取设备宽度信息
  getDeviceWidth: function() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    return windowWidth;
  },

  //柱状图
  columnimg: function(datedata) {
    var that = this;
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '缺勤次数',
        data: datedata,
        data: chartData.main.data,
        format: function(val, name) {
          return val;
        }
      }],
      yAxis: {
        format: function(val) {
          return val;
        },
        title: '缺勤次数',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: this.getDeviceWidth(),
      height: 200,
    });
  },
  //折线图
  lineimg: function() {
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories, //数组数据（年、月）
      animation: true,
      series: [{
        name: '缺勤次数',
        // data: [2, 1, 3, 4, 3, 2, 4, 5, 6, 4, 5, 2],
        data: chartData.main.data,
        format: function(val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '缺勤次数',
        format: function(val) {
          return val.toFixed(0);
        },
        min: 0
      },
      width: this.getDeviceWidth(),
      height: 200,
      dataLabel: true, //是否在图表中显示数据内容值
      dataPointShape: true,
      extra: {
        lineStyle: 'curve' //曲线
      }
    });
  },
  // onShow: function() {
  //   var that=this;
  //   var url = app.globalData.hostUrl + '/api/count';
  //   app.wxRequest('GET', url, {},
  //     (res) => {
  //       var datas = res;
  //       that.setData(datas);
  //       chartData.main.data = datas.late_count;
  //       for (var i = 0; i < datas.late_count.length; i++) {
  //         if (datas.late_count[i] <= 0) {
  //           datas.late_count[i] = 0
  //         }
  //       }
  //       that.setData({
  //         datedata: datas.late_count
  //       });
  //       //柱状图(默认加载第一个)
  //       that.columnimg(that.data.late_count);
  //     },
  //     (err) => {
  //       if (err.statusCode == '500') {
  //         wx.request({
  //           method: "PUT",
  //           url: app.globalData.hostUrl + '/api/authorizations/current',
  //           header: {
  //             'content-type': 'application/x-www-form-urlencoded',
  //             'Authorization': 'Bearer ' + wx.getStorageSync('token')
  //           },
  //           success: function (res) {
  //             wx.setStorageSync('token', res.data.access_token);
  //             app.wxRequest('GET', url, {},
  //               (res) => {
  //                 var datas = res;
  //                 that.setData(datas);
  //                 chartData.main.data = datas.late_count
  //                 that.setData({
  //                   datedata: datas.late_count
  //                 });
  //                 //柱状图(默认加载第一个)
  //                 that.columnimg(that.data.late_count);
  //               })
  //           }
  //         });
  //       }
  //     })

  // },

  //折线图
  touchHandler2: function(e) {
    // console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      format: function(item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  createSimulationData: function() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
      categories.push((i + 1) + '月');
    }
    return {
      categories: categories
    }
  }

})