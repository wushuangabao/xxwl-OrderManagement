// pages/market/wallet/wallet.js
const data = require('../../../utils/data.js'),
  app = getApp();

Page({
  data: {
    numberInWallet: "0.00",
    accLogs: [],
  },

  // accounting_date字符串处理----------------------
  formatTime: function(time) {
    return time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8);
  },

  // 设置accLogs----------------------------------------
  setAccLog: function(res) {
    var data_ = res.data,
      len = data_.length;
    for (var i = 0; i < len; i++) {
      data_[i].accounting_date = this.formatTime(data_[i].accounting_date);
      data_[i].index = i;
      if (data_[i].event_code == "1") //支出
        data_[i].amount = "-" + data_[i].amount;
      else if (data_[i].event_code == "2") //收入
        data_[i].amount = "+" + data_[i].amount;
    }
    console.log("setAccLog...res.data = ", data_);
    this.setData({
      accLogs: data_
    });
    this.setMenu();
  },
  setAcc: function(res) {
    var data_ = res.data[0],
      balance = data_.balance,
      str = "",
      zheng = Math.floor(balance);
    console.log("setAcc..res.data=", data_);
    if (balance > zheng) { //说明有小数位
      var balance10 = balance * 10;
      zheng = Math.floor(balance10);
      if (balance10 > zheng) //balance精确到0.01
        str = balance.toString();
      else //balance精确到0.1
        str = balance.toString() + "0";
    } else { //没有小数位
      str = balance.toString() + ".00";
    }
    this.setData({
      numberInWallet: str
    });
  },

  // 跳转到明细的详情页面（todo）-----------------------
  goToAccLogById: function() {},

  ////////////////////////////////////////////////
  // moreInfo menu 路由菜单
  ////////////////////////////////////////////////
  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id,
      type = this.data.accLogs[index].accountType;
    app.globalData.showMoreInfo(this, index, type, this.goToAccLogById);
  },

  setMenu: function() {
    app.globalData.setMenu(this, this.data.accLogs, "accountType", "08");
  },

  // 监听页面加载************************************
  onLoad: function(options) {
    wx.setStorageSync('gmt_modify', '9999-08-25 20:44:28');
    var param = {
      their_associate_code: "01", //主体。用户为“01”
      their_associate_type: wx.getStorageSync('role_type'),
      their_associate_number: wx.getStorageSync('user_id'),
      their_associate_name: getApp().globalData.userInfo.nickName,
      other_associate_code: "08", //所选的主体。钱包为“08”
      other_associate_type: "000",
      other_associate_number: "00000",
      other_associate_name: "",
    };
    data.getAccLog(param, this.setAccLog);
    data.getAcc(param, this.setAcc);
  },

  // 监听页面显示***************************************
  onShow: function() {
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "钱包")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    });
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