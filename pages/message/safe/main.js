// pages/message/safe/main.js
const app = getApp();
const data = require('../../../utils/data.js');

Page({
  data: {
    listData: [],
    trader_id: undefined,
    safe_year: undefined,
    safe_month: undefined,
  },

  setListData: function(res) {
    var data = res.data;
    console.log("setListData...res.data=", data);
    data[0].safeAmount = data[0].person_amount + data[0].firm_amount;
    this.setData({
      listData: data,
    });
  },

  //* 页面跳转*********************************
  showNameList: function() {
    var msg = this.data.listData[0],
      url = "/pages/message/safe/namelist?trader_id=" + this.data.trader_id + "&entity_type=" + msg.entity_type + "&year=" + msg.safe_year + "&month=" + msg.safe_month;
    wx.navigateTo({
      url: url
    });
  },

  //* 生命周期函数--监听页面加载*****************
  onLoad: function(options) {
    if (options.trader_id) {
      var param = {
        their_associate_code: "01",
        their_associate_type: "000",
        their_associate_number: options.trader_id,
        other_associate_code: "01", //公司
        other_associate_type: "90901", //专属社保机构类型
        other_associate_number: "00000", //社保公司编号
        safe_year: options.year,
        safe_month: options.month,
        safe_type: "99"
      };
      data.getSafeAmount(param, this.setListData);
      this.setData({
        trader_id: options.trader_id,
        safe_year: options.year,
        safe_month: options.month,
        entity_code: options.entity_code,
      });
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