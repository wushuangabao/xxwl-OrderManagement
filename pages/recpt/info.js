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

  //* 点击图片***************************************
  bindTapImg: function(e) {
    var urls = this.data.imgUrls,
      len = urls.length,
      i = 0,
      url = e.currentTarget.dataset.url;
    for (i = 0; i < len; i++) {
      if (url == urls[i])
        break;
    };
    wx.previewImage({
      current: this.data.imgUrls[i], // 当前显示图片的http链接
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
      recpt_info: info[0],
    });
    this.setData({
      [str]: r_number
    });
  },

  // 设置图片数组-------------------------------------
  setImgPath: function(r_number) {
    var path1 = wx.getStorageSync('imgUrl_1'),
      path = [path1];
    this.setData({
      imgUrls: path
    })
    for (var i = 2; i <= 4; i++)
      this.getImgPath(i, r_number);
  },

  // 下载图片-----------------------------------------
  getImgPath: function(i, r_number) {
    var that = this;
    wx.downloadFile({
      url: data.API_IMGDOWN + i,
      header: {
        "receipt_number": r_number
      },
      success: function(res) {
        if (res.statusCode === 200) {
          console.log('getImgPath' + i + '...res =', res);
          that.setData({
            ['imgUrls[' + (i - 1) + ']']: res.tempFilePath
          });
        }
      }
    })
  },

  //* 生命周期函数--监听页面加载********************
  onLoad: function(options) {},

  //* 生命周期函数--监听页面显示********************
  onShow: function() {
    var r_number = wx.getStorageSync('r_number');
    this.setImgPath(r_number);
    data.getRecptData("0", r_number, this.setRecptInfo)
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