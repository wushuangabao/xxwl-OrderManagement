// pages/progress/info.js

const data = require('../../utils/data.js')

Page({

  data: {
    info: {},
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  // 设置this.data中的info-----------------------------------
  setInfo: function(info) {
    var   j_number = data.convertRecptNum(info.job_number),
      str = 'info.j_number';
    if (info.remark == '')
      info.remark = '无备注';
    this.setData({
      info: info,
    });
    this.setData({
      [str]: j_number
    });
  },

  // 设置图片数组-------------------------------------
  setImgPath: function(r_number) {
    var path1 = wx.getStorageSync('imgUrl_1'),
      format = [wx.getStorageSync('imgUrl_2'), wx.getStorageSync('imgUrl_3'), wx.getStorageSync('imgUrl_4')],
      path = [path1];
    for (var i = 1; i < 4; i++) {
      if (format[i - 1])
        path.push(data.Img_Url + r_number + '_' + i + format[i - 1]);
    }
    this.setData({
      imgUrls: path
    });
  },

  //* 生命周期函数--监听页面加载********************
  onLoad: function(options) {
    var info = wx.getStorageSync('info');
    this.setImgPath(info.job_number);
    this.setInfo(info);
  },

  //* 生命周期函数--监听页面显示********************
  onShow: function() {},

  //* 转发********************************************
  onShareAppMessage: function(res) {
    if (res.from === 'button') { //如果来自页面内转发按钮
      console.log(res.target)
    }
    var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id')
    console.log("onShareAppMessage, path =", path)
    return {
      title: '生产管理小程序',
      path: path,
    }
  }
})