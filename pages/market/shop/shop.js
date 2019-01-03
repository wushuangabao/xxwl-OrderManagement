// pages/market/shop/shop.js
Page({
  data: {
    productInfos: [],
    remark: '',
    shop_name: '',
    shop_address: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  //* 生命周期函数--监听页面加载************
  onLoad: function(options) {
    //从缓存中读取图片地址、产品信息------
    var imgUrls = [],
      index = 0,
      productInfos = [],
      productTexts = wx.getStorageSync('product'),
      len = productTexts.length;
    productTexts[0] ="2018年3月7日 - 微信小程序中使用的逻辑文件 ,本质上还是.js 文件,脚本中的很多东西进行了二次封装,本质上可以在外部调试中,查看 逻辑层(App Service) 小程序开发框架2018年3月7日 - 微信小程序中使用的逻辑文件 ,本质上还是.js 文件,脚本中的很多东西进行了二次封装,本质上可以在外部调试中,查看 逻辑层(App Service) 小程序开发框架2018年3月7日 - 微信小程序中使用的逻辑文件 ,本质上还是.js 文件,脚本中的很多东西进行了二次封装,本质上可以在外部调试中,查看 逻辑层(App Service) 小程序开发框架..."
    for (var i = 0; i < 4; i++) {
      var url = wx.getStorageSync('imgUrl_' + (i + 1).toString());
      if (url.length > 5) { //判断是否为合法的图片地址
        imgUrls[index] = url;
        index++;
      }
    }
    //如果图片数少于产品描述的数目，用默认图片顶替------
    if (index < len) {
      for (var i = index; i < len; i++) {
        imgUrls[i] = '/imgs/image.png';
      }
    }
    //设置data----------
    for (var i = 0; i < len; i++) {
      var productInfo = {
        imgUrl: imgUrls[i],
        text: productTexts[i]
      };
      productInfos.push(productInfo);
    }
    this.setData({
      productInfos: productInfos,
      remark: options.remark,
      shop_name: options.name,
      shop_address: options.address,
    })
  },

  //* 生命周期函数--监听页面显示***************
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

  }
})