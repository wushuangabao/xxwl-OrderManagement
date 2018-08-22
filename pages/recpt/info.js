// pages/recpt/info.js

const data = require('../../utils/data.js')

Page({

  data: {
    recpt_info: {},
    imgUrls: ["/imgs/image.png", "/imgs/image.png", "/imgs/image.png", "/imgs/image.png"],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  //* 点击图片************************************
  bindTapImg: function(e) {
    wx.previewImage({
      current: this.data.imgUrls[0], // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },

  // 设置this.data中的receipt数组-----------------------------------
  setRecptInfo: function(res) {
    var info = res.data,
      r_number = data.convertRecptNum(res.data[0].receipt_number),
      str = 'recpt_info.r_number';
    console.log("setRecptInfo...res.data =", info);
    if (info[0].remark == '')
      info[0].remark = '无备注';
    this.setData({
      recpt_info: info[0]
    });
    this.setData({
      [str]: r_number
    });
  },

  //* 生命周期函数--监听页面加载********************
  onLoad: function(options) {},

  //* 生命周期函数--监听页面显示********************
  onShow: function() {
    //数据库操作：查询用户所关心的订单信息
    data.getRecptData("0", wx.getStorageSync('r_number'), this.setRecptInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  //* 转发********************************************
  onShareAppMessage: function (res) {
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