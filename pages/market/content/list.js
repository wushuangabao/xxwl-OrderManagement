// pages/market/content/list.js
const data = require('../../../utils/data.js')

Page({
  data: {
    contents: [{
        content_name: "",
        remark: "",
        img_path: ""
      },
      {
        content_name: "",
        remark: "",
        img_path: ""
      },
    ]
  },

  // 跳转到内容详情页面************************
  goToContent: function(e) {
    var index = e.currentTarget.dataset.id,
      content = this.data.contents[index];
    wx.navigateTo({
      url: 'content?content_id=' + content.content_number + '&content_name=' + content.content_name + '&content_type=' + content.content_type,
    })
  },

  setContents: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setContent...res.data = ", data);
    for (var i = 0; i < len; i++) {
      // data[i].img_path = data[i].image_1;
      data[i].img_path = "/imgs/image.png";
      data[i].index = i;
    }
    this.setData({
      contents: data
    })
  },

  onLoad: function(options) {
    data.getContent({}, this.setContents);
  },

  onReady: function() {

  },

  onShow: function() {
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "内容")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    })
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