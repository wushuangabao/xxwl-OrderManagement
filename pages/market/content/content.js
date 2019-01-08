// pages/market/content/content.js
const data = require('../../../utils/data.js'),
  app = getApp();

Page({
  data: {
    strAfterURL: '',
  },

  goToOrder: function() {
    wx.redirectTo({
      url: '../receipt/order',
    })
  },

  // 设置url中的参数字符串-----------------------------
  strAfterURL: function(role_type, user_id, user_name, content_type, content_number, content_name) {
    var their_associate_code = "01", //主体。用户为“01”。
      their_associate_type = role_type,
      their_associate_number = user_id,
      their_associate_name = user_name,
      other_associate_code = "07", //所选的主体。内容为“07”。
      other_associate_type = content_type,
      other_associate_number = content_number,
      other_associate_name = content_name;
    return '?their_associate_code=' + their_associate_code + '&their_associate_type=' + their_associate_type + '&their_associate_number=' + their_associate_number + '&their_associate_name=' + their_associate_name + '&other_associate_name=' + other_associate_name + '&other_associate_code=' + other_associate_code + '&other_associate_number=' + other_associate_number + '&other_associate_type=' + other_associate_type;
  },

  //* 生命周期函数--监听页面加载*************************
  onLoad: function(options) {
    if (options.content_id) { //来自于list页面的跳转
      var strAfterURL = this.strAfterURL(wx.getStorageSync('role_type'), wx.getStorageSync('user_id'), app.globalData.userInfo.nickName, options.content_type, options.content_id, options.content_name);
      this.setData({
        content_id: options.content_id,
        content_name: options.content_name,
        content_type: options.content_type,
        url: options.url + strAfterURL,
        url_: options.url
      });
    } else if (options.their_associate_code) { //来自于他人的分享且第一次进入本页
      wx.setStorageSync('options',options);
      wx.redirectTo({
        url:"/pages/index/index?signal=07"
      });
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
    var path = '/pages/market/content/content';
    if (this.data.strAfterURL) {
      path = path + this.data.strAfterURL + '&url=' + this.data.url_;
    } else {
      path = path + this.strAfterURL(wx.getStorageSync('role_type'), wx.getStorageSync('user_id'), app.globalData.userInfo.nickName, this.data.content_type, this.data.content_id, this.data.content_name) + '&url=' + this.data.url_;
    }
    console.log("onShareAppMessage, path =", path);
    return {
      title: this.data.content_name,
      path: path,
    }
  }
})