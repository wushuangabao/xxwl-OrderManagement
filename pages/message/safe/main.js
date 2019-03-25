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
    var data = res.data,
      len = data.length;
    console.log("setListData...data=", data);
    for (var i = 0; i < len; i++) {
      data[i]['index'] = i;
    }
    this.setData({
      listData: data,
    });
  },

  //* 页面跳转*********************************
  showMoreInfo:function(e){
    var index = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "detail?trader_id=" + this.data.trader_id + "&year=" + this.data.safe_year + "&month=" + this.data.safe_month + "&safe_id=" +this.data.listData[index].safe_id
    });
  },

  //* 生命周期函数--监听页面加载*****************
  onLoad: function(options) {
    if (options.trader_id) {
      var param = {
        their_associate_code: "01",
        their_associate_type: "000",
        their_associate_number: options.trader_id,
        other_associate_code: "13",
        other_associate_type: options.entity_type,
        other_associate_number: "00000",
        safe_year: options.year,
        safe_month: options.month,
        safe_type: "99"
      };
      data.getSafeAmount(param, this.setListData);
      this.setData({
        trader_id: options.trader_id,
        safe_year: options.year,
        safe_month: options.month,
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