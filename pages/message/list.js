// pages/message/list.js
const app = getApp();
const data = require('../../utils/data.js');

Page({
  data: {
    msgList: [],
    hasTabBar: true,
  },

  // 设置msgList----------------------------------
  setMsgList: function(res) {
    var data = res.data,
    len=data.length,
    msgList=this.data.msgList;
    console.log("setMsgList...data =", res.data);
    if(len>0){
      for(var i=0;i<len;i++){
        data[i].img_path = "/imgs/image.png";
        msgList.push(data[i]);
      }
      wx.setStorageSync('gmt_modify', data[len - 1].gmt_modify);
      this.setData({
        msgList: msgList
      });
      this.setLoading(false);
    }else{
      this.setLoading(false);
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 1000
      });
    }
  },

  //* 跳转页面************************************
  showMoreInfo(e) {
    var index = e.currentTarget.id,
      url = app.globalData.getUrlByCode(this.data.msgList[index].entity_code);
    wx.setStorageSync('gmt_modify', '');
    wx.navigateTo({
      url: url + "?trader_id=" + this.data.msgList[index].trader_id + "&entity_type=" + this.data.msgList[index].entity_type + "&entity_code=" + this.data.msgList[index].entity_code + "&year=" + this.data.msgList[index].entity_year + "&month=" + this.data.msgList[index].entity_month
    });
  },

  // 获取消息列表数据------------
  getMsgList(){
    this.setLoading(true);
    var param = {
      their_associate_code: "01",
      their_associate_type: "000",
      their_associate_number: wx.getStorageSync('company_id'),
      their_associate_name: app.globalData.userInfo.nickName,
      other_associate_code: "12",
      other_associate_type: "000",
      other_associate_number: "00000",
      other_associate_name: "",
    };
    data.getMsgList(param, this.setMsgList);
  },

  //* 生命周期函数--监听页面加载****************
  onLoad: function(options) {
    wx.setStorageSync('gmt_modify', '');
    this.getMsgList();
  },

  //* 页面上拉触底事件的处理函数***************************
  onReachBottom: function () {
    if (this.data.isLoading)
      return;
    this.getMsgList();
  },

  //* 监听页面显示***********************************
  onShow: function() {
    // 设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "消息")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    })
  },

  // 让用户进入、退出等待状态---------
  setLoading: function (b) {
    if (b) {
      wx.showLoading({
        title: '加载中',
      });
      this.setData({
        isLoading: true
      });
    } else {
      wx.hideLoading();
      this.setData({
        isLoading: false
      });
    }
  }

})