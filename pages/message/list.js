// pages/message/list.js
const app = getApp();
const data = require('../../utils/data.js');

Page({
  data: {
    msgList: [],
  },

  // 设置msgList----------------------------------
  setMsgList: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setMsgList...res.data=", data);
    for (var i = 0; i < len; i++) {
      data[i]['index'] = i;
    }
    this.setData({
      msgList: data,
    });
  },

  //* 跳转页面************************************
  showMoreInfo(e) {
    var index = e.currentTarget.dataset.id,
      url = app.globalData.getUrlByCode(this.data.msgList[index].entity_code);
    wx.navigateTo({
      url: url + "?trader_id=" + this.data.msgList[index].trader_id + "&entity_type=" + this.data.msgList[index].entity_type + "&entity_code=" + this.data.msgList[index].entity_code + "&year=" + this.data.msgList[index].entity_year + "&month=" + this.data.msgList[index].entity_month
    });
  },

  //* 生命周期函数--监听页面加载****************
  onLoad: function(options) {
    var param = {
      their_associate_code: "01",
      their_associate_type: "000",
      their_associate_number: wx.getStorageSync('user_id'),
      their_associate_name: app.globalData.userInfo.nickName,
      other_associate_code: "12",
      other_associate_type: "000",
      other_associate_number: "00000",
      other_associate_name: "",
    }
    data.getMsgList(param, this.setMsgList);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})