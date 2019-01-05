// pages/market/content/content.js
Page({
  data: {
    url: "https://140.143.154.96/day07/",
  },

  goToOrder: function() {
    wx.redirectTo({
      url: '../receipt/order',
    })
  },

  //* 生命周期函数--监听页面加载*************************
  onLoad: function(options) {
    if (options.content_id)
      this.setData({
        content_id: options.content_id,
        content_name: options.content_name,
        content_type: options.content_type,
      });
    else if (options.their_associate_code) {
      var their_associate_code = options.their_associate_code,
        their_associate_type = options.their_associate_type,
        their_associate_number = options.their_associate_number,
        their_associate_name = options.their_associate_name,
        other_associate_code = options.other_associate_code,
        other_associate_type = options.other_associate_type,
        other_associate_number = options.other_associate_number,
        other_associate_name = options.other_associate_name;
      var url = this.data.url + '?their_associate_code=' + their_associate_code + '&their_associate_type=' + their_associate_type + '&their_associate_number=' + their_associate_number + '&their_associate_name=' + their_associate_name + '&other_associate_name=' + other_associate_name + '&other_associate_code=' + other_associate_code + '&other_associate_number=' + other_associate_number + '&other_associate_type=' + other_associate_type;
    }
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

  //* 用户点击右上角分享***************************
  onShareAppMessage: function() {
    var their_associate_code = "01", //主体。用户为“01”。
      their_associate_type = wx.getStorageSync('role_type'),
      their_associate_number = wx.getStorageSync('user_id'),
      their_associate_name = getApp().globalData.userInfo.nickName,
      other_associate_code = "07", //所选的主体。内容为“07”。
      other_associate_type = this.data.content_type,
      other_associate_number = this.data.content_id,
      other_associate_name = this.data.content_name,
      path = '/pages/market/content/content?their_associate_code=' + their_associate_code + '&their_associate_type=' + their_associate_type + '&their_associate_number=' + their_associate_number + '&their_associate_name=' + their_associate_name + '&other_associate_name=' + other_associate_name + '&other_associate_code=' + other_associate_code + '&other_associate_number=' + other_associate_number + '&other_associate_type=' + other_associate_type;
    console.log("onShareAppMessage, path =", path);
    return {
      title: this.data.content_name,
      path: path,
    }
  }
})