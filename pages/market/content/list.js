// pages/market/content/list.js
const data = require('../../../utils/data.js'),
  app = getApp();

Page({
  data: {
    contents: [],
    menuObject: {},
    hasTabBar: true,
    isLoading: false,
  },

  //* 跳转到内容详情页面************************
  goToContent: function(e) {
    var index = e.currentTarget.dataset.id;
    this.goToContentById(index);
  },
  //* 跳转到内容详情页面ById************************
  goToContentById: function(id) {
    var content = this.data.contents[id];
    wx.navigateTo({
      url: 'content?content_id=' + content.content_number + '&content_name=' + content.content_name + '&content_type=' + content.content_type + '&url=' + content.content_ip,
    });
  },

  // 设置内容列表----------------------------------
  setContents: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setContent...res.data = ", data);
    if (len > 0) {
      var contents = this.data.contents;
      for (var i = 0; i < len; i++) {
        // data[i].img_path = data[i].image_1;
        data[i].img_path = "/imgs/image.png";
        data[i].index = i;
        contents.push(data[i]);
      }
      wx.setStorageSync('gmt_modify', data[len - 1].gmt_modify);
      this.setData({
        contents: contents
      });
      this.setMenu();
      this.setLoading(false);
    } else {
      this.setLoading(false);
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 1000
      });
    }
  },
  // 设置内容列表，并跳转到指定content_number的内容页面------
  setContentsAndGo: function(res) {
    var data = res.data,
      len = data.length,
      idToGo = -1;
    console.log("setContent...res.data = ", data);
    for (var i = 0; i < len; i++) {
      // data[i].img_path = data[i].image_1;
      data[i].img_path = "/imgs/image.png";
      data[i].index = i;
      if (data[i].content_number == this.data.content_number)
        idToGo = i;
    }
    this.setData({
      contents: data
    });
    wx.setStorageSync('gmt_modify', data[len - 1].gmt_modify);
    this.setLoading(false);
    this.setMenu();
    if (idToGo != -1)
      this.goToContentById(idToGo);
  },

  ///////////////////////////////////////////////////////
  // morInfo menu
  // 路由菜单
  ///////////////////////////////////////////////////////

  // 设置moreInfo菜单的内容--------------------------
  setMenu: function() {
    app.globalData.setMenu(this, this.data.contents, "content_type", "07");
  },

  //* 显示moreInfo menu************************
  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id,
      content_type = this.data.contents[index].content_type,
      content_number = this.data.contents[index].content_number;
    app.globalData.setTheirInfo("07", content_type, content_number);
    app.globalData.showMoreInfo(this, index, content_type, this.goToContentById);
  },

  ///////////////////////////////////////////////////////
  // 生命周期函数
  ///////////////////////////////////////////////////////

  //* 监听页面加载**********************************
  onLoad: function(options) {
    var param;
    if (options.hasTabBar == "false") {
      this.setData({
        hasTabBar: false
      });
      param = app.globalData.param;
    } else
      param = {
        their_associate_type: wx.getStorageSync('role_type'),
        their_associate_number: wx.getStorageSync('user_id'),
        their_associate_name: app.globalData.userInfo.nickName,
      };
    this.setData({
      param: param
    });
    wx.setStorageSync('gmt_modify', '');
    this.setLoading(true);
    if (options.signal == "07") { //表示由转发的小程序进入本页（之前已经去过首页）
      var options = wx.getStorageSync('options'),
        their_associate_code = options.their_associate_code,
        their_associate_type = options.their_associate_type,
        their_associate_number = options.their_associate_number,
        their_associate_name = options.their_associate_name,
        other_associate_code = options.other_associate_code,
        other_associate_type = options.other_associate_type,
        other_associate_number = options.other_associate_number,
        other_associate_name = options.other_associate_name;
      // var url = options.url + '?their_associate_code=' + their_associate_code + '&their_associate_type=' + their_associate_type + '&their_associate_number=' + their_associate_number + '&their_associate_name=' + their_associate_name + '&other_associate_name=' + other_associate_name + '&other_associate_code=' + other_associate_code + '&other_associate_number=' + other_associate_number + '&other_associate_type=' + other_associate_type;
      this.setData({
        // url: url,
        content_number: other_associate_number
      });
      var entity1 = {
          code: their_associate_code,
          type: their_associate_type,
          number: their_associate_number,
          name: their_associate_name
        },
        entity2 = {
          code: other_associate_code,
          type: other_associate_type,
          number: other_associate_number,
          name: other_associate_name
        },
        that = this;
      data.createRelation(entity1, entity2, function(res) {
        console.log('根据内容分享建立关系...res.data = ', res.data);
        data.getContent(param, that.setContentsAndGo);
      });
    } else { //表示不是由别人的转发进入的
      data.getContent(param, this.setContents);
    }
  },

  //* 监听页面显示****************************
  onShow: function() {
    //设置tabBar
    var myTabBar = app.globalData.tabBar,
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
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  //* 页面上拉触底事件的处理函数***************************
  onReachBottom: function() {
    if (this.data.isLoading)
      return;
    this.setLoading(true);
    data.getContent(this.data.param, this.setContents);
  },

  // 让用户进入、退出等待状态---------
  setLoading: function(b) {
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
  },

  //* 用户点击右上角分享**********************
  onShareAppMessage: function() {

  }
})