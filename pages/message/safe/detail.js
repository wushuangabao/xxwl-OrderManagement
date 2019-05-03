// pages/message/safe/detail.js
const app = getApp();
const data = require('../../../utils/data.js');

Page({
  data: {

  },

  setListData: function(res) {
    var data = res.data
    //   len = data.length;
    console.log("setListData...data=", data);
    // for (var i = 0; i < len; i++) {
    //   data[i]['index'] = i;
    // }
    this.setData({
      listData: data,
    });
  },

  //* 生命周期函数--监听页面加载************
  onLoad: function(options) {
      
    if (options.trader_id) {
      let pages = getCurrentPages(),
        prevPage = pages[pages.length - 2]; //-2为上一级页面
      this.setData({
        amount: prevPage.data.listData[options.id]
      });
      let param = {
        their_associate_code: "01",
        their_associate_type: "000",
        their_associate_number: options.trader_id,
        other_associate_code: "01",
        other_associate_type: "000",
        other_associate_number: this.data.amount.safe_id,
        safe_year: options.year,
        safe_month: options.month
      };
      data.getUserSafeAmount(param, this.setListData);
    }
  },

  onReady: function() {

  },

  onShow: function() {

  },

  onHide: function() {

  },

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