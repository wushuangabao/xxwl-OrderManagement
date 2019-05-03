// pages/message/safe/namelist.js
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
      data[i].safeAmount = data[i].person_amount + data[i].firm_amount;
    }
    this.setData({
      listData: data,
    });
  },

  //* 页面跳转*********************************
  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "detail?trader_id=" + this.data.trader_id + "&year=" + this.data.safe_year + "&month=" + this.data.safe_month + "&id=" + index
    });
  },

  //* 删除人员*********************************
  deleteAmount: function(e) {
    let index = e.currentTarget.dataset.id,
      _data = this.data.listData[index];
    data.deleteUserSafe(_data.safe_id, _data.safe_year, _data.safe_month, function(res) { //这个年、月是前面的？还是数据里的？
      console.log("deleteAmount...res = ", res);
    });
  },

  //* 增加人员********************************
  addAmount: function() {
    wx.navigateTo({
      url: "add?trader_id=" + this.data.trader_id
    });
  },

  //* 生命周期函数--监听页面加载*****************
  onLoad: function(options) {
    if (options.trader_id) {
      var param = {
        their_associate_code: "01",
        their_associate_type: "000",
        their_associate_number: wx.getStorageSync('company_id'),
        other_associate_code: "01",
        other_associate_type: "90901", //专属社保机构类型
        other_associate_number: "00000", //社保公司编号
        safe_year: options.year,
        safe_month: options.month,
        safe_type: "00"
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