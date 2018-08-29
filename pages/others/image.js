// pages/others/image.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 750,
    height: 750,
  },

  //* 生命周期函数--监听页面加载
  onLoad: function(options) {
    console.log('image onLoad...options =',options);
    const ctx = wx.createCanvasContext('myCanvas');
    this.setData({
      width: parseInt(options.width)*2,
      height: parseInt(options.height)*2,
    })
    ctx.drawImage(options.path, 0, 0);
    ctx.draw();
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